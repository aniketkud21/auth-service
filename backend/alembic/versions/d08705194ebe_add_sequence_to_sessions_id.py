"""add sequence to sessions id

Revision ID: d08705194ebe
Revises: 89d312c9ff3f
Create Date: 2026-10-10 13:41:20.802127

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd08705194ebe'
down_revision: Union[str, Sequence[str], None] = '89d312c9ff3f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("CREATE SEQUENCE IF NOT EXISTS sessions_id_seq")
    op.execute("ALTER TABLE sessions ALTER COLUMN id SET DEFAULT nextval('sessions_id_seq')")
    op.execute("ALTER SEQUENCE sessions_id_seq OWNED BY sessions.id")


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("ALTER TABLE sessions ALTER COLUMN id DROP DEFAULT")
    op.execute("DROP SEQUENCE IF EXISTS sessions_id_seq")
