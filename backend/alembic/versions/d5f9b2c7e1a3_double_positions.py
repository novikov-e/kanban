"""double positions

Позиции становятся числами double: перемещение ставит элемент между соседями одним UPDATE.
Существующие позиции перенумеровываются в 1, 2, 3… внутри каждого родителя.

Revision ID: d5f9b2c7e1a3
Revises: c4e8a1f3d2b9
Create Date: 2026-11-01 00:10:00.000000

"""

from collections.abc import Sequence

from alembic import op

revision: str = "d5f9b2c7e1a3"
down_revision: str | None = "c4e8a1f3d2b9"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

TABLES = [
    ("boards", "board_id", "user_id", "board_position"),
    ("columns", "column_id", "board_id", "column_position"),
    ("tasks", "task_id", "column_id", "task_position"),
    ("subtasks", "subtask_id", "task_id", "subtask_position"),
]


def upgrade() -> None:
    for table, id_column, parent_column, position in TABLES:
        op.execute(f"alter table {table} alter column {position} type double precision")
        op.execute(f"""
            update {table} t set {position} = ranked.rank
            from (
                select {id_column}, row_number() over (partition by {parent_column} order by {position}, {id_column}) rank
                from {table}
            ) ranked
            where t.{id_column} = ranked.{id_column}
        """)


def downgrade() -> None:
    for table, _, _, position in TABLES:
        op.execute(f"alter table {table} alter column {position} type integer using round({position})::integer")
