SHELL := /bin/zsh
.DEFAULT_GOAL := build

.PHONY: help build clean run dev run-backend run-app deploy deploy-backend deploy-app lint fmt test

help:
	@echo "Root shortcuts:"
	@echo "  make build         # build backend + app"
	@echo "  make clean         # clean backend + app build artifacts"
	@echo "  make run           # run backend + app locally (separate terminals recommended)"
	@echo "  make dev           # run backend + app together (dev mode, with reload)"
	@echo "  make run-backend   # run backend locally"
	@echo "  make run-app       # run app locally"
	@echo "  make deploy        # deploy backend + app with Docker"
	@echo "  make deploy-backend"
	@echo "  make deploy-app"
	@echo "  make lint          # lint backend + app"
	@echo "  make fmt           # format backend + app"
	@echo "  make test          # backend tests"

build:
	$(MAKE) -C backend install
	$(MAKE) -C app install
	$(MAKE) -C backend build
	$(MAKE) -C app build

clean:
	$(MAKE) -C backend clean
	$(MAKE) -C app clean

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
