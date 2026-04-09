SHELL := /bin/zsh
IMAGE ?= bebe-ims-app:local
CONTAINER ?= bebe-ims-app
PORT ?= 2306
HOST ?= 0.0.0.0

.PHONY: help install run run-dev deploy stop logs build clean lint lint-fix fmt fmt-check

help:
	@echo "Targets:"
	@echo "  make install    # install app dependencies"
	@echo "  make run        # run app locally (react-scripts start)"
	@echo "  make run-dev    # run app locally with hot reload (react-scripts start)"
	@echo "  make deploy     # build and run app docker container"
	@echo "  make stop       # stop app docker container"
	@echo "  make logs       # tail app docker logs"
	@echo "  make build      # production build"
	@echo "  make clean      # remove app build artifacts"
	@echo "  make lint       # lint checks"
	@echo "  make lint-fix   # auto-fix lint issues"
	@echo "  make fmt        # prettier format"
	@echo "  make fmt-check  # prettier check"

install:
	yarn install

run:
	test -d node_modules || $(MAKE) install
	test -d build || NODE_PATH=src yarn build
	HOST=$(HOST) PORT=$(PORT) node scripts/serve-build.js $(PORT)

run-dev:
	test -d node_modules || $(MAKE) install
	HOST=$(HOST) PORT=$(PORT) NODE_PATH=src yarn start

deploy:
	docker build -t $(IMAGE) .
	docker rm -f $(CONTAINER) 2>/dev/null || true
	docker run -d --name $(CONTAINER) -p $(PORT):80 $(IMAGE)
	@echo "App deployed at http://localhost:$(PORT)"

stop:
	docker rm -f $(CONTAINER) 2>/dev/null || true

logs:
	docker logs -f $(CONTAINER)

build:
	test -d node_modules || $(MAKE) install
	NODE_PATH=src yarn build

clean:
	rm -rf build
	rm -rf .cache
	rm -rf coverage

lint:
	yarn lint

lint-fix:
	yarn lint:fix

fmt:
	yarn format

fmt-check:
	yarn format:check
