from uuid import UUID

from sqlalchemy import ColumnElement, Select, select

from app.models import Board, Column, Subtask, Task


def board_owned_by(user_id: UUID) -> ColumnElement[bool]:
    return Board.user_id == user_id


def column_owned_by(user_id: UUID) -> ColumnElement[bool]:
    return Column.board_id.in_(_owned_board_ids(user_id))


def task_owned_by(user_id: UUID) -> ColumnElement[bool]:
    return Task.column_id.in_(_owned_column_ids(user_id))


def subtask_owned_by(user_id: UUID) -> ColumnElement[bool]:
    return Subtask.task_id.in_(_owned_task_ids(user_id))


def _owned_board_ids(user_id: UUID) -> Select[tuple[UUID]]:
    return select(Board.board_id).where(board_owned_by(user_id), Board.deleted_at.is_(None))


def _owned_column_ids(user_id: UUID) -> Select[tuple[UUID]]:
    return select(Column.column_id).where(column_owned_by(user_id), Column.deleted_at.is_(None))


def _owned_task_ids(user_id: UUID) -> Select[tuple[UUID]]:
    return select(Task.task_id).where(task_owned_by(user_id), Task.deleted_at.is_(None))
