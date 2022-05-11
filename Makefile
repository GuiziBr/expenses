all: build migrations start

build:
	docker compose -f docker-compose.yml up -d

migrations:
	npm run typeorm migration:run

start:
	npm run dev:server
