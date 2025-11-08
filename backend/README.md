# WoodShot Backend

A Flask-based backend application for the WoodShot wood sales platform.

## Features

- User authentication and authorization
- Product management with Cloudinary image uploads
- Order processing and management
- Delivery tracking
- Admin dashboard with PIN access
- Neon PostgreSQL database integration

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables in `.env` file:
```
DATABASE_URL=your_neon_database_url
SECRET_KEY=your_secret_key
ADMIN_PIN=1234
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Initialize the database:
```bash
python init_db.py
```

4. Run the application:
```bash
python app.py
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin` - Admin access with PIN

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/<id>` - Update product (admin)
- `DELETE /api/products/<id>` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/<id>` - Get order details

### Delivery
- `GET /api/delivery/<tracking_number>` - Get delivery status

### Users (Admin)
- `GET /api/users` - Get all users (admin)

## Deployment

### Docker
```bash
docker build -t woodshot-backend .
docker run -p 8000:8000 woodshot-backend
```

### Docker Compose
```bash
docker-compose up --build
```

## Database Migrations

To create and run migrations:
```bash
alembic revision --autogenerate -m "Migration message"
alembic upgrade head