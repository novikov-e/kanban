from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Double, ForeignKey, Index, Text, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.task import Task


class Subtask(Base):
    __tablename__ = "subtasks"
    __table_args__ = (Index("task_subtasks_index", "task_id"),)

    subtask_id: Mapped[uuid.UUID] = mapped_column(primary_key=True, server_default=text("gen_random_uuid()"))
    task_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("tasks.task_id"))
    subtask_name: Mapped[str] = mapped_column(Text, nullable=False)
    subtask_state: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    subtask_position: Mapped[float] = mapped_column(Double, server_default=text("0"), nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    task: Mapped[Task] = relationship(back_populates="subtasks")
