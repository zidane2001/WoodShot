import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeSelector from './ThemeSelector';
import { useCart } from '../contexts/CartContext';
import Checkout from './Checkout';
import MobileMenu from './MobileMenu';
import TrackingModal from './TrackingModal';

const Header: React.FC = () => {
  const { state } = useCart();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  return (
    <header className="navbar bg-base-100 shadow-lg sticky top-0 z-20 px-2">
      <div className="navbar-start">
        <div className="dropdown">
          <button onClick={() => setShowMobileMenu(true)} className="btn btn-ghost lg:hidden">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a href="#products">Produits</a></li>
            <li><a href="#about">À propos</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <button
          className="btn btn-ghost text-lg sm:text-xl font-bold"
          onClick={() => navigate('/')}
        >
          <span className="text-primary">Wood</span>Shot
        </button>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><button onClick={() => navigate('/')} className="font-medium">Produits</button></li>
          <li><button onClick={() => navigate('/about')} className="font-medium">À propos</button></li>
          <li><button onClick={() => navigate('/contact')} className="font-medium">Contact</button></li>
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <button className="btn btn-ghost btn-sm hidden sm:flex" onClick={() => navigate('/admin')}>
          Admin
        </button>
        <ThemeSelector />
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
              </svg>
              <span className="badge badge-sm indicator-item bg-primary text-primary-content">{state.totalItems}</span>
            </div>
          </div>
          <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
            <div className="card-body">
              <span className="font-bold text-lg">{state.totalItems} Articles</span>
              <span className="text-info">Sous-total: {state.totalPrice.toFixed(2)}€</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block" onClick={() => setShowCheckout(true)}>
                  Commander
                </button>
              </div>
            </div>
          </div>
        </div>
        <button className="btn btn-outline hidden sm:flex" onClick={() => setShowTrackingModal(true)}>
          📦 Suivi
        </button>
        <button className="btn btn-outline sm:hidden" onClick={() => setShowTrackingModal(true)}>
          📦
        </button>
      </div>

      {showCheckout && <Checkout onClose={() => setShowCheckout(false)} />}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        onShowCheckout={() => setShowCheckout(true)}
        onShowTracking={() => setShowTrackingModal(true)}
      />
      <TrackingModal
        isOpen={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
      />
    </header>
  );
};

export default Header;