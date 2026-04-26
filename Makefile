.PHONY: db backend frontend fullstack down clean

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

down:
	docker-compose --profile all down

clean:
	docker-compose --profile all down -v
	docker volume rm safely_mysql_data 2>/dev/null || true
	docker volume prune -f

rebuild-backend:
	docker-compose --profile backend build app
	docker-compose --profile backend up

rebuild-frontend:
	docker-compose --profile frontend build frontend
	docker-compose --profile frontend up

logs:
	docker-compose logs -f
