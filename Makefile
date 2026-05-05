.PHONY: db backend frontend fullstack down clean build-all build-frontend build-backend clean-start all

db:
	docker-compose --profile database up

backend:
	docker-compose --profile backend up

frontend:
	docker-compose --profile frontend up

fullstack:
	docker-compose --profile fullstack up

all:
	docker-compose --profile all up

clean-start:
	make clean 
	make build-all 
	make all

down:
	docker-compose --profile all down

clean:
	docker-compose --profile all down -v
	docker volume rm safely_mysql_data 2>/dev/null || true
	docker volume prune -f

build-all: 
	make build-backend 
	make build-frontend

build-backend:
	docker-compose --profile backend build app

build-frontend:
	# docker compose --profile frontend build frontend
	docker compose --profile frontend --profile backend build frontend

logs:
	docker-compose logs -f
