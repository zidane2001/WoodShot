import React, { useEffect, useState } from 'react';

const PaymentSuccess: React.FC = () => {
  const [iban, setIban] = useState<string>('');
  const [paymentResponse, setPaymentResponse] = useState<any>(null);

  useEffect(() => {
    // Get payment response from localStorage
    const storedResponse = localStorage.getItem('paymentResponse');
    if (storedResponse) {
      setPaymentResponse(JSON.parse(storedResponse));
      localStorage.removeItem('paymentResponse'); // Clean up
    }

    const fetchIban = async () => {
      try {
        const response = await fetch('/api/settings/iban');
        const data = await response.json();
        setIban(data.iban);
      } catch (error) {
        console.error('Error fetching IBAN:', error);
        setIban('IBAN non disponible');
      }
    };

    fetchIban();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">✅</div>
                <h1 className="text-3xl font-bold text-success mb-2">
                  Commande Confirmée !
                </h1>
                <p className="text-lg text-base-content/70">
                  Votre commande a été enregistrée avec succès.
                </p>
              </div>

              <div className="space-y-6">
                {paymentResponse?.payment_method === 'crypto' ? (
                  <div className="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <h3 className="font-bold">Paiement en Cryptomonnaie</h3>
                      <p className="text-sm">Veuillez envoyer le paiement vers l'adresse ci-dessous.</p>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <h3 className="font-bold">Paiement par Virement Bancaire</h3>
                      <p className="text-sm">Veuillez effectuer un virement bancaire vers le compte ci-dessous.</p>
                    </div>
                  </div>
                )}

                <div className="bg-base-200 p-6 rounded-lg space-y-4">
                  <h2 className="text-xl font-bold text-center mb-4">📋 Informations de Paiement</h2>

                  {paymentResponse?.payment_method === 'crypto' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="label">
                          <span className="label-text font-semibold">Cryptomonnaie</span>
                        </label>
                        <div className="font-semibold text-lg">
                          {paymentResponse.crypto_currency?.toUpperCase()}
                        </div>
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text font-semibold">Adresse de Dépôt</span>
                        </label>
                        <div className="font-mono bg-base-100 p-3 rounded border text-lg break-all">
                          {paymentResponse.crypto_address}
                        </div>
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text font-semibold">Montant à Envoyer</span>
                        </label>
                        <div className="font-semibold text-lg">
                          {paymentResponse.amount}€
                        </div>
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text font-semibold">Instructions</span>
                        </label>
                        <div className="text-sm bg-base-100 p-3 rounded border">
                          {paymentResponse.instructions}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="label">
                          <span className="label-text font-semibold">IBAN</span>
                        </label>
                        <div className="font-mono bg-base-100 p-3 rounded border text-lg break-all">
                          {paymentResponse?.iban || iban}
                        </div>
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text font-semibold">Bénéficiaire</span>
                        </label>
                        <div className="font-semibold text-lg">
                          WoodShot SARL
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <div>
                      <div className="font-bold">Important !</div>
                      <div className="text-sm">
                        {paymentResponse?.payment_method === 'crypto'
                          ? "Le traitement de votre commande commencera dès réception de la confirmation de transaction sur la blockchain."
                          : "N'oubliez pas d'indiquer la référence de votre commande dans la description du virement. Le traitement de votre commande commencera dès réception du paiement."
                        }
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <div>
                      <div className="font-bold">Confirmation de Paiement</div>
                      <div className="text-sm">
                        Veuillez envoyer une capture d'écran de votre paiement au numéro suivant :
                        <div className="font-mono font-bold text-lg mt-1">
                          +1 (343) 453-6714
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.print()}
                    className="btn btn-outline btn-primary"
                  >
                    <span className="mr-2">🖨️</span>
                    Imprimer les instructions
                  </button>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="btn btn-primary"
                  >
                    <span className="mr-2">🏠</span>
                    Retour à l'accueil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;