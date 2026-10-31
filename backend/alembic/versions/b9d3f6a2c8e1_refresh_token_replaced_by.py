"""refresh token remembers its replacement

refresh_tokens.replaced_by — токен, выданный взамен при ротации. По нему ротация отличается от выхода:
только недавно замененный токен можно обменять ещё раз.

Revision ID: b9d3f6a2c8e1
Revises: a8c2e5f0b3d6
Create Date: 2026-11-01 01:20:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "b9d3f6a2c8e1"
down_revision: str | None = "a8c2e5f0b3d6"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("refresh_tokens", sa.Column("replaced_by", sa.Uuid(), nullable=True))
    op.create_foreign_key(
        "refresh_tokens_replaced_by_fkey",
        "refresh_tokens",
        "refresh_tokens",
        ["replaced_by"],
        ["token_id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("refresh_tokens_replaced_by_fkey", "refresh_tokens", type_="foreignkey")
    op.drop_column("refresh_tokens", "replaced_by")
