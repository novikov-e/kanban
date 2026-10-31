# Kanban

Пет-проект канбан-доски: Angular 22 (`frontend/`), FastAPI + SQLAlchemy 2 async (`backend/`), PostgreSQL.

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

- Бэкенд: `ruff format app alembic/env.py` и `ruff check app alembic/env.py`.
- Фронтенд (Node.js ^22.22.3 или ^24.15.0): `npm run format` (Prettier), `npx ng build --configuration development`
  и `npx ng test --watch=false` (Vitest).
- Комментарии — только для неочевидных ограничений; код должен читаться без них.
- Изменения моделей сопровождаются миграцией Alembic; `alembic check` должен проходить без новых операций.

## Сущности и API

Иерархия: Board → Column → Task → Subtask. Одни и те же имена используются в моделях фронтенда,
компонентах, сервисах, маршрутах (`/api/v1/board`, `/column`, `/task`, `/subtask`) и моделях бэкенда.

- JSON ответов — camelCase с полями `id`, `name`, `position` и вложенными `columns` / `tasks` / `subtasks`.
  Маппинг с колонками БД (`board_id`, `task_name`, …) делается через `validation_alias` в `backend/app/schemas/`.
- Тела запросов (`*Request`) наследуют `ApiRequest` из `backend/app/schemas/common.py`, ответы — `*Response`.
  Каждый эндпоинт описан для Swagger (`/docs`): `summary`, docstring, описания полей, ответ 404.
- Фронтенд отправляет только поля, которые читает сервер: позиции при создании и «старые» родитель/позиция
  при перемещении не передаются.
- Видимые пользователю тексты интерфейса на русском называют доску «проектом».

## Соглашения фронтенда

- Standalone-компоненты без `NgModule`, конфигурация приложения — в `src/app/app.config.ts`.
- Шаблоны используют `@if` / `@for`, зависимости подключаются через `inject()`.
- Компоненты меняют модели на месте (`push`, `splice`), поэтому приложение работает на zone.js
  (`provideZoneChangeDetection()`), а компоненты объявлены с `ChangeDetectionStrategy.Eager`.
- Дочерний компонент не знает о родителе: данные приходят через `@Input`, удаление — через `@Output() deleted`.
- Ошибки HTTP обрабатывает `interceptors/http-error.interceptor.ts` (снекбар), сервисы их не перехватывают.
- Access-токен хранится только в памяти (`AuthService`); `auth.interceptor.ts` подставляет его и при 401
  один раз обновляет токен через cookie и повторяет запрос.
- Несохранённый элемент имеет `id === UNSAVED_ID`; проверка — `isSaved()` из `models/entity.ts`.

## Соглашения бэкенда

- Слои: `api/v1` (роутеры) → `services` (логика и запросы) → `models` (SQLAlchemy).
- Порядок элементов хранится в полях `*_position`. Создание, перемещение и удаление выполняются через
  `services/ordering.py`: сервер сам берёт порядок из БД и не доверяет позициям, присланным клиентом.
- Обновления и вставки — через `services/crud.py`. Отсутствующий объект — `NotFoundError`,
  обработчик в `main.py` превращает её в 404; роутеры ошибки не проверяют.
- Удаление мягкое (`deleted_at`). Каскад на дочерние сущности делают триггеры БД из начальной миграции,
  поэтому все выборки фильтруют `deleted_at IS NULL`.
- Временные метки ставятся на стороне БД (`func.now()`), колонки — `timestamptz`.
- Авторизация — JWT: access-токен (15 мин) в заголовке `Authorization: Bearer`, refresh-токен (30 дней)
  в httpOnly cookie с путём `/api/v1/auth`, с ротацией и отзывом через таблицу `refresh_tokens`.
  Пароли хешируются Argon2 (`core/security.py`).
- Пользователь берётся только из токена (`CurrentUserId`), никогда из тела запроса. Все запросы фильтруются
  условиями из `services/ownership.py`; чужой объект — 404.
