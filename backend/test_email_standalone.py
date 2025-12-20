#!/usr/bin/env python3
"""
Standalone email test script - doesn't require database connection
"""
import os
from flask import Flask
from flask_mail import Mail, Message
from datetime import datetime

# Create a minimal Flask app for email testing
app = Flask(__name__)

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'colliselect@gmail.com'  # Will be set via environment
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', 'your-app-password')  # Set this
app.config['MAIL_DEFAULT_SENDER'] = 'colliselect@gmail.com'

mail = Mail(app)

def send_order_confirmation_email(order_data, customer_email):
    """Send order confirmation email to customer"""
    with app.app_context():
        try:
            # Create HTML email content
            customer_name = order_data['customer']['firstName']
            order_id = order_data['orderId']
            current_date = datetime.now().strftime('%d/%m/%Y')

            # Build product list HTML
            product_list_html = ""
            for item in order_data['items']:
                product_list_html += f"<p>• {item['product']['name']} - Quantité: {item['quantity']} - {item['totalPrice']}€</p>"

            # Build delivery info
            delivery_html = f"""
            <p>{order_data['delivery']['address']}</p>
            <p>{order_data['delivery']['postalCode']} {order_data['delivery']['city']}</p>
            """

            if order_data['delivery'].get('date'):
                delivery_html += f"<p><strong>Date souhaitée:</strong> {order_data['delivery']['date']}</p>"

            if order_data['delivery'].get('time'):
                delivery_html += f"<p><strong>Créneau:</strong> {order_data['delivery']['time']}</p>"

            # Payment method
            payment_method = 'Virement bancaire' if order_data['paymentMethod'] == 'bank' else 'Cryptomonnaie'
            crypto_info = f"<p><strong>Cryptomonnaie:</strong> {order_data['cryptoCurrency'].upper()}</p>" if order_data.get('cryptoCurrency') else ""

            html_content = f"""
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmation de commande - WoodShot</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }}
                    .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; }}
                    .header {{ background-color: #059669; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 30px; }}
                    .order-details {{ background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }}
                    .footer {{ background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }}
                    .button {{ display: inline-block; background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Commande Confirmée !</h1>
                        <p>Merci pour votre confiance, {customer_name} !</p>
                    </div>

                    <div class="content">
                        <h2>Détails de votre commande</h2>
                        <p><strong>Numéro de commande:</strong> {order_id}</p>
                        <p><strong>Date:</strong> {current_date}</p>

                        <div class="order-details">
                            <h3>📦 Articles commandés</h3>
                            {product_list_html}
                            <hr>
                            <p><strong>Total: {order_data['total']}€</strong></p>
                        </div>

                        <div class="order-details">
                            <h3>🚚 Adresse de livraison</h3>
                            {delivery_html}
                        </div>

                        <div class="order-details">
                            <h3>💳 Informations de paiement</h3>
                            <p><strong>Méthode:</strong> {payment_method}</p>
                            {crypto_info}
                            <p style="color: #dc2626; font-weight: bold;">
                                ⚠️ Important: Veuillez envoyer une capture d'écran de votre paiement au +1 (343) 453-6714
                            </p>
                        </div>

                        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>

                        <a href="http://localhost:5174" class="button">Voir mes commandes</a>
                    </div>

                    <div class="footer">
                        <p>WoodShot SARL - Bois de chauffage premium</p>
                        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                    </div>
                </div>
            </body>
            </html>
            """

            # Create and send email
            msg = Message(
                subject=f"Confirmation de commande #{order_id} - WoodShot",
                recipients=[customer_email],
                html=html_content
            )

            mail.send(msg)

            print(f"✅ Order confirmation email sent to {customer_email} for order {order_id}")
            return True

        except Exception as e:
            print(f"❌ Error sending order confirmation email: {e}")
            return False

def test_email():
    """Test the email functionality"""
    # Sample order data for testing
    sample_order_data = {
        'orderId': 'WS-TEST-001',
        'customer': {
            'firstName': 'Jean',
            'lastName': 'Dupont',
            'email': 'test@example.com'
        },
        'delivery': {
            'address': '123 rue de la Forêt',
            'city': 'Paris',
            'postalCode': '75001',
            'date': '25/12/2025',
            'time': '14-18'
        },
        'items': [
            {
                'product': {'name': 'Bois de Chauffage Chêne'},
                'quantity': 2,
                'totalPrice': 45.00
            },
            {
                'product': {'name': 'Bois de Chauffage Bouleau'},
                'quantity': 1,
                'totalPrice': 22.50
            }
        ],
        'total': 67.50,
        'paymentMethod': 'bank',
        'cryptoCurrency': None
    }

    print("🧪 Testing email functionality...")
    print(f"📧 Sending test email to: zidanetenkeu@gmail.com")
    print(f"📧 From: colliselect@gmail.com")

    success = send_order_confirmation_email(sample_order_data, "zidanetenkeu@gmail.com")

    if success:
        print("✅ Test email sent successfully!")
        print("📬 Check zidanetenkeu@gmail.com for the test email")
    else:
        print("❌ Failed to send test email")
        print("🔧 Make sure MAIL_PASSWORD environment variable is set")

if __name__ == "__main__":
    test_email()