SHELL := /bin/zsh
IMAGE ?= bebe-ims-backend:local
CONTAINER ?= bebe-ims-backend
PORT ?= 8001

.PHONY: help install build run run-dev deploy stop logs clean lint fmt test

help:
	@echo "Targets:"
	@echo "  make install   # create venv + install deps"
	@echo "  make build     # install deps + compile backend modules"
	@echo "  make run       # run backend locally (uvicorn, no reload)"
	@echo "  make run-dev   # run backend locally with auto-reload"
	@echo "  make deploy    # build and run backend docker container"
	@echo "  make stop      # stop backend docker container"
	@echo "  make logs      # tail backend docker logs"
	@echo "  make lint      # ruff check"
	@echo "  make fmt       # black + ruff --fix"
	@echo "  make test      # pytest"

install:
	python3 -m venv .venv
	. .venv/bin/activate && pip install -r requirements-dev.txt

build:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && python -m compileall app

run:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && uvicorn app.main:app --host 127.0.0.1 --port $(PORT)

run-dev:
	test -d .venv || $(MAKE) install
	. .venv/bin/activate && uvicorn app.main:app --reload --host 127.0.0.1 --port $(PORT)

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
