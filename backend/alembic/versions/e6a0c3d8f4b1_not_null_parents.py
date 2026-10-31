"""not null parents

Элемент без родителя недостижим из интерфейса. Такие строки удаляются вместе с потомками,
после чего ссылки на родителя становятся NOT NULL.

Revision ID: e6a0c3d8f4b1
Revises: d5f9b2c7e1a3
Create Date: 2026-11-01 00:20:00.000000

"""

from collections.abc import Sequence

from alembic import op

revision: str = "e6a0c3d8f4b1"
down_revision: str | None = "d5f9b2c7e1a3"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

DELETE_ORPHANS = [
    "create temporary table orphan_boards on commit drop as select board_id from boards where user_id is null",
    """create temporary table orphan_columns on commit drop as select column_id from columns
       where board_id is null or board_id in (select board_id from orphan_boards)""",
    """create temporary table orphan_tasks on commit drop as select task_id from tasks
       where column_id is null or column_id in (select column_id from orphan_columns)""",
    "delete from subtasks where task_id is null or task_id in (select task_id from orphan_tasks)",
    "delete from tasks where task_id in (select task_id from orphan_tasks)",
    "delete from columns where column_id in (select column_id from orphan_columns)",
    "delete from boards where board_id in (select board_id from orphan_boards)",
]

PARENTS = [("boards", "user_id"), ("columns", "board_id"), ("tasks", "column_id"), ("subtasks", "task_id")]


def upgrade() -> None:
    for statement in DELETE_ORPHANS:
        op.execute(statement)
    for table, parent_column in PARENTS:
        op.alter_column(table, parent_column, nullable=False)


def downgrade() -> None:
    for table, parent_column in PARENTS:
        op.alter_column(table, parent_column, nullable=True)
