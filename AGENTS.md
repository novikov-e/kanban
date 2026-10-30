# Kanban

Пет-проект канбан-доски: Angular 15 (`frontend/`), FastAPI + SQLAlchemy 2 async (`backend/`), PostgreSQL.
`backend-old/` — прежний бэкенд на Java/Spring, только для справки, не изменять.

## Запуск

- БД: `docker compose up -d postgresql` (из корня).
- Бэкенд (из `backend/`): `pip install -r requirements.txt`, `alembic upgrade head`, `uvicorn app.main:app --reload --port 8000`.
  Настройки подключения — в `backend/.env` (шаблон: `backend/.env.example`).
- Фронтенд (из `frontend/`): `npm ci`, `npm start` — `ng serve` с `proxy.conf.json`, который проксирует `/api` на `localhost:8000`.

## Проверки перед завершением задачи

- Бэкенд: `ruff check app alembic/env.py`.
- Фронтенд: `npx ng build --configuration development`.
- Изменения моделей сопровождаются миграцией Alembic; `alembic check` должен проходить без новых операций.

## Контракт API

Фронтенд и бэкенд называют сущности по-разному, API сохраняет имена фронтенда (контракт старого Java-бэкенда):

| Фронтенд (`models/`) | Бэкенд (модель / таблица) | Маршрут |
|---|---|---|
| `Project` | `Board` / `boards` | `/api/v1/project` |
| `Column` | `Column` / `columns` | `/api/v1/column` |
| `TaskList` | `Task` / `tasks` | `/api/v1/task_list` |
| `Task` | `Subtask` / `subtasks` | `/api/v1/task` |

- JSON ответов — camelCase с полями `id`, `name`, `position` и вложенными `columns` / `taskLists` / `tasks`.
  Маппинг с полями БД делается через `validation_alias` в `backend/app/schemas/`.
- Тела запросов описаны в `backend/app/schemas/common.py`.

## Соглашения бэкенда

- Слои: `api/v1` (роутеры) → `services` (логика и запросы) → `models` (SQLAlchemy).
- Порядок элементов хранится в полях `*_position`. Перемещение и удаление выполняются только через
  `services/ordering.py`: сервер сам берёт порядок из БД и не доверяет позициям, присланным клиентом.
- Удаление мягкое (`deleted_at`). Каскад на дочерние сущности делают триггеры БД из начальной миграции,
  поэтому все выборки фильтруют `deleted_at IS NULL`.
- Временные метки ставятся на стороне БД (`func.now()`), колонки — `timestamptz`.
- Авторизации пока нет: пользователь захардкожен в `api/v1/user.py`.
