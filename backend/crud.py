from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import User, Product, Order, OrderItem, Address
from schemas import UserCreate, ProductCreate, OrderCreate
from auth import get_password_hash, verify_password

# User CRUD
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password_hash=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not user.is_active:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user

# Product CRUD
def get_products(db: Session, skip: int = 0, limit: int = 100, wood_type: str = None):
    query = db.query(Product)
    if wood_type:
        query = query.filter(Product.wood_type == wood_type)
    return query.offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()

def create_product_crud(db: Session, product: ProductCreate):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# Order CRUD
def get_orders_by_user(db: Session, user_id: int):
    return db.query(Order).filter(Order.user_id == user_id).all()

def get_order(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()

def create_order_crud(db: Session, order: OrderCreate, user_id: int):
    # Create order
    db_order = Order(
        user_id=user_id,
        address_id=order.address_id,
        total_amount=order.total_amount,
        delivery_date=order.delivery_date
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Create order items
    for item in order.items:
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.total_price
        )
        db.add(db_item)

    db.commit()
    db.refresh(db_order)
    return db_order

# Address CRUD
def get_addresses_by_user(db: Session, user_id: int):
    return db.query(Address).filter(Address.user_id == user_id).all()

def create_address(db: Session, address_data: dict, user_id: int):
    db_address = Address(user_id=user_id, **address_data)
    db.add(db_address)
    db.commit()
    db.refresh(db_address)
    return db_address

# Admin CRUD operations
def update_product(db: Session, product_id: int, product_data: dict):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        return None
    for key, value in product_data.items():
        if hasattr(db_product, key):
            setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        return False
    # Soft delete by setting unavailable
    db_product.is_available = False
    db.commit()
    return True

def update_inventory(db: Session, product_id: int, quantity: int):
    db_inventory = db.query(Inventory).filter(Inventory.product_id == product_id).first()
    if not db_inventory:
        # Create inventory record if it doesn't exist
        db_inventory = Inventory(product_id=product_id, quantity=quantity)
        db.add(db_inventory)
    else:
        db_inventory.quantity = quantity
    db.commit()
    db.refresh(db_inventory)
    return db_inventory

def get_all_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Order).offset(skip).limit(limit).all()

def update_order_status(db: Session, order_id: int, status: str):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        return None
    db_order.status = status
    db.commit()
    db.refresh(db_order)
    return db_order

def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()