from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Index, Integer, Text, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.column import Column
    from app.models.subtask import Subtask


class Task(Base):
    __tablename__ = "tasks"
    __table_args__ = (Index("column_tasks_index", "column_id"),)

    task_id: Mapped[uuid.UUID] = mapped_column(primary_key=True, server_default=text("gen_random_uuid()"))
    column_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("columns.column_id"))
    task_name: Mapped[str] = mapped_column(Text, nullable=False)
    color: Mapped[int] = mapped_column(Integer, server_default=text("1"), nullable=False)
    task_position: Mapped[int] = mapped_column(Integer, server_default=text("0"), nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    column: Mapped[Column] = relationship(back_populates="tasks")
    subtasks: Mapped[list[Subtask]] = relationship(back_populates="task", order_by="Subtask.subtask_position")
