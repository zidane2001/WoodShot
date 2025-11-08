from database import engine
from sqlalchemy import text

def drop_user_tables():
    """Drop all user-related tables"""
    with engine.connect() as conn:
        tables = ['users', 'addresses', 'orders', 'order_items', 'deliveries']
        for table in tables:
            try:
                conn.execute(text(f'DROP TABLE IF EXISTS {table} CASCADE'))
                print(f'Dropped table: {table}')
            except Exception as e:
                print(f'Error dropping {table}: {e}')
        conn.commit()
    print('User-related tables dropped successfully!')

if __name__ == "__main__":
    drop_user_tables()