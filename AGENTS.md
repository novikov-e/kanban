# Kanban

Пет-проект канбан-доски: Angular 15 (`frontend/`), FastAPI + SQLAlchemy 2 async (`backend/`), PostgreSQL.
`backend-old/` — прежний бэкенд на Java/Spring, только для справки, не изменять.

## Запуск

Весь стек в Docker (из корня): `docker compose up -d --build`, приложение — http://localhost:8080.
Сервисы `postgresql`, `backend`, `frontend` в общей сети `kanban`. Бэкенд применяет миграции при старте,
nginx во фронтенд-контейнере раздаёт сборку Angular и проксирует `/api/` на `backend:8000`.

Локальная разработка:

- БД: `docker compose up -d postgresql`.
- Бэкенд (из `backend/`): `pip install -r requirements.txt`, `alembic upgrade head`, `uvicorn app.main:app --reload --port 8000`.
  Настройки подключения — в `backend/.env` (шаблон: `backend/.env.example`).
- Фронтенд (из `frontend/`): `npm ci`, `npm start` — `ng serve` с `proxy.conf.json`, который проксирует `/api` на `localhost:8000`.

## Проверки перед завершением задачи

- Бэкенд: `ruff check app alembic/env.py`.
- Фронтенд: `npx ng build --configuration development`. Production-сборку проверять в Docker:
  Angular 15 требует Node.js 18.
- Изменения моделей сопровождаются миграцией Alembic; `alembic check` должен проходить без новых операций.

## Сущности и API

Иерархия: Board → Column → Task → Subtask. Одни и те же имена используются в моделях фронтенда,
компонентах, сервисах, маршрутах (`/api/v1/board`, `/column`, `/task`, `/subtask`) и моделях бэкенда.

- JSON ответов — camelCase с полями `id`, `name`, `position` и вложенными `columns` / `tasks` / `subtasks`.
  Маппинг с колонками БД (`board_id`, `task_name`, …) делается через `validation_alias` в `backend/app/schemas/`.
- Тела запросов описаны в `backend/app/schemas/common.py`.
- Видимые пользователю тексты интерфейса на русском называют доску «проектом».

## Соглашения бэкенда

- Слои: `api/v1` (роутеры) → `services` (логика и запросы) → `models` (SQLAlchemy).
- Порядок элементов хранится в полях `*_position`. Перемещение и удаление выполняются только через
  `services/ordering.py`: сервер сам берёт порядок из БД и не доверяет позициям, присланным клиентом.
- Удаление мягкое (`deleted_at`). Каскад на дочерние сущности делают триггеры БД из начальной миграции,
  поэтому все выборки фильтруют `deleted_at IS NULL`.
- Временные метки ставятся на стороне БД (`func.now()`), колонки — `timestamptz`.
- Авторизации пока нет: пользователь захардкожен в `api/v1/user.py`.
