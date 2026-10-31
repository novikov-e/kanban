"""auth: refresh tokens and hashed passwords

Revision ID: c4e8a1f3d2b9
Revises: b7d4e2a9c1f6
Create Date: 2026-10-31 23:30:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa
from pwdlib import PasswordHash

from alembic import op

revision: str = "c4e8a1f3d2b9"
down_revision: str | None = "b7d4e2a9c1f6"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "refresh_tokens",
        sa.Column("token_id", sa.Uuid(), primary_key=True),
        sa.Column("user_id", sa.Uuid(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("user_refresh_tokens_index", "refresh_tokens", ["user_id"])

    connection = op.get_bind()
    password_hash = PasswordHash.recommended()
    plain = connection.execute(sa.text("select id, password from users where password not like '$argon2%'")).all()
    for user_id, password in plain:
        connection.execute(
            sa.text("update users set password = :hash where id = :id"),
            {"hash": password_hash.hash(password), "id": user_id},
        )


def downgrade() -> None:
    op.drop_index("user_refresh_tokens_index", table_name="refresh_tokens")
    op.drop_table("refresh_tokens")
