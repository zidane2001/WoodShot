import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

const API_BASE_URL = 'https://woodshot-backend-um0v.onrender.com';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryDate: string;
  deliveryTime: string;
  paymentMethod: 'bank' | 'crypto';
  cryptoCurrency: string;
  cryptoWallet: string;
  acceptTerms: boolean;
}

const Checkout: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state, dispatch } = useCart();
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryDate: '',
    deliveryTime: '',
    paymentMethod: 'bank',
    cryptoCurrency: 'bitcoin',
    cryptoWallet: '',
    acceptTerms: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [iban, setIban] = useState<string>('Chargement...');
  const tomorrow = useMemo(() => {
    const now = new Date().getTime();
    return new Date(now + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }, []);

  useEffect(() => {
    const fetchIban = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/settings/iban`);
        const data = await response.json();
        setIban(data.iban);
      } catch (error) {
        console.error('Error fetching IBAN:', error);
        setIban('IBAN non disponible');
      }
    };

    fetchIban();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that cart has items and total is > 0
    if (state.items.length === 0 || totalWithDelivery <= 0) {
      alert('Votre panier est vide ou le montant total est invalide.');
      return;
    }

    setIsProcessing(true);

    try {
      if (formData.paymentMethod === 'bank') {
        // For bank transfers, just redirect to success page - no backend processing needed
        dispatch({ type: 'CLEAR_CART' });
        window.location.href = '/payment/success';
        return;
      }

      // Create payment request data for crypto payments
      const paymentData = {
        amount: totalWithDelivery,
        currency: 'EUR',
        payment_method: formData.paymentMethod,
        crypto_currency: formData.cryptoCurrency,
        order_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        customer_email: formData.email,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        description: `Commande WoodShot - ${state.items.length} article(s) - Total: ${totalWithDelivery.toFixed(2)}€`,
      };

      // Create order data for backend
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        delivery: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          date: formData.deliveryDate,
          time: formData.deliveryTime,
        },
        items: state.items,
        total: totalWithDelivery,
        paymentMethod: formData.paymentMethod,
        cryptoCurrency: formData.cryptoCurrency,
        cryptoWallet: formData.cryptoWallet,
        orderId: paymentData.order_id,
      };

      console.log('Order data:', orderData);
      console.log('Payment data:', paymentData);
      console.log('Cart state:', state);
      console.log('Total with delivery:', totalWithDelivery);
      console.log('Delivery fee:', deliveryFee);

      // Call backend payment API for crypto payments
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.detail || 'Erreur lors de la création du paiement');
      }

      const paymentResponse = await response.json();
      console.log('Payment response:', paymentResponse);

      // Clear cart
      dispatch({ type: 'CLEAR_CART' });

      // For crypto payments, redirect to payment URL
      window.location.href = paymentResponse.payment_url;

    } catch (error) {
      console.error('Payment error:', error);

      let errorMessage = 'Erreur lors du traitement du paiement. ';
      const errorMsg = error instanceof Error ? error.message : String(error);

      if (errorMsg.includes('Failed to fetch') || errorMsg.includes('ERR_INTERNET_DISCONNECTED')) {
        errorMessage += 'Vérifiez que le serveur backend est démarré (port 8000).';
      } else if (errorMsg.includes('CORS')) {
        errorMessage += 'Problème de configuration CORS.';
      } else {
        errorMessage += errorMsg;
      }

      alert(errorMessage);
      setIsProcessing(false);
    }
  };

  const deliveryFee = state.totalPrice > 100 ? 0 : 15;
  const totalWithDelivery = state.totalPrice + deliveryFee;

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-5xl max-h-[95vh] overflow-y-auto overflow-x-hidden">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 hover-lift z-10"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="text-center mb-8">
          <h3 className="font-bold text-3xl gradient-text mb-2">Finaliser la commande</h3>
          <p className="text-base-content/70">Dernière étape avant livraison !</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Order Summary */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl hover-lift sticky top-4">
              <div className="card-body">
                <h4 className="card-title text-xl font-bold mb-6">
                  <span className="mr-2">🛒</span>
                  Votre commande
                </h4>

                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {state.items.map((item, index) => (
                    <div key={item.product.id} className={`flex justify-between items-center p-3 rounded-lg fade-in ${
                      index % 2 === 0 ? 'bg-base-200/50' : 'bg-base-100'
                    }`} style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={item.product.imageUrl || '/placeholder-wood.jpg'}
                            alt={item.product.name}
                            className="w-14 h-14 rounded-lg object-cover hover-lift"
                          />
                          <div className="absolute -top-2 -right-2 bg-primary text-primary-content rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm line-clamp-2">{item.product.name}</p>
                          <p className="text-xs text-base-content/60">
                            {item.product.pricePerUnit.toFixed(2)}€ / {item.product.unit}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-primary">{item.totalPrice.toFixed(2)}€</span>
                    </div>
                  ))}
                </div>

                <div className="divider my-4"></div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Sous-total</span>
                    <span className="font-medium">{state.totalPrice.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Livraison</span>
                    <span className={`font-medium ${deliveryFee === 0 ? 'text-success' : 'text-warning'}`}>
                      {deliveryFee === 0 ? 'Gratuite 🎉' : `${deliveryFee}€`}
                    </span>
                  </div>
                  {deliveryFee === 0 && (
                    <div className="text-xs text-success text-center bg-success/10 p-2 rounded-lg">
                      Livraison offerte dès 100€ d'achat !
                    </div>
                  )}
                  <div className="divider"></div>
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="gradient-text">Total</span>
                    <span className="text-primary">{totalWithDelivery.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="mt-6 pt-4 border-t border-base-300">
                  <div className="flex justify-center gap-4 text-xs text-base-content/60">
                    <div className="flex items-center gap-1">
                      <span className="text-success">🔒</span>
                      <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-primary">🚚</span>
                      <span>Livraison garantie</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="card bg-base-100 shadow-xl hover-lift">
                <div className="card-body">
                  <h4 className="card-title text-xl font-bold mb-6">
                    <span className="mr-2">👤</span>
                    Informations personnelles
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Prénom *</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="input input-bordered input-lg focus-visible"
                        placeholder="Votre prénom"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Nom *</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="input input-bordered input-lg focus-visible"
                        placeholder="Votre nom"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Email *</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input input-bordered input-lg focus-visible"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Téléphone *</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input input-bordered input-lg focus-visible"
                        placeholder="06 12 34 56 78"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="card bg-base-100 shadow-xl hover-lift">
                <div className="card-body">
                  <h4 className="card-title text-xl font-bold mb-6">
                    <span className="mr-2">🚚</span>
                    Adresse de livraison
                  </h4>

                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Adresse *</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="123 rue de la Forêt"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Ville *</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="input input-bordered"
                          required
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Code postal *</span>
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="input input-bordered"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Date de livraison souhaitée</span>
                        </label>
                        <input
                          type="date"
                          name="deliveryDate"
                          value={formData.deliveryDate}
                          onChange={handleInputChange}
                          className="input input-bordered"
                          min={tomorrow}
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Créneau horaire</span>
                        </label>
                        <select
                          name="deliveryTime"
                          value={formData.deliveryTime}
                          onChange={handleInputChange}
                          className="select select-bordered"
                        >
                          <option value="">Choisir un créneau</option>
                          <option value="9-12">9h - 12h</option>
                          <option value="14-18">14h - 18h</option>
                          <option value="18-21">18h - 21h</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="card bg-base-100 shadow-xl hover-lift">
                <div className="card-body">
                  <h4 className="card-title text-xl font-bold mb-6">
                    <span className="mr-2">💳</span>
                    Paiement sécurisé
                  </h4>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Mode de paiement *</span>
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="select select-bordered select-lg focus-visible"
                      required
                    >
                      <option value="bank">🏦 Virement bancaire</option>
                      <option value="crypto">₿ Cryptomonnaie</option>
                    </select>
                  </div>

                  <div className="space-y-4 mt-6">
                    {formData.paymentMethod === 'crypto' && (
                      <div className="bg-base-100 p-4 rounded-lg border border-base-300">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl">₿</span>
                          <span className="font-semibold text-base-content">Paiement en Cryptomonnaie</span>
                        </div>
                        <p className="text-sm text-base-content/70 mb-4">
                          Paiement sécurisé via NowPayments. Accepte Bitcoin (BTC) et Tether (USDT) avec conversion automatique en temps réel.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold">Cryptomonnaie *</span>
                            </label>
                            <select
                              name="cryptoCurrency"
                              value={formData.cryptoCurrency}
                              onChange={handleInputChange}
                              className="select select-bordered focus-visible"
                              required
                            >
                              <option value="bitcoin">₿ Bitcoin (BTC)</option>
                              <option value="usdt">💲 Tether (USDT)</option>
                            </select>
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold">Votre wallet *</span>
                            </label>
                            <input
                              type="text"
                              name="cryptoWallet"
                              value={formData.cryptoWallet}
                              onChange={handleInputChange}
                              className="input input-bordered focus-visible"
                              placeholder="Adresse de votre wallet"
                              required
                            />
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded border">
                          <div className="text-sm">
                            <div className="font-medium text-orange-800 mb-1">Montant à envoyer:</div>
                            <div className="text-lg font-bold text-orange-600">
                              {formData.cryptoCurrency === 'bitcoin' && `₿ ${(totalWithDelivery / 45000).toFixed(6)}`}
                              {formData.cryptoCurrency === 'usdt' && `₮ ${totalWithDelivery.toFixed(2)}`}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Taux de conversion estimé • Mise à jour en temps réel
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.paymentMethod === 'bank' && (
                      <div className="bg-base-100 p-4 rounded-lg border border-base-300">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl">🏦</span>
                          <span className="font-semibold text-base-content">Paiement par virement bancaire</span>
                        </div>
                        <p className="text-sm text-base-content/70 mb-4">
                          Effectuez un virement bancaire vers notre compte IBAN affiché ci-dessous.
                        </p>

                        <div className="bg-base-200 p-4 rounded-lg">
                          <div className="text-center">
                            <div className="font-mono text-lg font-bold text-primary mb-2 break-all">
                              {iban}
                            </div>
                            <div className="text-sm text-base-content/60">
                              Bénéficiaire: WoodShot SARL
                            </div>
                          </div>
                        </div>

                        <div className="alert alert-info mt-4">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>N'oubliez pas d'indiquer votre numéro de commande dans la référence du virement.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3 items-start">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary checkbox-sm mt-1 flex-shrink-0"
                    required
                  />
                  <div className="label-text text-sm leading-relaxed">
                    <div className="sm:hidden">
                      J'accepte les <a href="/terms" className="link link-primary text-sm">conditions générales de vente</a><br />
                      et la <a href="/privacy" className="link link-primary text-sm">politique de confidentialité</a> *
                    </div>
                    <div className="hidden sm:block">
                      J'accepte les <a href="/terms" className="link link-primary text-sm">conditions générales de vente</a> et la <a href="/privacy" className="link link-primary text-sm">politique de confidentialité</a> *
                    </div>
                  </div>
                </label>
              </div>

              {/* Enhanced Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-base-300">
                <button
                  type="button"
                  className="btn btn-outline btn-lg hover-lift flex-1 order-2 sm:order-1"
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  <span className="mr-2">⬅️</span>
                  Retour
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg hover-lift flex-1 order-1 sm:order-2"
                  disabled={isProcessing || !formData.acceptTerms}
                >
                  {isProcessing ? (
                    <>
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      <span className="animate-pulse">Traitement du paiement...</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🔒</span>
                      <span>Payer {totalWithDelivery.toFixed(2)}€ maintenant</span>
                    </>
                  )}
                </button>
              </div>

              {/* Additional info */}
              {!formData.acceptTerms && (
                <div className="alert alert-warning mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Veuillez accepter les conditions générales pour continuer.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;