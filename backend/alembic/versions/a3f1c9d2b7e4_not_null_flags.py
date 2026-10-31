"""not_null_flags

Revision ID: a3f1c9d2b7e4
Revises: 69c6ec9bb2bb
Create Date: 2026-10-30 23:50:00.000000

"""

from collections.abc import Sequence

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a3f1c9d2b7e4"
down_revision: str | Sequence[str] | None = "69c6ec9bb2bb"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("update users set dark_theme = false where dark_theme is null;")
    op.execute("alter table users alter column dark_theme set not null;")
    op.execute("update subtasks set subtask_state = false where subtask_state is null;")
    op.execute("alter table subtasks alter column subtask_state set not null;")


def downgrade() -> None:
    op.execute("alter table subtasks alter column subtask_state drop not null;")
    op.execute("alter table users alter column dark_theme drop not null;")
