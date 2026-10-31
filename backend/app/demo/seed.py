"""Создаёт демо-пользователя с демо-доской.

Запуск: DEMO_PASSWORD=... python -m app.demo.seed
Email задаётся через DEMO_EMAIL (по умолчанию demo@example.com). Повторный запуск ничего не дублирует.
"""

import asyncio
import os
from pathlib import Path
from uuid import UUID

from sqlalchemy import select, text

from app.core.security import hash_password
from app.db.database import SessionFactory
from app.models import User

DEMO_BOARD_SQL = Path(__file__).with_name("demo_board.sql")


async def seed(email: str, password: str) -> UUID:
    async with SessionFactory() as session, session.begin():
        user_id = (await session.execute(select(User.id).where(User.email == email))).scalar_one_or_none()
        if user_id is None:
            user = User(email=email, password=hash_password(password), firstname="Демо")
            session.add(user)
            await session.flush()
            user_id = user.id
        for statement in DEMO_BOARD_SQL.read_text(encoding="utf-8").splitlines():
            await session.execute(text(statement), {"user_id": user_id})
    return user_id


def main() -> None:
    email = os.environ.get("DEMO_EMAIL", "demo@example.com").lower()
    user_id = asyncio.run(seed(email, os.environ["DEMO_PASSWORD"]))
    print(f"Демо-пользователь {email} ({user_id}) готов")


if __name__ == "__main__":
    main()
