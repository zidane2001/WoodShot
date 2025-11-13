import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement.tsx';
import AdminLogin from './AdminLogin.tsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'users';

const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout, token } = useAuth();

  // Check if token is expired and logout if needed
  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.status === 401) {
            logout();
          }
        } catch (error) {
          console.error('Token check failed:', error);
        }
      }
    };

    checkToken();
  }, [token, logout]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-btn')) {
        setIsMobileMenuOpen(false);
      }
      if (!target.closest('.profile-menu') && !target.closest('.profile-menu-btn')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when tab changes
  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // If not authenticated as admin, show login
  if (!token || user?.id !== 'admin') {
    return <AdminLogin />;
  }

  const tabs = [
    { id: 'dashboard' as AdminTab, label: 'Tableau de Bord', icon: '📊', color: 'text-blue-500' },
    { id: 'products' as AdminTab, label: 'Produits', icon: '📦', color: 'text-green-500' },
    { id: 'orders' as AdminTab, label: 'Commandes', icon: '📋', color: 'text-orange-500' },
    { id: 'users' as AdminTab, label: 'Utilisateurs', icon: '👥', color: 'text-purple-500' },
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
      {/* Header avec navigation */}
      <header className="bg-base-100 shadow-lg sticky top-0 z-50">
        <div className="navbar px-4 lg:px-8">
          {/* Mobile menu button */}
          <div className="navbar-start">
            <button
              className="btn btn-ghost btn-circle mobile-menu-btn lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Logo */}
            <a
              className="btn btn-ghost normal-case text-lg lg:text-xl font-bold ml-2 lg:ml-0"
              onClick={() => handleTabChange('dashboard')}
            >
              <span className="text-2xl mr-2">🪵</span>
              <span className="hidden sm:inline">WoodShot</span>
              <span className="badge badge-primary badge-sm ml-2">Admin</span>
            </a>
          </div>

          {/* Desktop navigation */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-1">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    className={`
                      flex items-center gap-2 transition-all
                      ${activeTab === tab.id 
                        ? 'bg-primary text-primary-content font-semibold' 
                        : 'hover:bg-base-200'
                      }
                    `}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    <span className={`text-xl ${tab.color}`}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* User menu */}
          <div className="navbar-end">
            <div className="relative">
              <button
                className="btn btn-ghost btn-circle avatar profile-menu-btn"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                aria-label="Menu utilisateur"
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold text-sm">
                  {user?.first_name?.[0] || 'A'}{user?.last_name?.[0] || 'D'}
                </div>
              </button>

              {/* Profile dropdown */}
              {isProfileMenuOpen && (
                <div className="profile-menu absolute right-0 mt-2 w-64 bg-base-100 rounded-lg shadow-xl border border-base-300 overflow-hidden z-50">
                  <div className="bg-gradient-to-r from-primary to-secondary p-4 text-primary-content">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                        {user?.first_name?.[0] || 'A'}{user?.last_name?.[0] || 'D'}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {user?.first_name || 'Admin'} {user?.last_name || ''}
                        </p>
                        <p className="text-xs opacity-90">{user?.email || 'admin@woodshot.com'}</p>
                      </div>
                    </div>
                  </div>

                  <ul className="menu p-2">
                    <li>
                      <a className="flex items-center gap-2">
                        <span>⚙️</span>
                        <span>Paramètres</span>
                      </a>
                    </li>
                    <li>
                      <a 
                        onClick={() => window.location.href = '/'}
                        className="flex items-center gap-2"
                      >
                        <span>🏠</span>
                        <span>Retour au site</span>
                      </a>
                    </li>
                    <div className="divider my-0"></div>
                    <li>
                      <a
                        onClick={logout}
                        className="text-error flex items-center gap-2 font-semibold"
                      >
                        <span>🚪</span>
                        <span>Déconnexion</span>
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar menu */}
      <div
        className={`
          mobile-menu fixed inset-y-0 left-0 transform 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:hidden w-72 bg-base-100 shadow-2xl transition-transform duration-300 ease-in-out z-40
          flex flex-col
        `}
      >
        {/* Mobile menu header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-content">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🪵</span>
            <div>
              <h2 className="text-xl font-bold">WoodShot Admin</h2>
              <p className="text-sm opacity-90">Panneau d'administration</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {user?.first_name?.[0] || 'A'}{user?.last_name?.[0] || 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-sm">
                {user?.first_name || 'Admin'} {user?.last_name || ''}
              </p>
              <p className="text-xs opacity-75 truncate">{user?.email || 'admin@woodshot.com'}</p>
            </div>
          </div>
        </div>

        {/* Mobile menu items */}
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="menu px-2 gap-1">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`
                    flex items-center gap-3 p-3 rounded-lg transition-all
                    ${activeTab === tab.id
                      ? 'bg-primary text-primary-content font-semibold shadow-md'
                      : 'hover:bg-base-200'
                    }
                  `}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <span className={`text-2xl ${activeTab === tab.id ? '' : tab.color}`}>
                    {tab.icon}
                  </span>
                  <span className="text-base">{tab.label}</span>
                  {activeTab === tab.id && (
                    <span className="ml-auto">✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="divider px-4"></div>

          {/* Additional mobile menu items */}
          <ul className="menu px-2 gap-1">
            <li>
              <a
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-3 p-3"
              >
                <span className="text-2xl">🏠</span>
                <span>Retour au site</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 p-3">
                <span className="text-2xl">⚙️</span>
                <span>Paramètres</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Mobile menu footer */}
        <div className="p-4 border-t border-base-300">
          <button
            onClick={logout}
            className="btn btn-error btn-block gap-2"
          >
            <span>🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Active tab indicator (mobile) */}
      <div className="lg:hidden bg-base-100 px-4 py-3 shadow-sm border-b border-base-300">
        <div className="flex items-center gap-3">
          <span className={`text-2xl ${tabs.find(t => t.id === activeTab)?.color}`}>
            {tabs.find(t => t.id === activeTab)?.icon}
          </span>
          <div>
            <h1 className="font-bold text-lg">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-base-content/60">Gestion et administration</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 lg:py-8">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>

      {/* Bottom navigation for mobile (optional) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 shadow-lg z-20">
        <div className="grid grid-cols-4 gap-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                ${activeTab === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-base-content/60 hover:bg-base-200'
                }
              `}
              onClick={() => handleTabChange(tab.id)}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs font-medium truncate w-full text-center">
                {tab.label.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Add padding to main content for bottom nav */}
      <div className="h-20 lg:hidden"></div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        /* Smooth scroll */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for mobile menu */
        .mobile-menu::-webkit-scrollbar {
          width: 6px;
        }

        .mobile-menu::-webkit-scrollbar-track {
          background: transparent;
        }

        .mobile-menu::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }

        .mobile-menu::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;