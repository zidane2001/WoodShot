from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Address schemas
class AddressBase(BaseModel):
    street: str
    city: str
    postal_code: str
    country: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_default: bool = False

class AddressCreate(AddressBase):
    pass

class AddressResponse(AddressBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Product schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    wood_type: str
    price_per_unit: float
    unit: str
    stock_quantity: int
    image_url: Optional[str] = None
    specifications: Optional[dict] = None
    is_available: bool = True

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Order schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    total_price: float

class OrderItemResponse(OrderItemBase):
    id: int
    order_id: int
    product: ProductResponse

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    address_id: int
    total_amount: float
    delivery_date: Optional[datetime] = None

class OrderCreate(OrderBase):
    items: List[OrderItemBase]

class OrderResponse(OrderBase):
    id: int
    user_id: int
    status: str
    order_date: datetime
    payment_status: str
    tracking_number: Optional[str] = None
    address: AddressResponse
    order_items: List[OrderItemResponse]

    class Config:
        from_attributes = True

# Delivery schemas
class DeliveryResponse(BaseModel):
    id: int
    order_id: int
    status: str
    estimated_delivery: Optional[datetime] = None
    actual_delivery: Optional[datetime] = None
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    route_coordinates: Optional[dict] = None

    class Config:
        from_attributes = True

# Payment schemas
class PaymentRequest(BaseModel):
    amount: float
    currency: str = "EUR"
    crypto_currency: str = "BTC"
    order_id: str
    customer_email: str
    customer_name: str
    description: str

class PaymentResponse(BaseModel):
    payment_id: str
    payment_url: str
    amount: float
    currency: str
    crypto_currency: str
    status: str

# Auth schemas
class TokenResponse(BaseModel):
    access_token: str
    token_type: str