# Канбан

Доска с колонками, списками и задачами. Проекты принадлежат пользователю, вход по email и паролю.

Стек: Angular 22 (`frontend/`), FastAPI и SQLAlchemy 2 (`backend/`), PostgreSQL 18. Всё, что видит пользователь, на русском: доска в интерфейсе называется проектом.

Два способа запуска. Одновременно их включать нельзя: контейнер базы в обоих называется `postgresql` и использует один том. Перед сменой режима остановите текущий стек без `-v`, иначе данные сотрутся.

```bash
docker compose -f docker-compose.yml down
```

## Общее

Скопируйте `.env.example` в `.env` в корне и задайте `POSTGRES_PASSWORD`. Для production там же нужен `JWT_SECRET` не короче 32 символов.

Демо-пользователь и доска «Демонстрация» создаются начальной миграцией.

- email: `test@app.ru`
- пароль: `password`

Миграция одна. Базу, которую собрали прежние миграции, нужно создать заново: иначе `alembic upgrade head` не найдёт старую ревизию. Для этого остановите стек с `-v` (том с данными удалится) и поднимите его снова.

## Production

Весь стек в Docker: база, миграции, API и nginx с собранным фронтендом. Сервисы в сети `kanban`. Порт базы наружу не публикуется, бэкенд доступен только из этой сети. nginx слушает http://localhost:8080 и проксирует `/api/` на бэкенд.

```bash
docker compose -f docker-compose.yml up -d --build
```

Остановка:

```bash
docker compose -f docker-compose.yml down
```

## Development

В Docker работает только PostgreSQL и слушает `127.0.0.1:5432`. Бэкенд и фронтенд запускаются на хосте: API с перезагрузкой на порту 8000, Angular на порту 4200. `ng serve` проксирует `/api` на `localhost:8000`, поэтому браузер ходит в бэкенд через тот же origin.

Нужны Python 3.12 и [uv](https://docs.astral.sh/uv/), Node.js ^22.22.3 или ^24.15.0.

Скопируйте `backend/.env.example` в `backend/.env`. Хост базы — `127.0.0.1`: так процесс на машине попадает в проброшенный порт. `host.docker.internal` здесь не подходит, это имя для контейнера, который обращается к хосту. `JWT_SECRET` тот же, не короче 32 символов. `POSTGRES_PASSWORD` должен совпадать с паролем в корневом `.env`.

База:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Бэкенд, из каталога `backend/`:

```bash
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8000
```

Фронтенд, из каталога `frontend/`:

```bash
npm ci
npm start
```

Приложение — http://localhost:4200.

Остановка базы:

```bash
docker compose -f docker-compose.dev.yml down
```
