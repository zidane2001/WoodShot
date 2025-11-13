"""add_settings_table

Revision ID: e1391c8426b0
Revises: 7f96ea35ed33
Create Date: 2025-11-13 09:10:56.329723

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e1391c8426b0'
down_revision: Union[str, None] = '7f96ea35ed33'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Table already created by Base.metadata.create_all()
    pass


def downgrade() -> None:
    op.drop_table('settings')
