from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
import os
import shutil
from pathlib import Path
import httpx
import uuid
from typing import Dict, Any

from database import get_db, engine
from models import Base
from schemas import *
from auth import create_access_token, verify_token
from crud import *

# Create database tables (only if they don't exist)
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")
except Exception as e:
    print(f"Database connection issue: {e}")
    print("Continuing without table creation - assuming tables already exist")

app = FastAPI(
    title="WoodShot API",
    description="API pour la plateforme e-commerce de bois de chauffage",
    version="1.0.0"
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Mount static files for uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Mount frontend public photos for product images
import os
frontend_photos_path = os.path.join(os.path.dirname(__file__), "../frontend/public/photos")
if os.path.exists(frontend_photos_path):
    app.mount("/photos", StaticFiles(directory=frontend_photos_path), name="photos")

# CORS middleware - Ultra-permissive configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=lambda origin: True,  # Allow all origins dynamically
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],  # Expose all headers to client
    max_age=86400,  # Cache preflight for 24 hours
)

security = HTTPBearer()

# NowPayments configuration
NOWPAYMENTS_API_KEY = os.getenv("NOWPAYMENTS_API_KEY")
NOWPAYMENTS_BASE_URL = "https://api.nowpayments.io/v1"

# Dependency to get current user
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide"
        )
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur non trouvé"
        )
    return user

# Dependency to get current admin user
async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide"
        )
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur non trouvé"
        )
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès administrateur requis"
        )
    return user

# Auth routes
@app.post("/api/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email déjà enregistré")
    return create_user(db, user)

@app.post("/api/auth/login", response_model=TokenResponse)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

# Product routes
@app.get("/api/products", response_model=List[ProductResponse])
def read_products(
    skip: int = 0,
    limit: int = 100,
    wood_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    products = get_products(db, skip=skip, limit=limit, wood_type=wood_type)
    return products

@app.get("/api/products/{product_id}", response_model=ProductResponse)
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return product

@app.post("/api/products", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # TODO: Add admin check
    return create_product_crud(db, product)

# Order routes
@app.post("/api/orders", response_model=OrderResponse)
def create_order(
    order: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_order_crud(db, order, current_user.id)

@app.get("/api/orders", response_model=List[OrderResponse])
def read_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_orders_by_user(db, current_user.id)

@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/api/orders/{order_id}", response_model=OrderResponse)
def read_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = get_order(db, order_id)
    if not order or order.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    return order

# Delivery tracking
@app.get("/api/delivery/{tracking_number}")
def get_delivery_status(tracking_number: str, db: Session = Depends(get_db)):
    # Mock delivery data - in real app, this would query delivery service
    return {
        "tracking_number": tracking_number,
        "status": "in_transit",
        "estimated_delivery": "2024-12-15T14:30:00Z",
        "current_location": {
            "address": "Paris 15ème, France",
            "lat": 48.8566,
            "lng": 2.3522
        }
    }

# Payment routes
@app.post("/api/payments/create", response_model=PaymentResponse)
async def create_payment(payment: PaymentRequest):
    """
    Create a payment request using NowPayments API
    """
    try:
        # Check if API key is configured
        if NOWPAYMENTS_API_KEY == "YOUR_ACTUAL_NOWPAYMENTS_API_KEY_HERE" or not NOWPAYMENTS_API_KEY:
            # Fallback: redirect to the static payment URL provided by user
            return PaymentResponse(
                payment_id=f"fallback_{payment.order_id}",
                payment_url="https://nowpayments.io/payment/?iid=6405381471",
                amount=payment.amount,
                currency=payment.currency,
                crypto_currency=payment.crypto_currency,
                status="pending"
            )

        # Map crypto currency names to NowPayments format
        crypto_mapping = {
            "bitcoin": "btc",
            "btc": "btc",
            "usdt": "usdttrc20",
            "tether": "usdttrc20"
        }

        crypto_currency = crypto_mapping.get(payment.crypto_currency.lower(), "btc")

        # Prepare payment data for NowPayments
        payment_data = {
            "price_amount": payment.amount,
            "price_currency": payment.currency,
            "pay_currency": crypto_currency,
            "order_id": payment.order_id,
            "order_description": payment.description,
            "customer_email": payment.customer_email,
            "customer_name": payment.customer_name,
            "ipn_callback_url": f"{os.getenv('BASE_URL', 'http://localhost:8000')}/api/payments/callback",
            "success_url": f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/payment/success",
            "cancel_url": f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/payment/cancel"
        }

        # Make request to NowPayments API
        headers = {
            "x-api-key": NOWPAYMENTS_API_KEY,
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{NOWPAYMENTS_BASE_URL}/payment",
                json=payment_data,
                headers=headers,
                timeout=30.0
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail=f"Erreur NowPayments: {response.text}"
                )

            payment_response = response.json()

            return PaymentResponse(
                payment_id=payment_response["payment_id"],
                payment_url=payment_response["pay_address"],
                amount=payment.amount,
                currency=payment.currency,
                crypto_currency=crypto_currency,
                status="pending"
            )

    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Erreur de connexion: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")

@app.post("/api/payments/callback")
async def payment_callback(callback_data: Dict[str, Any]):
    """
    Handle NowPayments IPN callback
    """
    # Verify the callback is from NowPayments (you should implement signature verification)
    # For now, just log the callback
    print(f"Payment callback received: {callback_data}")

    # Update order status based on payment status
    # This would update your database with payment confirmation

    return {"status": "ok"}

# Admin routes
@app.put("/api/admin/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    updated_product = update_product_crud(db, product_id, product.dict())
    if not updated_product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return updated_product

@app.delete("/api/admin/products/{product_id}")
def delete_product(
    product_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    success = delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return {"message": "Produit supprimé avec succès"}

@app.put("/api/admin/inventory/{product_id}")
def update_inventory(
    product_id: int,
    quantity: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    inventory = update_inventory(db, product_id, quantity)
    return {"message": "Stock mis à jour", "inventory": inventory}

@app.get("/api/admin/orders", response_model=List[OrderResponse])
def get_all_orders(
    skip: int = 0,
    limit: int = 100,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return get_all_orders(db, skip=skip, limit=limit)

@app.put("/api/admin/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    status: str,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = update_order_status(db, order_id, status)
    if not order:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    return {"message": "Statut de commande mis à jour", "order": order}

@app.get("/api/admin/users", response_model=List[UserResponse])
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return get_all_users(db, skip=skip, limit=limit)

@app.post("/api/admin/upload-image")
def upload_product_image(
    file: UploadFile = File(...),
    current_admin: User = Depends(get_current_admin)
):
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Type de fichier non autorisé")

    # Validate file size (5MB max)
    file_size = 0
    content = file.file.read()
    file_size = len(content)

    if file_size > 5 * 1024 * 1024:  # 5MB
        raise HTTPException(status_code=400, detail="Fichier trop volumineux (max 5MB)")

    # Generate unique filename
    import uuid
    file_extension = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename

    # Save file
    with open(file_path, "wb") as buffer:
        buffer.write(content)

    # Return the URL
    image_url = f"http://localhost:8000/uploads/{unique_filename}"
    return {"image_url": image_url}

@app.get("/api/admin/dashboard")
def get_admin_dashboard(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    # Get basic stats for admin dashboard
    total_products = db.query(Product).count()
    total_orders = db.query(Order).count()
    total_users = db.query(User).count()
    low_stock_products = db.query(Product).filter(Product.stock_quantity < 10).count()

    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_users": total_users,
        "low_stock_products": low_stock_products
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)