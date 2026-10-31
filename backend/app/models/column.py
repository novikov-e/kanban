from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Double, ForeignKey, Index, String, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.board import Board
    from app.models.task import Task


class Column(Base):
    __tablename__ = "columns"
    __table_args__ = (Index("board_columns_index", "board_id"),)

    column_id: Mapped[uuid.UUID] = mapped_column(primary_key=True, server_default=text("gen_random_uuid()"))
    board_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("boards.board_id"))
    column_name: Mapped[str] = mapped_column(String(80), nullable=False)
    column_position: Mapped[float] = mapped_column(Double, server_default=text("0"), nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    board: Mapped[Board] = relationship(back_populates="columns")
    tasks: Mapped[list[Task]] = relationship(back_populates="column", order_by="Task.task_position")
