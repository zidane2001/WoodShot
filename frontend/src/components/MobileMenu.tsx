import React from 'react';
import { useCart } from '../contexts/CartContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShowCheckout: () => void;
  onShowTracking?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onShowCheckout, onShowTracking }) => {
  const { state } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Enhanced Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Enhanced Menu */}
      <div className="fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-base-100 shadow-2xl transform transition-all duration-300 ease-in-out border-l border-base-300">
        <div className="flex flex-col h-full">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-6 border-b border-base-300 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center hover-lift">
                <span className="text-primary-content font-bold">W</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">WoodShot</h2>
                <p className="text-xs text-base-content/60">Menu mobile</p>
              </div>
            </div>
            <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle hover-lift">
              ✕
            </button>
          </div>

          {/* Enhanced Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-6">
              <ul className="space-y-3">
                <li>
                  <a href="#products" className="btn btn-ghost justify-start w-full hover-lift text-left h-auto py-3" onClick={onClose}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🛒</span>
                      <div>
                        <div className="font-medium">Produits</div>
                        <div className="text-xs opacity-70">Voir le catalogue</div>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#about" className="btn btn-ghost justify-start w-full hover-lift text-left h-auto py-3" onClick={onClose}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">ℹ️</span>
                      <div>
                        <div className="font-medium">À propos</div>
                        <div className="text-xs opacity-70">Notre histoire</div>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#contact" className="btn btn-ghost justify-start w-full hover-lift text-left h-auto py-3" onClick={onClose}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📞</span>
                      <div>
                        <div className="font-medium">Contact</div>
                        <div className="text-xs opacity-70">Nous joindre</div>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <button
                    className="btn btn-ghost justify-start w-full hover-lift text-left h-auto py-3"
                    onClick={() => {
                      onShowTracking?.();
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📦</span>
                      <div>
                        <div className="font-medium">Suivi livraison</div>
                        <div className="text-xs opacity-70">Où est mon colis ?</div>
                      </div>
                    </div>
                  </button>
                </li>
              </ul>
            </nav>

            {/* Enhanced Cart Summary */}
            {state.totalItems > 0 && (
              <div className="p-6 border-t border-base-300 bg-base-200/30">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🛒</span>
                  <h3 className="font-bold text-lg">Panier ({state.totalItems})</h3>
                </div>

                <div className="space-y-3 mb-4 max-h-32 overflow-y-auto">
                  {state.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center bg-base-100 p-3 rounded-lg hover-lift">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <img
                          src={item.product.imageUrl || '/placeholder-wood.jpg'}
                          alt={item.product.name}
                          className="w-8 h-8 rounded object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{item.product.name}</p>
                          <p className="text-xs text-base-content/60">{item.quantity} × {item.product.pricePerUnit.toFixed(2)}€</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary text-sm">{item.totalPrice.toFixed(2)}€</span>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/10 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">{state.totalPrice.toFixed(2)}€</span>
                  </div>
                  {state.totalPrice >= 100 && (
                    <div className="text-xs text-success mt-1">🎉 Livraison offerte !</div>
                  )}
                </div>

                <button
                  className="btn btn-primary btn-block hover-lift"
                  onClick={() => {
                    onShowCheckout();
                    onClose();
                  }}
                >
                  <span className="mr-2">🚀</span>
                  Commander maintenant
                </button>
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className="p-6 border-t border-base-300 bg-gradient-to-r from-base-200/50 to-base-100/50">
            <a href="/admin" className="btn btn-secondary btn-block hover-lift mb-3">
              <span className="mr-2">🔧</span>
              Accès Admin
            </a>

            {/* Quick contact info */}
            <div className="text-center text-xs text-base-content/60">
              <p className="mb-1">Besoin d'aide ?</p>
              <p className="font-medium">📞 01 23 45 67 89</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;