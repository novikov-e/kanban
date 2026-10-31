"""Тесты работают с настоящим PostgreSQL.

Подключение берётся, как у приложения, из переменных POSTGRES_* или backend/.env, а база по умолчанию —
kanban_test. Имя базы обязано оканчиваться на `_test`: перед каждым тестом все таблицы очищаются.
База создаётся и мигрируется автоматически.
"""

import asyncio
import os
import subprocess
import sys
from collections.abc import AsyncIterator
from pathlib import Path

os.environ.setdefault("POSTGRES_DB", "kanban_test")
os.environ.setdefault("JWT_SECRET", "test-only-jwt-secret-0123456789abcdef")
# Тестовый клиент ходит по http, а cookie с флагом Secure по http не отправляются
os.environ["REFRESH_COOKIE_SECURE"] = "false"

import asyncpg  # noqa: E402
import pytest  # noqa: E402
from httpx import ASGITransport, AsyncClient  # noqa: E402
from sqlalchemy import text  # noqa: E402

from app.core.config import settings  # noqa: E402
from app.db.database import engine  # noqa: E402
from app.main import app  # noqa: E402
from tests.api import Api  # noqa: E402

BACKEND_DIR = Path(__file__).resolve().parent.parent
TABLES = "users, refresh_tokens, boards, columns, tasks, subtasks"


async def _create_database() -> None:
    connection = await asyncpg.connect(
        host=settings.POSTGRES_HOST,
        port=int(settings.POSTGRES_PORT),
        user=settings.POSTGRES_USER,
        password=settings.POSTGRES_PASSWORD,
        database="postgres",
    )
    try:
        exists = await connection.fetchval("select 1 from pg_database where datname = $1", settings.POSTGRES_DB)
        if not exists:
            await connection.execute(f'create database "{settings.POSTGRES_DB}"')
    finally:
        await connection.close()


@pytest.fixture(scope="session", autouse=True)
def database() -> None:
    if not settings.POSTGRES_DB.endswith("_test"):
        pytest.exit(f"POSTGRES_DB={settings.POSTGRES_DB}: тесты очищают базу, её имя должно оканчиваться на _test")
    asyncio.run(_create_database())
    subprocess.run([sys.executable, "-m", "alembic", "upgrade", "head"], cwd=BACKEND_DIR, check=True)


@pytest.fixture(autouse=True)
async def clean_tables(database: None) -> None:
    async with engine.begin() as connection:
        await connection.execute(text(f"truncate {TABLES} cascade"))


@pytest.fixture
async def client() -> AsyncIterator[AsyncClient]:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client


@pytest.fixture
async def api(client: AsyncClient) -> Api:
    return await Api.sign_up(client, "owner@example.com")


@pytest.fixture
async def stranger() -> AsyncIterator[Api]:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield await Api.sign_up(client, "stranger@example.com")
