#!/usr/bin/env python3
from __future__ import annotations

import os
import argparse
import subprocess
from pathlib import Path


def load_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip()
    return values


def bool_value(value: str | None, default: bool) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def run(cmd: list[str], cwd: Path, env: dict[str, str]) -> None:
    print(f"==> {' '.join(cmd)}")
    subprocess.run(cmd, cwd=str(cwd), env=env, check=True)


def require(config: dict[str, str], name: str) -> str:
    value = config.get(name, "").strip()
    if not value:
        raise SystemExit(f"Missing required config value: {name}")
    return value


def main() -> None:
    parser = argparse.ArgumentParser(description="Deploy bebe-ims infrastructure and app to AWS using CDK.")
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
    backend_cpu = config.get("BACKEND_CPU", "512")
    backend_memory_mib = config.get("BACKEND_MEMORY_MIB", "1024")
    backend_desired_count = config.get("BACKEND_DESIRED_COUNT", "1")
    frontend_api_base = config.get("FRONTEND_API_BASE", "/api/v1")
    auto_bootstrap = bool_value(config.get("AUTO_BOOTSTRAP"), True)
    run_migrate = bool_value(config.get("RUN_MIGRATE"), True)
    stack_name = config.get("STACK_NAME", f"{project_name}-{environment_name}")

    env = os.environ.copy()
    env["AWS_REGION"] = aws_region
    env["AWS_DEFAULT_REGION"] = aws_region
    env["CDK_DEFAULT_ACCOUNT"] = aws_account_id
    env["CDK_DEFAULT_REGION"] = aws_region

    for key in ("AWS_PROFILE", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_SESSION_TOKEN"):
        value = config.get(key, "").strip()
        if value:
            env[key] = value

    run(["aws", "sts", "get-caller-identity"], cwd=repo_root, env=env)

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
            f"backendCpu={backend_cpu}",
            "-c",
            f"backendMemoryMiB={backend_memory_mib}",
            "-c",
            f"backendDesiredCount={backend_desired_count}",
        ],
        cwd=cdk_dir,
        env=env,
    )

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

    print("==> Deployment complete")


if __name__ == "__main__":
    main()
