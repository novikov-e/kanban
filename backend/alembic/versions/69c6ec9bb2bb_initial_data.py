"""initial_data

Демо-данные с паролем в открытом виде перенесены из миграции в команду `python -m app.demo.seed`:
миграции применяются в любом окружении, а демо-пользователь нужен только для разработки.
Ревизия оставлена пустой, чтобы не ломать цепочку миграций уже развёрнутых БД.

Revision ID: 69c6ec9bb2bb
Revises: e0c305f4253d
Create Date: 2026-10-29 18:48:53.602729

"""

from collections.abc import Sequence

revision: str = "69c6ec9bb2bb"
down_revision: str | None = "e0c305f4253d"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
