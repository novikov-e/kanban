"""Создаёт демо-пользователя с демо-доской.

Те же данные, что раньше вставляла миграция initial_data: noved256@gmail.com / password
и доска «Демонстрация». Пароль хранится хешем. Повторный запуск ничего не дублирует.
Email и пароль можно переопределить через DEMO_EMAIL и DEMO_PASSWORD.
"""

import asyncio
import os
import re
from datetime import date
from pathlib import Path
from uuid import UUID, uuid5

from sqlalchemy import select, text

from app.core.security import hash_password, verify_password
from app.db.database import SessionFactory
from app.models import User

DEMO_EMAIL = "noved256@gmail.com"
DEMO_PASSWORD = "password"
DEMO_FIRSTNAME = "Егор"
DEMO_LASTNAME = "Новиков"
DEMO_BIRTHDATE = date(1990, 1, 31)
DEMO_SEX = "M"

DEMO_BOARD_SQL = Path(__file__).with_name("demo_board.sql")
UUID_LITERAL = re.compile(r"'([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})'")


def demo_board_statements(user_id: UUID) -> list[str]:
    """Строки demo_board.sql с id, уникальными для пользователя.

    id выводятся из id пользователя и исходного id детерминированно, поэтому у каждого пользователя
    своя копия доски, а повторный запуск попадает в `on conflict do nothing`.
    """
    sql = DEMO_BOARD_SQL.read_text(encoding="utf-8")
    sql = UUID_LITERAL.sub(lambda match: f"'{uuid5(user_id, match.group(1))}'", sql)
    return sql.splitlines()


async def seed(email: str, password: str) -> UUID:
    async with SessionFactory() as session, session.begin():
        user = (await session.execute(select(User).where(User.email == email))).scalar_one_or_none()
        if user is None:
            user = User(
                email=email,
                password=hash_password(password),
                firstname=DEMO_FIRSTNAME,
                lastname=DEMO_LASTNAME,
                date_of_birth=DEMO_BIRTHDATE,
                sex=DEMO_SEX,
            )
            session.add(user)
            await session.flush()
        elif (
            email == DEMO_EMAIL
            and user.firstname is None
            and user.lastname is None
            and not verify_password(password, user.password)
        ):
            # Аккаунт с демо-email уже завели через форму, пароль другой: вернуть прежний вход.
            user.password = hash_password(password)
            user.firstname = DEMO_FIRSTNAME
            user.lastname = DEMO_LASTNAME
            user.date_of_birth = DEMO_BIRTHDATE
            user.sex = DEMO_SEX
        for statement in demo_board_statements(user.id):
            await session.execute(text(statement), {"user_id": user.id})
        return user.id


def main() -> None:
    email = os.environ.get("DEMO_EMAIL", DEMO_EMAIL).lower()
    password = os.environ.get("DEMO_PASSWORD", DEMO_PASSWORD)
    user_id = asyncio.run(seed(email, password))
    print(f"Демо-пользователь {email} ({user_id}) готов")


if __name__ == "__main__":
    main()
