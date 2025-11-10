import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin: React.FC = () => {
  const { adminLogin } = useAuth();
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await adminLogin(pin);
      if (!success) {
        setError('PIN incorrect. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card bg-base-100 shadow-xl max-w-md w-full mx-4">
        <div className="card-body">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Accès Administrateur
            </h1>
            <p className="text-base-content/70">
              Entrez le PIN d'accès administrateur
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">PIN Administrateur</span>
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="input input-bordered input-lg text-center text-2xl tracking-widest"
                placeholder="••••"
                maxLength={4}
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={isLoading || pin.length !== 4}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Vérification...
                </>
              ) : (
                'Accéder au panneau admin'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <a href="/" className="link link-primary">
              ← Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;