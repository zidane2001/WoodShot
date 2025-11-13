"""add_settings_table

Revision ID: a4168e1f5c6a
Revises: e1391c8426b0
Create Date: 2025-11-13 11:55:44.818536

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a4168e1f5c6a'
down_revision: Union[str, None] = 'e1391c8426b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('settings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('key', sa.String(), nullable=False),
        sa.Column('value', sa.Text(), nullable=True),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('key')
    )
    op.create_index(op.f('ix_settings_id'), 'settings', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_settings_id'), table_name='settings')
    op.drop_table('settings')
