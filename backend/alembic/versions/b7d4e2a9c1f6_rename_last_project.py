"""rename_last_project

Revision ID: b7d4e2a9c1f6
Revises: a3f1c9d2b7e4
Create Date: 2026-10-31 00:50:00.000000

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'b7d4e2a9c1f6'
down_revision: Union[str, Sequence[str], None] = 'a3f1c9d2b7e4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("alter table users rename column last_project to last_board;")


def downgrade() -> None:
    op.execute("alter table users rename column last_board to last_project;")
