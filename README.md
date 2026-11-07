# Канбан

Приложение для планирования с использованием Канбан досок.

Стек: 
- Angular 22
- FastAPI
- PostgreSQL

Демо-пользователь
- email: `test@app.ru`
- пароль: `password`

## Production
Для запуска необходимо создать в корне проекта `.env` файл и задать в нём переменные `POSTGRES_PASSWORD` и `JWT_SECRET`

```bash
docker compose -f docker-compose.yml up -d --build
```
Приложение доступно по адресу: http://localhost:8080

## Development

Для запуска понадобится: 
- Python 3.12 
- [uv](https://docs.astral.sh/uv/) 
- Node.js 24

Для запуска необходимо создать `backend/.env` файл и задать в нём переменные `POSTGRES_PASSWORD` и `JWT_SECRET`

PostgreSQL:
```bash
docker compose -f docker-compose.dev.yml up -d
```

Бэкенд, из каталога `backend/`:
```bash
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8000
```
Swagger: http://localhost:8000/docs


Фронтенд, из каталога `frontend/`:
```bash
npm ci
npm start
```

Приложение: http://localhost:4200.
