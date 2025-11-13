import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  total_products: number;
  total_orders: number;
  total_users: number;
  low_stock_products: number;
}

interface Settings {
  iban?: string;
  [key: string]: any;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [ibanInput, setIbanInput] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
    fetchSettings();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`https://woodshot-backend-um0v.onrender.com/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch(`https://woodshot-backend-um0v.onrender.com/api/admin/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setIbanInput(data.iban || '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const response = await fetch(`https://woodshot-backend-um0v.onrender.com/api/admin/settings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });
      if (response.ok) {
        await fetchSettings(); // Refresh settings
        console.log('Paramètres mis à jour avec succès!');
      } else {
        console.error('Erreur lors de la mise à jour des paramètres:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Response:', errorText);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Erreur lors de la mise à jour des paramètres');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">
          🏢 Tableau de Bord Administrateur
        </h1>
        <p className="text-lg text-base-content/70">
          Gérez votre plateforme e-commerce WoodShot
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title text-lg">Produits</h3>
                <p className="text-3xl font-bold text-primary">{stats?.total_products || 0}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title text-lg">Commandes</h3>
                <p className="text-3xl font-bold text-secondary">{stats?.total_orders || 0}</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title text-lg">Utilisateurs</h3>
                <p className="text-3xl font-bold text-accent">{stats?.total_users || 0}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title text-lg">Stock Faible</h3>
                <p className="text-3xl font-bold text-warning">{stats?.low_stock_products || 0}</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn btn-primary btn-lg">
              <span className="mr-2">➕</span>
              Ajouter Produit
            </button>
            <button className="btn btn-secondary btn-lg">
              <span className="mr-2">📦</span>
              Gérer Stocks
            </button>
            <button className="btn btn-accent btn-lg">
              <span className="mr-2">📋</span>
              Voir Commandes
            </button>
          </div>
        </div>
      </div>

      {/* Settings Management */}
      <div className="card bg-base-100 shadow-xl mt-8">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Paramètres Système</h2>

          {/* IBAN Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Coordonnées Bancaires</h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text">IBAN pour les virements bancaires</span>
              </label>
              <input
                type="text"
                value={ibanInput}
                onChange={(e) => setIbanInput(e.target.value)}
                className="input input-bordered"
                placeholder="FR76 1234 5678 9012 3456 7890 123"
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Cet IBAN sera affiché aux clients pour les paiements par virement bancaire
                </span>
              </label>
            </div>
            <button
              onClick={() => updateSettings({ iban: ibanInput })}
              className="btn btn-primary"
            >
              <span className="mr-2">💾</span>
              Sauvegarder l'IBAN
            </button>
          </div>

          {settings.iban && (
            <div className="mt-4 p-4 bg-base-200 rounded-lg">
              <h4 className="font-semibold mb-2">IBAN Actuel:</h4>
              <p className="font-mono text-lg">{settings.iban}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;