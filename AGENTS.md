# Kanban

Пет-проект канбан-доски: Angular 22 (`frontend/`), FastAPI + SQLAlchemy 2 async (`backend/`), PostgreSQL.

## Запуск

Весь стек в Docker (из корня): скопировать `.env.example` в `.env` и задать секреты, затем
`docker compose up -d --build`, приложение — http://localhost:8080. Значений по умолчанию у секретов нет:
без `POSTGRES_PASSWORD` и `JWT_SECRET` compose и бэкенд не запустятся.
Сервисы `postgresql`, `migrate`, `backend`, `positions-rebalancer`, `frontend` в общей сети `kanban`.
Одноразовый `migrate` (`alembic upgrade head`) запускается после готовности БД; `backend` и
`positions-rebalancer` стартуют только после его успешного завершения. Все три собираются из одного образа
`kanban-backend`. nginx во фронтенд-контейнере раздаёт сборку Angular и проксирует `/api/` на `backend:8000`.
Healthcheck бэкенда — `GET /health` (200, если доступна БД, иначе 503); наружу он не проксируется,
`frontend` ждёт здорового `backend`.

Демо-данные не входят в миграции. Создать демо-пользователя с демо-доской:
`docker compose exec -e DEMO_PASSWORD=<пароль> backend python -m app.demo.seed`
(email — `DEMO_EMAIL`, по умолчанию `demo@example.com`; повторный запуск ничего не дублирует).

Локальная разработка:

- БД: `docker compose up -d postgresql`.
- Бэкенд (из `backend/`): `uv sync`, `uv run alembic upgrade head`, `uv run uvicorn app.main:app --reload --port 8000`.
  Зависимости — в `pyproject.toml`, точные версии — в `uv.lock` (`uv add` / `uv lock --upgrade`, lock коммитится).
  Настройки подключения — в `backend/.env` (шаблон: `backend/.env.example`).
- Фронтенд (из `frontend/`): `npm ci`, `npm start` — `ng serve` с `proxy.conf.json`, который проксирует `/api` на `localhost:8000`.

## Проверки перед завершением задачи

- Бэкенд (из `backend/`): `uv run ruff format app alembic tests`, `uv run ruff check app alembic tests`
  и `uv run pytest`. Тесты работают с настоящим PostgreSQL (подключение — как у приложения, из `POSTGRES_*`
  или `.env`); база `kanban_test` создаётся и мигрируется сама, имя базы обязано оканчиваться на `_test`.
- Фронтенд (Node.js ^22.22.3 или ^24.15.0): `npm run format` (Prettier), `npx ng build --configuration development`
  и `npx ng test --watch=false` (Vitest).
- Комментарии — только для неочевидных ограничений; код должен читаться без них.
- Изменения моделей сопровождаются миграцией Alembic; `alembic check` должен проходить без новых операций.

## Сущности и API

Иерархия: Board → Column → Task → Subtask. Одни и те же имена используются в моделях фронтенда,
компонентах, сервисах, маршрутах и моделях бэкенда.

- REST: `GET/PATCH /users/me`; `POST /boards`; `GET/PATCH/DELETE /boards/{id}`; создание дочерних элементов —
  `POST /boards/{id}/columns`, `/columns/{id}/tasks`, `/tasks/{id}/subtasks`; `PATCH/DELETE /columns/{id}`,
  `/tasks/{id}`, `/subtasks/{id}`. `PATCH` частичный и отвечает 204; перемещение — `PATCH` с `index`
  и, при смене родителя, `boardId` / `columnId` / `taskId`.

- JSON ответов — camelCase с полями `id`, `name`, `position` и вложенными `columns` / `tasks` / `subtasks`.
  Маппинг с колонками БД (`board_id`, `task_name`, …) делается через `validation_alias` в `backend/app/schemas/`.
- Тела запросов (`*Request`) наследуют `ApiRequest` из `backend/app/schemas/common.py`, ответы — `*Response`.
  Каждый эндпоинт описан для Swagger (`/docs`): `summary`, docstring, описания полей, ответ 404.
- Фронтенд отправляет только поля, которые читает сервер: позиции при создании и «старые» родитель/позиция
  при перемещении не передаются.
- Видимые пользователю тексты интерфейса на русском называют доску «проектом».
- Тексты интерфейса размечаются для `@angular/localize` (исходная локаль `ru`): в шаблонах `i18n="@@id"` /
  `i18n-aria-label="@@id"`, в коде `` $localize`:@@id:текст` ``. После изменения текстов —
  `npm run extract-i18n` (обновляет `frontend/src/locale/messages.xlf`). Кнопки-иконки имеют `aria-label`.

## Соглашения фронтенда

- Standalone-компоненты без `NgModule`, конфигурация приложения — в `src/app/app.config.ts`.
- Маршруты (`app.routes.ts`): `/login`; `/` — рабочая область (`WorkspaceComponent`), без проекта перенаправляет
  на последний открытый; `/boards/:boardId` — проект. `authGuard` восстанавливает сессию по refresh-cookie
  и загружает пользователя, без сессии отправляет на `/login?returnUrl=…`. Параметры маршрута приходят
  в компоненты через `input()` (`withComponentInputBinding`).
- Шаблоны используют `@if` / `@for`, зависимости подключаются через `inject()`.
- Приложение работает без zone.js (`provideZonelessChangeDetection()`), все компоненты — `OnPush`.
- Состояние хранится в signal-сторах `state/user.store.ts` и `state/board.store.ts`; компоненты получают данные
  через `input()` и вызывают методы стора. Дерево доски неизменяемо: правки — только через чистые функции
  `utils/board-tree.ts`, которые возвращают новые объекты.
- Модели в `models/` — интерфейсы с `readonly`-полями, описывающие только то, что читает фронтенд; новые элементы
  создают фабрики `newColumn()` / `newTask()` / `newSubtask()`. Порядок — индекс в массиве, `position` не нужен.
- Списки перетаскивания вложены друг в друга, поэтому `cdkDropListGroup` не работает: списки одного уровня
  связываются через `cdkDropListConnectedTo` с id из `BoardStore.taskListIds` / `subtaskListIds`.
- Цвета — CSS-переменные палитры в `styles.css` (`--theme-*`, `--task-color-N`); тёмная тема — класс
  `theme-dark` на `<html>`. Задача задаёт свой цвет атрибутом `data-color`, вложенные элементы берут его
  из `--accent` / `--accent-hover`. Инлайн-цвета и директивы, меняющие стили через DOM, не используются:
  наведение — `:hover` в CSS.
- Сервисы в `services/` только отправляют HTTP-запросы и возвращают `Observable`; подписываются сторы.
- Изменения применяются оптимистично. `interceptors/http-error.interceptor.ts` показывает снекбар и пробрасывает
  ошибку дальше; сторы в ответ перезагружают состояние с сервера. Подписки, которым нечего откатывать,
  передают `error: errorAlreadyReported`.
- Access-токен хранится только в памяти (`AuthService`); `auth.interceptor.ts` подставляет его и при 401
  один раз обновляет токен через cookie и повторяет запрос.
- Новый элемент до ответа сервера получает локальный id (`newLocalId()`), проверка — `isSaved()`
  из `models/entity.ts`. Стор создаёт элемент один раз, а дочерние элементы — только после сохранения родителя.

## Соглашения бэкенда

- Слои: `api/v1` (роутеры) → `services` (логика и запросы) → `models` (SQLAlchemy).
- Одна транзакция на запрос: `DbSession` коммитит после обработчика и до отправки ответа (`scope="function"`),
  откатывает при исключении. Сервисы не вызывают `commit()`, только `flush()` при необходимости.
- Порядок элементов хранится в полях `*_position` типа double. Создание, перемещение и удаление — через
  `services/ordering.py`: клиент передаёт только индекс места, сервер ставит элемент в середину между соседями
  одним UPDATE под блокировкой строки родителя (`SELECT … FOR UPDATE`). Если точности double не хватает,
  список родителя перенумеровывается сразу. Раз в сутки сервис `positions-rebalancer`
  (`python -m app.jobs.rebalance_positions`, время — `POSITIONS_REBALANCE_AT`, UTC) выравнивает все позиции в 1, 2, 3…;
  `--once` — разовый запуск.
- Обновления и вставки — через `services/crud.py`. Отсутствующий объект — `NotFoundError`,
  обработчик в `main.py` превращает её в 404; роутеры ошибки не проверяют.
- Удаление мягкое (`deleted_at`). Каскад на дочерние сущности делают триггеры БД, поэтому все выборки
  фильтруют `deleted_at IS NULL`. Триггер помечает только ещё не удалённых потомков, а при восстановлении
  (`deleted_at = NULL`) возвращает лишь удалённых вместе с родителем — с тем же `deleted_at`.
- Временные метки ставятся на стороне БД (`func.now()`), колонки — `timestamptz`.
- Авторизация — JWT: access-токен (15 мин) в заголовке `Authorization: Bearer`, refresh-токен (30 дней)
  в httpOnly cookie с путём `/api/v1/auth`, с ротацией и отзывом через таблицу `refresh_tokens`.
  Токен, замененный ротацией не дольше `REFRESH_REUSE_INTERVAL_SECONDS` (10 с) назад, принимается ещё раз —
  ответ с новым токеном мог не дойти до браузера; более поздний повтор отзывает все сессии пользователя.
  Пароли хешируются Argon2 (`core/security.py`).
- Пользователь берётся только из токена (`CurrentUserId`), никогда из тела запроса. Все запросы фильтруются
  условиями из `services/ownership.py`; чужой объект — 404.
