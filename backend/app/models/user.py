from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Date, DateTime, String, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base  # Базовый класс SQLAlchemy (DeclarativeBase)

if TYPE_CHECKING:
    from app.models.board import Board


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, server_default=text("gen_random_uuid()"))
    firstname: Mapped[str | None] = mapped_column(String(50))
    lastname: Mapped[str | None] = mapped_column(String(50))
    date_of_birth: Mapped[date | None] = mapped_column(Date)
    sex: Mapped[str | None] = mapped_column(String(1))
    image: Mapped[str | None] = mapped_column(String(150))
    email: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    dark_theme: Mapped[bool] = mapped_column(
        Boolean, server_default=text("false"))
    last_board: Mapped[uuid.UUID | None] = mapped_column(nullable=True)

    # Audit & Soft Delete
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    boards: Mapped[list[Board]] = relationship(back_populates="user", order_by="Board.board_position")
