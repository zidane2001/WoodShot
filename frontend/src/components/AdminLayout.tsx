import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement.tsx';
import AdminLogin from './AdminLogin.tsx';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'users';

const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const { user, logout, token } = useAuth();

  // Check if token is expired and logout if needed
  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          const response = await fetch(`https://woodshot-backend-um0v.onrender.com/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.status === 401) {
            // Token expired, logout
            logout();
          }
        } catch (error) {
          console.error('Token check failed:', error);
        }
      }
    };

    checkToken();
  }, [token, logout]);

  // If not authenticated as admin, show login
  if (!token || user?.id !== 'admin') {
    return <AdminLogin />;
  }

  const tabs = [
    { id: 'dashboard' as AdminTab, label: 'Tableau de Bord', icon: '🏢' },
    { id: 'products' as AdminTab, label: 'Produits', icon: '📦' },
    { id: 'orders' as AdminTab, label: 'Commandes', icon: '📋' },
    { id: 'users' as AdminTab, label: 'Utilisateurs', icon: '👥' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Admin Header */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <a
                    className={activeTab === tab.id ? 'active' : ''}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <a className="btn btn-ghost normal-case text-xl font-bold">
            🪵 WoodShot Admin
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <a
                  className={activeTab === tab.id ? 'active' : ''}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-semibold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>Connecté en tant que</span>
              </li>
              <li>
                <a className="justify-between">
                  {user?.first_name} {user?.last_name}
                  <span className="badge badge-primary">Admin</span>
                </a>
              </li>
              <li><a>Paramètres</a></li>
              <li>
                <a onClick={logout} className="text-error">
                  Déconnexion
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminLayout;