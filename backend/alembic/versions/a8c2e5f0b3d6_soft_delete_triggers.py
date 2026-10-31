"""soft delete triggers keep history

Каскад мягкого удаления больше не перезаписывает deleted_at уже удалённых потомков,
а восстановление возвращает только тех, кто был удалён вместе с родителем
(с тем же deleted_at), а не всех потомков подряд.

Revision ID: a8c2e5f0b3d6
Revises: f7b1d4e9a2c5
Create Date: 2026-11-01 00:40:00.000000

"""

from collections.abc import Sequence

from alembic import op

revision: str = "a8c2e5f0b3d6"
down_revision: str | None = "f7b1d4e9a2c5"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

CASCADES = [
    ("soft_delete_board_cascade", "columns", "board_id"),
    ("soft_delete_column_cascade", "tasks", "column_id"),
    ("soft_delete_task_cascade", "subtasks", "task_id"),
]


def upgrade() -> None:
    for function, children, parent_key in CASCADES:
        op.execute(f"""
            create or replace function {function}()
            returns trigger as $$
            begin
                if old.deleted_at is null and new.deleted_at is not null then
                    update {children} set deleted_at = new.deleted_at
                    where {parent_key} = new.{parent_key} and deleted_at is null;
                elsif old.deleted_at is not null and new.deleted_at is null then
                    update {children} set deleted_at = null
                    where {parent_key} = new.{parent_key} and deleted_at = old.deleted_at;
                end if;
                return new;
            end;
            $$ language plpgsql;
        """)


def downgrade() -> None:
    for function, children, parent_key in CASCADES:
        op.execute(f"""
            create or replace function {function}()
            returns trigger as $$
            begin
                if new.deleted_at is distinct from old.deleted_at then
                    update {children} set deleted_at = new.deleted_at where {parent_key} = new.{parent_key};
                end if;
                return new;
            end;
            $$ language plpgsql;
        """)
