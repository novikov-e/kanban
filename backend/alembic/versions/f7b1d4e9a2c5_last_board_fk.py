"""last_board foreign key

users.last_board ссылается на доску внешним ключом. Ссылки на несуществующие, удалённые
и чужие доски обнуляются.

Revision ID: f7b1d4e9a2c5
Revises: e6a0c3d8f4b1
Create Date: 2026-11-01 00:30:00.000000

"""

from collections.abc import Sequence

from alembic import op

revision: str = "f7b1d4e9a2c5"
down_revision: str | None = "e6a0c3d8f4b1"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("""
        update users set last_board = null
        where last_board is not null and not exists (
            select 1 from boards
            where boards.board_id = users.last_board and boards.user_id = users.id and boards.deleted_at is null
        )
    """)
    op.create_foreign_key(
        "users_last_board_fkey", "users", "boards", ["last_board"], ["board_id"], ondelete="SET NULL"
    )


def downgrade() -> None:
    op.drop_constraint("users_last_board_fkey", "users", type_="foreignkey")
