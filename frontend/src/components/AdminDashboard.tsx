import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  total_products: number;
  total_orders: number;
  total_users: number;
  low_stock_products: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/dashboard`, {
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
    </div>
  );
};

export default AdminDashboard;