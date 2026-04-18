SHELL := /bin/zsh
IMAGE ?= bebe-ims-backend:local
CONTAINER ?= bebe-ims-backend
PORT ?= 8001
HOST ?= 0.0.0.0

export PATH := $(CURDIR)/.tools/bin:$(PATH)

.PHONY: help install build migrate migrate-init reset snapshot restore-snapshot run run-dev deploy stop logs clean lint fmt test ensure-slicer-cli

help:
	@echo "Targets:"
	@echo "  make install   # ensure slicer cli + create venv + install deps"
	@echo "  make ensure-slicer-cli # install/link slicer cli for 3MF parsing"
	@echo "  make build     # install deps + compile backend modules"
	@echo "  make migrate   # create table + seed defaults (no inventory overwrite)"
	@echo "  make migrate-init # migrate + catalog-sync inventory from backend/data/inventory_seed.xlsm (preserves stock numbers)"
	@echo "  make reset     # zero out product inventory quantities"
	@echo "  make snapshot  # save DynamoDB snapshot JSON (tenant-admin by default)"
	@echo "  make restore-snapshot SNAPSHOT_FILE=... # restore snapshot JSON into DynamoDB"
	@echo "  make run       # run backend locally with auto-reload"
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
	python3 -m venv --clear .venv
	. .venv/bin/activate && python -m pip install -r requirements-dev.txt

build:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && python -m compileall app

migrate:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && PYTHONPATH=. python scripts/migrate.py

migrate-init:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && PYTHONPATH=. python scripts/migrate.py --include-inventory-seed

reset:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && PYTHONPATH=. python scripts/reset_inventory.py --tenant-id tenant-admin

snapshot:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && PYTHONPATH=. python scripts/snapshot_db.py --mode snapshot --tenant-id tenant-admin

restore-snapshot:
	test -d .venv || $(MAKE) install
	test -n "$(SNAPSHOT_FILE)"
	. .venv/bin/activate && PYTHONPATH=. python scripts/restore_db.py --input "$(SNAPSHOT_FILE)"

run:
	$(MAKE) migrate
	. .venv/bin/activate && uvicorn app.main:app --reload --host $(HOST) --port $(PORT)

run-no-reload:
	$(MAKE) migrate
	. .venv/bin/activate && uvicorn app.main:app --host $(HOST) --port $(PORT)

run-dev:
	$(MAKE) migrate
	. .venv/bin/activate && uvicorn app.main:app --reload --host $(HOST) --port $(PORT)

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
	. .venv/bin/activate && ruff check app

fmt:
	. .venv/bin/activate && black app && ruff check app --fix

test:
	. .venv/bin/activate && pytest

clean:
	rm -rf .venv || true
	find .venv -mindepth 1 -delete 2>/dev/null || true
	rmdir .venv 2>/dev/null || true
	find app -type d -name '__pycache__' -prune -exec rm -rf {} +
	rm -rf .pytest_cache
	rm -rf .ruff_cache
	rm -f .coverage
