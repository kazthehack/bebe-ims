#!/usr/bin/env python3
from __future__ import annotations

import os
import argparse
import json
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


def load_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip("'\"")
    return values


def bool_value(value: str | None, default: bool) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def run(cmd: list[str], cwd: Path, env: dict[str, str], capture: bool = False) -> str:
    print(f"==> {' '.join(cmd)}", flush=True)
    result = subprocess.run(
        cmd,
        cwd=str(cwd),
        env=env,
        check=True,
        text=True,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE if capture else None,
    )
    return result.stdout.strip() if capture and result.stdout else ""


def require(config: dict[str, str], name: str) -> str:
    value = config.get(name, "").strip()
    if not value:
        raise SystemExit(f"Missing required config value: {name}")
    return value


def aws_query(
    env: dict[str, str],
    repo_root: Path,
    args: list[str],
    default: str = "",
) -> str:
    try:
        return run(["aws", *args], cwd=repo_root, env=env, capture=True)
    except subprocess.CalledProcessError:
        return default


def aws_json(
    env: dict[str, str],
    repo_root: Path,
    args: list[str],
) -> dict[str, Any]:
    output = run(["aws", *args, "--output", "json"], cwd=repo_root, env=env, capture=True)
    return json.loads(output) if output else {}


def stack_status(env: dict[str, str], repo_root: Path, stack_name: str) -> str:
    return aws_query(
        env,
        repo_root,
        [
            "cloudformation",
            "describe-stacks",
            "--stack-name",
            stack_name,
            "--query",
            "Stacks[0].StackStatus",
            "--output",
            "text",
        ],
    )


def wait_for_stack_delete(env: dict[str, str], repo_root: Path, stack_name: str, timeout_seconds: int = 300) -> None:
    deadline = time.monotonic() + timeout_seconds
    while time.monotonic() < deadline:
        status = stack_status(env, repo_root, stack_name)
        if not status:
            print(f"==> Stack {stack_name} deleted")
            return
        print(f"==> Waiting for stack {stack_name} delete: {status}")
        time.sleep(10)
    raise RuntimeError(f"Timed out waiting for stack {stack_name} to delete")


def stack_resource(
    env: dict[str, str],
    repo_root: Path,
    stack_name: str,
    resource_type: str,
) -> str:
    return aws_query(
        env,
        repo_root,
        [
            "cloudformation",
            "describe-stack-resources",
            "--stack-name",
            stack_name,
            "--query",
            f"StackResources[?ResourceType=='{resource_type}']|[0].PhysicalResourceId",
            "--output",
            "text",
        ],
    )


def dynamodb_table_description(env: dict[str, str], repo_root: Path, table_name: str) -> dict[str, Any] | None:
    try:
        response = aws_json(
            env,
            repo_root,
            ["dynamodb", "describe-table", "--table-name", table_name],
        )
    except subprocess.CalledProcessError:
        return None
    return response.get("Table")


def validate_existing_dynamodb_table(table: dict[str, Any], table_name: str) -> None:
    status = table.get("TableStatus")
    if status in {"DELETING", "ARCHIVING", "INACCESSIBLE_ENCRYPTION_CREDENTIALS"}:
        raise RuntimeError(f"DynamoDB table {table_name} is not deployable; status is {status}")

    key_schema = {entry.get("KeyType"): entry.get("AttributeName") for entry in table.get("KeySchema", [])}
    if key_schema.get("HASH") != "pk" or key_schema.get("RANGE") != "sk":
        raise RuntimeError(f"DynamoDB table {table_name} must use pk/sk as its primary key")

    indexes = {index.get("IndexName"): index for index in table.get("GlobalSecondaryIndexes", [])}
    gsi1 = indexes.get("gsi1")
    if not gsi1:
        raise RuntimeError(f"DynamoDB table {table_name} must already have required GSI gsi1")

    gsi_key_schema = {entry.get("KeyType"): entry.get("AttributeName") for entry in gsi1.get("KeySchema", [])}
    if gsi_key_schema.get("HASH") != "gsi1pk" or gsi_key_schema.get("RANGE") != "gsi1sk":
        raise RuntimeError(f"DynamoDB table {table_name} gsi1 must use gsi1pk/gsi1sk as its key")


def current_ecs_state(env: dict[str, str], repo_root: Path, stack_name: str) -> dict[str, str]:
    cluster_name = stack_resource(env, repo_root, stack_name, "AWS::ECS::Cluster")
    service_name = stack_resource(env, repo_root, stack_name, "AWS::ECS::Service")
    state = {
        "cluster_name": cluster_name if cluster_name != "None" else "",
        "service_name": service_name if service_name != "None" else "",
        "task_definition": "",
        "desired_count": "",
    }
    if not state["cluster_name"] or not state["service_name"]:
        return state

    service_data = aws_query(
        env,
        repo_root,
        [
            "ecs",
            "describe-services",
            "--cluster",
            state["cluster_name"],
            "--services",
            state["service_name"],
            "--query",
            "services[0].[taskDefinition,desiredCount]",
            "--output",
            "text",
        ],
    )
    if service_data and service_data != "None":
        parts = service_data.split()
        state["task_definition"] = parts[0] if parts else ""
        state["desired_count"] = parts[1] if len(parts) > 1 else ""
    return state


def stop_running_tasks(env: dict[str, str], repo_root: Path, cluster_name: str, service_name: str) -> None:
    tasks = aws_query(
        env,
        repo_root,
        [
            "ecs",
            "list-tasks",
            "--cluster",
            cluster_name,
            "--service-name",
            service_name,
            "--desired-status",
            "RUNNING",
            "--query",
            "taskArns",
            "--output",
            "text",
        ],
    )
    if not tasks or tasks == "None":
        return
    for task_arn in tasks.split():
        run(
            [
                "aws",
                "ecs",
                "stop-task",
                "--cluster",
                cluster_name,
                "--task",
                task_arn,
                "--reason",
                "Deployment rollback from infra/cdk/deploy.py",
            ],
            cwd=repo_root,
            env=env,
        )


def rollback_deployment(
    env: dict[str, str],
    repo_root: Path,
    stack_name: str,
    previous_state: dict[str, Any] | None = None,
    reason: str = "deployment failed",
) -> None:
    print(f"==> Rollback requested: {reason}")
    status = stack_status(env, repo_root, stack_name)
    if not status:
        print(f"==> Stack {stack_name} does not exist; nothing to roll back")
        return

    print(f"==> Stack {stack_name} status: {status}")
    stack_existed_before = (previous_state or {}).get("stack_existed_before", True)
    if not stack_existed_before and status not in {"DELETE_IN_PROGRESS", "DELETE_COMPLETE"}:
        print("==> First-time deployment failed; deleting stack so the next deploy can recreate it")
        run(["aws", "cloudformation", "delete-stack", "--stack-name", stack_name], cwd=repo_root, env=env)
        wait_for_stack_delete(env, repo_root, stack_name)
        return

    if status in {"UPDATE_IN_PROGRESS", "UPDATE_COMPLETE_CLEANUP_IN_PROGRESS"}:
        run(["aws", "cloudformation", "cancel-update-stack", "--stack-name", stack_name], cwd=repo_root, env=env)
    elif status in {"CREATE_IN_PROGRESS", "ROLLBACK_FAILED", "CREATE_FAILED"}:
        run(["aws", "cloudformation", "delete-stack", "--stack-name", stack_name], cwd=repo_root, env=env)
        return

    ecs_state = current_ecs_state(env, repo_root, stack_name)
    cluster_name = ecs_state.get("cluster_name", "")
    service_name = ecs_state.get("service_name", "")
    if not cluster_name or not service_name:
        print("==> ECS service not found from stack resources; rollback stops here")
        return

    previous_task = (previous_state or {}).get("task_definition", "")
    previous_desired = (previous_state or {}).get("desired_count", "")
    if previous_task:
        command = [
            "aws",
            "ecs",
            "update-service",
            "--cluster",
            cluster_name,
            "--service",
            service_name,
            "--task-definition",
            previous_task,
            "--force-new-deployment",
        ]
        if previous_desired:
            command.extend(["--desired-count", str(previous_desired)])
        run(command, cwd=repo_root, env=env)
        print(f"==> ECS service restored to previous task definition: {previous_task}")
    else:
        run(
            [
                "aws",
                "ecs",
                "update-service",
                "--cluster",
                cluster_name,
                "--service",
                service_name,
                "--desired-count",
                "0",
            ],
            cwd=repo_root,
            env=env,
        )
        stop_running_tasks(env, repo_root, cluster_name, service_name)
        print("==> No previous task definition found; ECS service scaled to 0")


def stack_outputs(env: dict[str, str], repo_root: Path, stack_name: str) -> dict[str, str]:
    output = aws_query(
        env,
        repo_root,
        [
            "cloudformation",
            "describe-stacks",
            "--stack-name",
            stack_name,
            "--query",
            "Stacks[0].Outputs[*].[OutputKey,OutputValue]",
            "--output",
            "text",
        ],
    )
    values: dict[str, str] = {}
    for line in output.splitlines():
        parts = line.split(maxsplit=1)
        if len(parts) == 2:
            values[parts[0]] = parts[1]
    return values


def wait_for_health(url: str, timeout_seconds: int) -> None:
    deadline = time.monotonic() + timeout_seconds
    last_error = ""
    while time.monotonic() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=10) as response:
                if 200 <= response.status < 300:
                    print(f"==> Health check passed: {url}")
                    return
                last_error = f"HTTP {response.status}"
        except (urllib.error.URLError, TimeoutError) as exc:
            last_error = str(exc)
        print(f"==> Waiting for health check: {url} ({last_error})")
        time.sleep(15)
    raise RuntimeError(f"Health check failed after {timeout_seconds}s: {url} ({last_error})")


def build_env(config: dict[str, str], aws_account_id: str, aws_region: str) -> dict[str, str]:
    env = os.environ.copy()
    env["AWS_REGION"] = aws_region
    env["AWS_DEFAULT_REGION"] = aws_region
    env["AWS_PAGER"] = ""
    env["CDK_DEFAULT_ACCOUNT"] = aws_account_id
    env["CDK_DEFAULT_REGION"] = aws_region

    for key in ("AWS_PROFILE", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_SESSION_TOKEN"):
        if key not in config:
            continue
        value = config[key].strip()
        if value:
            env[key] = value
        else:
            env.pop(key, None)
    return env


def main() -> None:
    parser = argparse.ArgumentParser(description="Deploy or roll back bebe-ims infrastructure and app on AWS using CDK.")
    parser.add_argument(
        "action",
        choices=("deploy", "rollback", "audit"),
        nargs="?",
        default="deploy",
        help="Action to run (default: deploy).",
    )
    parser.add_argument(
        "--config",
        default=str(Path(__file__).resolve().parent / "deploy.env"),
        help="Path to deployment config file (default: infra/cdk/deploy.env).",
    )
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    repo_root = script_dir.parent.parent
    config_path = Path(args.config).expanduser().resolve()

    if not config_path.exists():
        raise SystemExit(
            f"Missing config file: {config_path}\n"
            f"Copy {script_dir / 'deploy.env.example'} to {script_dir / 'deploy.env'} and fill it in."
        )

    config = load_env_file(config_path)
    aws_account_id = require(config, "AWS_ACCOUNT_ID")
    aws_region = require(config, "AWS_REGION")

    project_name = config.get("PROJECT_NAME", "bebe-ims")
    environment_name = config.get("ENVIRONMENT_NAME", "prod")
    api_prefix = config.get("API_PREFIX", "/api/v1")
    table_name = config.get("TABLE_NAME", "bebe_ims")
    backend_memory_mib = config.get("BACKEND_MEMORY_MIB", "512")
    domain_name = config.get("DOMAIN_NAME", "").strip().rstrip(".").lower()
    hosted_zone_domain_name = config.get("HOSTED_ZONE_DOMAIN_NAME", domain_name).strip().rstrip(".").lower()
    frontend_api_base = config.get("FRONTEND_API_BASE", "/api/v1")
    auto_bootstrap = bool_value(config.get("AUTO_BOOTSTRAP"), True)
    run_migrate = bool_value(config.get("RUN_MIGRATE"), True)
    adopt_existing_dynamodb_table = bool_value(config.get("ADOPT_EXISTING_DYNAMODB_TABLE"), True)
    auto_rollback = bool_value(config.get("AUTO_ROLLBACK_ON_FAILURE"), True)
    post_deploy_healthcheck = bool_value(config.get("POST_DEPLOY_HEALTHCHECK"), True)
    healthcheck_timeout_seconds = int(config.get("HEALTHCHECK_TIMEOUT_SECONDS", "300"))
    stack_name = config.get("STACK_NAME", f"{project_name}-{environment_name}")

    env = build_env(config, aws_account_id, aws_region)

    run(["aws", "sts", "get-caller-identity"], cwd=repo_root, env=env)

    if args.action == "audit":
        status = stack_status(env, repo_root, stack_name) or "NOT_FOUND"
        table = dynamodb_table_description(env, repo_root, table_name)
        stack_table = stack_resource(env, repo_root, stack_name, "AWS::DynamoDB::Table")
        lambda_function = stack_resource(env, repo_root, stack_name, "AWS::Lambda::Function")
        rest_api = stack_resource(env, repo_root, stack_name, "AWS::ApiGateway::RestApi")
        print(f"Stack: {stack_name}")
        print(f"Region: {aws_region}")
        print(f"Status: {status}")
        print(f"Domain name: {domain_name or 'not configured'}")
        print(f"Lambda function: {lambda_function if lambda_function and lambda_function != 'None' else 'not found'}")
        print(f"API Gateway REST API: {rest_api if rest_api and rest_api != 'None' else 'not found'}")
        print(f"DynamoDB table: {table_name if table else 'not found'}")
        print(f"DynamoDB table status: {table.get('TableStatus') if table else 'not found'}")
        print(f"DynamoDB stack resource: {stack_table if stack_table and stack_table != 'None' else 'not found'}")
        return

    if args.action == "rollback":
        rollback_deployment(env, repo_root, stack_name, reason="manual rollback")
        return

    app_dir = repo_root / "app"
    if not (app_dir / "node_modules").exists():
        run(["yarn", "install"], cwd=app_dir, env=env)
    frontend_env = env.copy()
    frontend_env["REACT_APP_REST_API_ENDPOINT"] = frontend_api_base
    frontend_env["NODE_PATH"] = "src"
    run(["yarn", "build"], cwd=app_dir, env=frontend_env)

    cdk_dir = repo_root / "infra" / "cdk"
    run(["npm", "install"], cwd=cdk_dir, env=env)

    if auto_bootstrap:
        run(["npx", "cdk", "bootstrap", f"aws://{aws_account_id}/{aws_region}"], cwd=cdk_dir, env=env)

    previous_stack_status = stack_status(env, repo_root, stack_name)
    if previous_stack_status in {"REVIEW_IN_PROGRESS", "ROLLBACK_COMPLETE", "CREATE_FAILED"}:
        print(f"==> Removing stale first-create stack {stack_name}: {previous_stack_status}")
        run(["aws", "cloudformation", "delete-stack", "--stack-name", stack_name], cwd=repo_root, env=env)
        wait_for_stack_delete(env, repo_root, stack_name)
        previous_stack_status = ""

    table = dynamodb_table_description(env, repo_root, table_name)
    stack_table = stack_resource(env, repo_root, stack_name, "AWS::DynamoDB::Table") if previous_stack_status else ""
    config_use_existing = config.get("USE_EXISTING_DYNAMODB_TABLE")
    use_existing_dynamodb_table = (
        bool_value(config_use_existing, False)
        if config_use_existing is not None
        else bool(table and adopt_existing_dynamodb_table and (not stack_table or stack_table == "None"))
    )
    if use_existing_dynamodb_table:
        if not table:
            raise RuntimeError(f"USE_EXISTING_DYNAMODB_TABLE=true but DynamoDB table {table_name} was not found")
        validate_existing_dynamodb_table(table, table_name)
        print(f"==> Using existing DynamoDB table: {table_name}")
    elif table and not previous_stack_status:
        raise RuntimeError(
            f"DynamoDB table {table_name} already exists outside stack {stack_name}. "
            "Set ADOPT_EXISTING_DYNAMODB_TABLE=true or choose a different TABLE_NAME."
        )

    previous_ecs_state = current_ecs_state(env, repo_root, stack_name) if previous_stack_status else {}
    previous_ecs_state["stack_existed_before"] = bool(previous_stack_status)

    try:
        run(
            [
                "npx",
                "cdk",
                "deploy",
                stack_name,
                "--require-approval",
                "never",
                "-c",
                f"projectName={project_name}",
                "-c",
                f"environmentName={environment_name}",
                "-c",
                f"apiPrefix={api_prefix}",
                "-c",
                f"tableName={table_name}",
                "-c",
                f"useExistingDynamoTable={str(use_existing_dynamodb_table).lower()}",
                "-c",
                f"backendMemoryMiB={backend_memory_mib}",
                "-c",
                f"domainName={domain_name}",
                "-c",
                f"hostedZoneDomainName={hosted_zone_domain_name}",
            ],
            cwd=cdk_dir,
            env=env,
        )

        outputs = stack_outputs(env, repo_root, stack_name)
        if post_deploy_healthcheck:
            health_base = outputs.get("ApiBaseUrl") or outputs.get("ApiGatewayUrl")
            if not health_base:
                raise RuntimeError("Missing ApiBaseUrl/ApiGatewayUrl stack output for health check")
            wait_for_health(f"{health_base.rstrip('/')}/health", healthcheck_timeout_seconds)

        if run_migrate:
            backend_dir = repo_root / "backend"
            if not (backend_dir / ".venv").exists():
                run(["make", "install"], cwd=backend_dir, env=env)

            backend_python = backend_dir / ".venv" / "bin" / "python"
            migrate_env = env.copy()
            migrate_env["BEBE_IMS_APP_ENV"] = "production"
            migrate_env["BEBE_IMS_AWS_REGION"] = aws_region
            migrate_env["BEBE_IMS_DYNAMODB_TABLE_NAME"] = table_name
            migrate_env["BEBE_IMS_DYNAMODB_ENDPOINT_URL"] = f"https://dynamodb.{aws_region}.amazonaws.com"
            migrate_env["PYTHONPATH"] = "."
            run([str(backend_python), "scripts/migrate.py"], cwd=backend_dir, env=migrate_env)
    except Exception as exc:
        print(f"==> Deployment failed: {exc}", file=sys.stderr)
        if auto_rollback:
            rollback_deployment(
                env,
                repo_root,
                stack_name,
                previous_state=previous_ecs_state,
                reason=str(exc),
            )
        raise

    run(
        [
            "aws",
            "cloudformation",
            "describe-stacks",
            "--stack-name",
            stack_name,
            "--query",
            "Stacks[0].Outputs[*].[OutputKey,OutputValue]",
            "--output",
            "table",
        ],
        cwd=repo_root,
        env=env,
    )

    print("==> Deployment complete")


if __name__ == "__main__":
    main()
