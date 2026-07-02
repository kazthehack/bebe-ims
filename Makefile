SHELL := /bin/zsh
.DEFAULT_GOAL := build

.PHONY: help install build clean migrate migrate-init reset snapshot restore-snapshot run run-local dev run-backend run-app run-dynamodb-local deploy deploy-cdk deploy-rollback deploy-version-rollback deploy-backend deploy-app deploy-docker lint fmt test

DYNAMODB_LOCAL_DIR ?= dynamodb_local_latest
DYNAMODB_LOCAL_JAR ?= $(DYNAMODB_LOCAL_DIR)/DynamoDBLocal.jar
DYNAMODB_LOCAL_PORT ?= 8000
DYNAMODB_LOCAL_FLAGS ?= -sharedDb -dbPath .
DEPLOY_ENV ?= infra/cdk/deploy.env

help:
	@echo "Root shortcuts:"
	@echo "  make install       # install backend + app deps (includes slicer bootstrap)"
	@echo "  make build         # build backend + app"
	@echo "  make clean         # clean backend + app build artifacts"
	@echo "  make migrate       # run backend db migrate/seed (no inventory overwrite)"
	@echo "  make migrate-init  # run migrate + catalog-sync inventory seed from workbook (preserves stock numbers)"
	@echo "  make reset         # zero out inventory quantities"
	@echo "  make snapshot      # save backend DynamoDB snapshot JSON"
	@echo "  make restore-snapshot SNAPSHOT_FILE=... # restore a snapshot JSON"
	@echo "  make run           # run backend + app locally (separate terminals recommended)"
	@echo "  make run-local     # run backend + app bound to 127.0.0.1 only"
	@echo "  make dev           # run backend + app together (dev mode, with reload)"
	@echo "  make run-backend   # run backend locally"
	@echo "  make run-app       # run app locally"
	@echo "  make run-dynamodb-local # run local DynamoDB jar"
	@echo "  make deploy        # deploy full stack to AWS via CDK (infra/cdk/deploy.py)"
	@echo "  make deploy-cdk    # same as make deploy (accepts DEPLOY_ENV=...)"
	@echo "  make deploy-rollback # take deployment down (cancel/delete stack op, scale ECS to 0)"
	@echo "  make deploy-version-rollback # rollback ECS service to previous task definition"
	@echo "  make deploy-docker # legacy docker-style backend+app deploy"
	@echo "  make deploy-backend"
	@echo "  make deploy-app"
	@echo "  make lint          # lint backend + app"
	@echo "  make fmt           # format backend + app"
	@echo "  make test          # backend tests"

install:
	$(MAKE) -C backend install
	$(MAKE) -C app install

build:
	$(MAKE) install
	$(MAKE) -C backend build
	$(MAKE) -C app build

clean:
	$(MAKE) -C backend clean
	$(MAKE) -C app clean

migrate:
	$(MAKE) -C backend migrate

migrate-init:
	$(MAKE) -C backend migrate-init

reset:
	$(MAKE) -C backend reset

snapshot:
	$(MAKE) -C backend snapshot

restore-snapshot:
	$(MAKE) -C backend restore-snapshot SNAPSHOT_FILE="$(SNAPSHOT_FILE)"

run:
	@echo "Use two terminals for dev services:"
	@echo "  Terminal 1: make run-backend"
	@echo "  Terminal 2: make run-app"

run-local:
	@echo "Starting backend + app in local-only mode (127.0.0.1)..."
	@trap 'kill 0' INT TERM EXIT; \
	$(MAKE) -C backend run HOST=127.0.0.1 & \
	REACT_APP_REST_API_ENDPOINT=http://127.0.0.1:8001/api/v1 $(MAKE) -C app run-dev HOST=127.0.0.1 & \
	wait

dev:
	@echo "Starting backend (reload) and app (hot reload)..."
	@trap 'kill 0' INT TERM EXIT; \
	$(MAKE) -C backend run & \
	$(MAKE) -C app run-dev & \
	wait

run-backend:
	$(MAKE) -C backend run

run-app:
	$(MAKE) -C app run

run-dynamodb-local:
	cd $(DYNAMODB_LOCAL_DIR) && java -Djava.library.path=./DynamoDBLocal_lib -jar ./DynamoDBLocal.jar -port $(DYNAMODB_LOCAL_PORT) $(DYNAMODB_LOCAL_FLAGS)

deploy: deploy-cdk

deploy-cdk:
	@test -f "$(DEPLOY_ENV)" || (echo "Missing deploy env: $(DEPLOY_ENV)"; echo "Copy infra/cdk/deploy.env.example to infra/cdk/deploy.env and fill values."; exit 1)
	python3 infra/cdk/deploy.py --config "$(DEPLOY_ENV)"

deploy-rollback:
	@test -f "$(DEPLOY_ENV)" || (echo "Missing deploy env: $(DEPLOY_ENV)"; echo "Copy infra/cdk/deploy.env.example to infra/cdk/deploy.env and fill values."; exit 1)
	@set -euo pipefail; \
	AWS_PROFILE_VAL="$$(awk -F= '/^AWS_PROFILE=/{print $$2}' "$(DEPLOY_ENV)" | tail -1 || true)"; \
	AWS_ACCESS_KEY_ID_VAL="$$(awk -F= '/^AWS_ACCESS_KEY_ID=/{print $$2}' "$(DEPLOY_ENV)" | tail -1 || true)"; \
	AWS_SECRET_ACCESS_KEY_VAL="$$(awk -F= '/^AWS_SECRET_ACCESS_KEY=/{print $$2}' "$(DEPLOY_ENV)" | tail -1 || true)"; \
	AWS_SESSION_TOKEN_VAL="$$(awk -F= '/^AWS_SESSION_TOKEN=/{print $$2}' "$(DEPLOY_ENV)" | tail -1 || true)"; \
	AWS_REGION_VAL="$$(awk -F= '/^AWS_REGION=/{print $$2}' "$(DEPLOY_ENV)" | tail -1)"; \
	PROJECT_NAME_VAL="$$(awk -F= '/^PROJECT_NAME=/{print $$2}' "$(DEPLOY_ENV)" | tail -1 || true)"; \
	ENVIRONMENT_NAME_VAL="$$(awk -F= '/^ENVIRONMENT_NAME=/{print $$2}' "$(DEPLOY_ENV)" | tail -1 || true)"; \
	STACK_NAME_VAL="$$(awk -F= '/^STACK_NAME=/{print $$2}' "$(DEPLOY_ENV)" | tail -1 || true)"; \
	BACKEND_DESIRED_COUNT_VAL="$$(awk -F= '/^BACKEND_DESIRED_COUNT=/{print $$2}' "$(DEPLOY_ENV)" | tail -1 || true)"; \
	if [ -z "$$AWS_REGION_VAL" ]; then echo "Missing AWS_REGION in $(DEPLOY_ENV)"; exit 1; fi; \
	if [ -n "$$AWS_PROFILE_VAL" ]; then export AWS_PROFILE="$$AWS_PROFILE_VAL"; fi; \
	if [ -n "$$AWS_ACCESS_KEY_ID_VAL" ]; then export AWS_ACCESS_KEY_ID="$$AWS_ACCESS_KEY_ID_VAL"; fi; \
	if [ -n "$$AWS_SECRET_ACCESS_KEY_VAL" ]; then export AWS_SECRET_ACCESS_KEY="$$AWS_SECRET_ACCESS_KEY_VAL"; fi; \
	if [ -n "$$AWS_SESSION_TOKEN_VAL" ]; then export AWS_SESSION_TOKEN="$$AWS_SESSION_TOKEN_VAL"; fi; \
	if [ -z "$$STACK_NAME_VAL" ]; then \
		if [ -z "$$PROJECT_NAME_VAL" ]; then PROJECT_NAME_VAL="bebe-ims"; fi; \
		if [ -z "$$ENVIRONMENT_NAME_VAL" ]; then ENVIRONMENT_NAME_VAL="prod"; fi; \
		STACK_NAME_VAL="$$PROJECT_NAME_VAL-$$ENVIRONMENT_NAME_VAL"; \
	fi; \
	STACK_STATUS="$$(AWS_REGION="$$AWS_REGION_VAL" aws cloudformation describe-stacks --stack-name "$$STACK_NAME_VAL" --query "Stacks[0].StackStatus" --output text 2>/dev/null || true)"; \
	if [ -z "$$STACK_STATUS" ] || [ "$$STACK_STATUS" = "None" ]; then \
		echo "Stack $$STACK_NAME_VAL not found in $$AWS_REGION_VAL."; \
		exit 0; \
	fi; \
	echo "Stack $$STACK_NAME_VAL status: $$STACK_STATUS"; \
	if [ "$$STACK_STATUS" = "UPDATE_IN_PROGRESS" ] || [ "$$STACK_STATUS" = "UPDATE_COMPLETE_CLEANUP_IN_PROGRESS" ]; then \
		echo "Cancelling CloudFormation update..."; \
		AWS_REGION="$$AWS_REGION_VAL" aws cloudformation cancel-update-stack --stack-name "$$STACK_NAME_VAL" >/dev/null; \
	elif [ "$$STACK_STATUS" = "CREATE_IN_PROGRESS" ]; then \
		echo "Create in progress; deleting stack to take deployment down..."; \
		AWS_REGION="$$AWS_REGION_VAL" aws cloudformation delete-stack --stack-name "$$STACK_NAME_VAL" >/dev/null; \
	fi; \
	CLUSTER_NAME="$$(AWS_REGION="$$AWS_REGION_VAL" aws cloudformation describe-stack-resources --stack-name "$$STACK_NAME_VAL" --query "StackResources[?ResourceType=='AWS::ECS::Cluster']|[0].PhysicalResourceId" --output text 2>/dev/null || true)"; \
	SERVICE_NAME="$$(AWS_REGION="$$AWS_REGION_VAL" aws cloudformation describe-stack-resources --stack-name "$$STACK_NAME_VAL" --query "StackResources[?ResourceType=='AWS::ECS::Service']|[0].PhysicalResourceId" --output text 2>/dev/null || true)"; \
	if [ -z "$$CLUSTER_NAME" ] || [ "$$CLUSTER_NAME" = "None" ] || [ -z "$$SERVICE_NAME" ] || [ "$$SERVICE_NAME" = "None" ]; then \
		echo "ECS service not resolvable from stack (possibly already deleting)."; \
		exit 0; \
	fi; \
	echo "Scaling ECS service $$SERVICE_NAME in $$CLUSTER_NAME to 0"; \
	AWS_REGION="$$AWS_REGION_VAL" aws ecs update-service --cluster "$$CLUSTER_NAME" --service "$$SERVICE_NAME" --desired-count 0 >/dev/null; \
	RUNNING_TASKS="$$(AWS_REGION="$$AWS_REGION_VAL" aws ecs list-tasks --cluster "$$CLUSTER_NAME" --service-name "$$SERVICE_NAME" --desired-status RUNNING --query "taskArns" --output text)"; \
	if [ -n "$$RUNNING_TASKS" ] && [ "$$RUNNING_TASKS" != "None" ]; then \
		for task in $$RUNNING_TASKS; do \
			AWS_REGION="$$AWS_REGION_VAL" aws ecs stop-task --cluster "$$CLUSTER_NAME" --task "$$task" --reason "Manual rollback via make deploy-rollback" >/dev/null; \
		done; \
	fi; \
	echo "Deployment taken down (service desired count set to 0)."

deploy-version-rollback:
	@test -f "$(DEPLOY_ENV)" || (echo "Missing deploy env: $(DEPLOY_ENV)"; echo "Copy infra/cdk/deploy.env.example to infra/cdk/deploy.env and fill values."; exit 1)
	@set -euo pipefail; \
	AWS_PROFILE_VAL="$$(awk -F= '/^AWS_PROFILE=/{print $$2}' "$(DEPLOY_ENV)" | tail -1 || true)"; \
	AWS_ACCESS_KEY_ID_VAL="$$(awk -F= '/^AWS_ACCESS_KEY_ID=/{print $$2}' "$(DEPLOY_ENV)" | tail -1 || true)"; \
	AWS_SECRET_ACCESS_KEY_VAL="$$(awk -F= '/^AWS_SECRET_ACCESS_KEY=/{print $$2}' "$(DEPLOY_ENV)" | tail -1 || true)"; \
	AWS_SESSION_TOKEN_VAL="$$(awk -F= '/^AWS_SESSION_TOKEN=/{print $$2}' "$(DEPLOY_ENV)" | tail -1 || true)"; \
	AWS_REGION_VAL="$$(awk -F= '/^AWS_REGION=/{print $$2}' "$(DEPLOY_ENV)" | tail -1)"; \
	PROJECT_NAME_VAL="$$(awk -F= '/^PROJECT_NAME=/{print $$2}' "$(DEPLOY_ENV)" | tail -1 || true)"; \
	ENVIRONMENT_NAME_VAL="$$(awk -F= '/^ENVIRONMENT_NAME=/{print $$2}' "$(DEPLOY_ENV)" | tail -1 || true)"; \
	STACK_NAME_VAL="$$(awk -F= '/^STACK_NAME=/{print $$2}' "$(DEPLOY_ENV)" | tail -1 || true)"; \
	if [ -z "$$AWS_REGION_VAL" ]; then echo "Missing AWS_REGION in $(DEPLOY_ENV)"; exit 1; fi; \
	if [ -n "$$AWS_PROFILE_VAL" ]; then export AWS_PROFILE="$$AWS_PROFILE_VAL"; fi; \
	if [ -n "$$AWS_ACCESS_KEY_ID_VAL" ]; then export AWS_ACCESS_KEY_ID="$$AWS_ACCESS_KEY_ID_VAL"; fi; \
	if [ -n "$$AWS_SECRET_ACCESS_KEY_VAL" ]; then export AWS_SECRET_ACCESS_KEY="$$AWS_SECRET_ACCESS_KEY_VAL"; fi; \
	if [ -n "$$AWS_SESSION_TOKEN_VAL" ]; then export AWS_SESSION_TOKEN="$$AWS_SESSION_TOKEN_VAL"; fi; \
	if [ -z "$$STACK_NAME_VAL" ]; then \
		if [ -z "$$PROJECT_NAME_VAL" ]; then PROJECT_NAME_VAL="bebe-ims"; fi; \
		if [ -z "$$ENVIRONMENT_NAME_VAL" ]; then ENVIRONMENT_NAME_VAL="prod"; fi; \
		STACK_NAME_VAL="$$PROJECT_NAME_VAL-$$ENVIRONMENT_NAME_VAL"; \
	fi; \
	CLUSTER_NAME="$$(AWS_REGION="$$AWS_REGION_VAL" aws cloudformation describe-stack-resources --stack-name "$$STACK_NAME_VAL" --query "StackResources[?ResourceType=='AWS::ECS::Cluster']|[0].PhysicalResourceId" --output text)"; \
	SERVICE_NAME="$$(AWS_REGION="$$AWS_REGION_VAL" aws cloudformation describe-stack-resources --stack-name "$$STACK_NAME_VAL" --query "StackResources[?ResourceType=='AWS::ECS::Service']|[0].PhysicalResourceId" --output text)"; \
	PREV_TASK_DEF="$$(AWS_REGION="$$AWS_REGION_VAL" aws ecs describe-services --cluster "$$CLUSTER_NAME" --services "$$SERVICE_NAME" --query "services[0].deployments[?status!='PRIMARY'] | sort_by(@,&createdAt) | [-1].taskDefinition" --output text)"; \
	if [ -z "$$PREV_TASK_DEF" ] || [ "$$PREV_TASK_DEF" = "None" ]; then echo "No previous task definition found."; exit 1; fi; \
	AWS_REGION="$$AWS_REGION_VAL" aws ecs update-service --cluster "$$CLUSTER_NAME" --service "$$SERVICE_NAME" --task-definition "$$PREV_TASK_DEF" --force-new-deployment >/dev/null; \
	echo "Version rollback triggered to $$PREV_TASK_DEF."

deploy-docker: deploy-backend deploy-app

deploy-backend:
	$(MAKE) -C backend deploy

deploy-app:
	$(MAKE) -C app deploy

lint:
	$(MAKE) -C backend lint
	$(MAKE) -C app lint

fmt:
	$(MAKE) -C backend fmt
	$(MAKE) -C app fmt

test:
	$(MAKE) -C backend test
