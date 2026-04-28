SHELL := /bin/zsh
.DEFAULT_GOAL := build

.PHONY: help install build clean migrate migrate-init reset snapshot restore-snapshot run dev run-backend run-app run-dynamodb-local deploy deploy-backend deploy-app lint fmt test

DYNAMODB_LOCAL_DIR ?= dynamodb_local_latest
DYNAMODB_LOCAL_JAR ?= $(DYNAMODB_LOCAL_DIR)/DynamoDBLocal.jar
DYNAMODB_LOCAL_PORT ?= 8000
DYNAMODB_LOCAL_FLAGS ?= -sharedDb -dbPath .

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
	@echo "  make dev           # run backend + app together (dev mode, with reload)"
	@echo "  make run-backend   # run backend locally"
	@echo "  make run-app       # run app locally"
	@echo "  make run-dynamodb-local # run local DynamoDB jar"
	@echo "  make deploy        # deploy backend + app with Docker"
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

deploy: deploy-backend deploy-app

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
