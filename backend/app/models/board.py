from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Double, ForeignKey, Index, String, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.column import Column
    from app.models.user import User


class Board(Base):
    __tablename__ = "boards"
    __table_args__ = (Index("user_boards_index", "user_id"),)

    board_id: Mapped[uuid.UUID] = mapped_column(primary_key=True, server_default=text("gen_random_uuid()"))
    user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"))
    board_name: Mapped[str] = mapped_column(String(100), nullable=False)
    board_position: Mapped[float] = mapped_column(Double, server_default=text("0"), nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    user: Mapped[User] = relationship(back_populates="boards")
    columns: Mapped[list[Column]] = relationship(back_populates="board", order_by="Column.column_position")
