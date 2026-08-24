SHELL := /bin/zsh
.DEFAULT_GOAL := build
IMAGE ?= bebe-ims-backend:local
CONTAINER ?= bebe-ims-backend
PORT ?= 8001
HOST ?= 0.0.0.0

export PATH := $(CURDIR)/.tools/bin:$(PATH)

.PHONY: help install build migrate prod migrate-prod migrate-init port-inventory-cloud reset snapshot checkpoint restore-snapshot run up run-dev run-no-reload deploy stop logs clean lint fmt test ensure-slicer-cli

help:
	@echo "Targets:"
	@echo "  make install   # ensure slicer cli + venv + deps"
	@echo "  make ensure-slicer-cli # install/link slicer cli for 3MF parsing"
	@echo "  make build     # install deps + compile backend modules"
	@echo "  make migrate   # create table + seed defaults (no inventory overwrite)"
	@echo "  make migrate prod # clone local DynamoDB table to production"
	@echo "  make migrate-init # migrate + catalog-sync inventory from backend/data/inventory_seed.xlsm (preserves stock numbers)"
	@echo "  make port-inventory-cloud # dry-run local inventory port to AWS DynamoDB"
	@echo "  make reset     # zero out product inventory quantities"
	@echo "  make snapshot  # save DynamoDB snapshot JSON (tenant-admin by default)"
	@echo "  make checkpoint # clear inventory numbers, then save migrate-init baseline"
	@echo "  make restore-snapshot SNAPSHOT_FILE=... # restore snapshot JSON into DynamoDB"
	@echo "  make run       # run backend locally with auto-reload"
	@echo "  make up        # build and run backend Docker container"
	@echo "  make run-dev   # run backend locally with auto-reload"
	@echo "  make deploy    # build and run backend docker container"
	@echo "  make stop      # stop backend docker container"
	@echo "  make logs      # tail backend docker logs"
	@echo "  make lint      # ruff check"
	@echo "  make fmt       # black + ruff --fix"
	@echo "  make test      # pytest"

ensure-slicer-cli:
	bash scripts/ensure_slicer_cli.sh

install:
	$(MAKE) ensure-slicer-cli
	test -d .venv || python3 -m venv .venv
	. .venv/bin/activate && python -m pip install -r requirements-dev.txt

build:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && python -m compileall app

migrate:
ifneq ($(filter prod,$(MAKECMDGOALS)),)
	$(MAKE) migrate-prod
else
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && PYTHONPATH=. python scripts/migrate.py
endif

prod:
	@:

migrate-prod:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && PYTHONPATH=. python scripts/port_inventory_to_cloud.py --full-clone --confirm-prod-clone clone-local-to-prod

migrate-init:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && PYTHONPATH=. python scripts/migrate.py --include-inventory-seed

port-inventory-cloud:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && PYTHONPATH=. python scripts/port_inventory_to_cloud.py --dry-run

reset:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && PYTHONPATH=. python scripts/reset_inventory.py --tenant-id tenant-admin

snapshot:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && PYTHONPATH=. python scripts/snapshot_db.py --mode snapshot --tenant-id tenant-admin

checkpoint:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && PYTHONPATH=. python scripts/checkpoint.py --tenant-id tenant-admin

restore-snapshot:
	test -d .venv || $(MAKE) install
	test -n "$(SNAPSHOT_FILE)"
	. .venv/bin/activate && PYTHONPATH=. python scripts/restore_db.py --input "$(SNAPSHOT_FILE)"

run:
	$(MAKE) migrate
	. .venv/bin/activate && uvicorn app.main:app --reload --host $(HOST) --port $(PORT)

up: deploy

run-dev: run

run-no-reload:
	$(MAKE) migrate
	. .venv/bin/activate && uvicorn app.main:app --host $(HOST) --port $(PORT)

deploy:
	docker build -t $(IMAGE) .
	docker rm -f $(CONTAINER) 2>/dev/null || true
	docker run -d --name $(CONTAINER) -p $(PORT):8001 $(IMAGE)
	@echo "Backend deployed at http://localhost:$(PORT)"

stop:
	docker rm -f $(CONTAINER) 2>/dev/null || true

logs:
	docker logs -f $(CONTAINER)

lint:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && ruff check app

fmt:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && black app && ruff check app --fix

test:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && pytest

clean:
	rm -rf .venv || true
	find .venv -mindepth 1 -delete 2>/dev/null || true
	rmdir .venv 2>/dev/null || true
	find app -type d -name '__pycache__' -prune -exec rm -rf {} +
	rm -rf .pytest_cache
	rm -rf .ruff_cache
	rm -f .coverage
