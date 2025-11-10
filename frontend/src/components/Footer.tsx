import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-base-300 text-base-content">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-content font-bold text-sm">W</span>
              </div>
              <span className="text-lg font-bold">WoodShot</span>
            </div>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Votre partenaire de confiance pour le bois de chauffage de qualité.
              Depuis 2003, nous vous proposons des produits durables et performants.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-2xl hover:text-primary transition-colors">📘</a>
              <a href="#" className="text-2xl hover:text-primary transition-colors">📷</a>
              <a href="#" className="text-2xl hover:text-primary transition-colors">🐦</a>
              <a href="#" className="text-2xl hover:text-primary transition-colors">💼</a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Nos Services</h3>
            <ul className="space-y-1">
              <li><a href="#" className="text-sm text-base-content/70 hover:text-primary transition-colors">🚚 Livraison à domicile</a></li>
              <li><a href="#" className="text-sm text-base-content/70 hover:text-primary transition-colors">💡 Conseils personnalisés</a></li>
              <li><a href="#" className="text-sm text-base-content/70 hover:text-primary transition-colors">🛠️ Support technique</a></li>
              <li><a href="#" className="text-sm text-base-content/70 hover:text-primary transition-colors">✅ Garantie qualité</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Liens Rapides</h3>
            <ul className="space-y-1">
              <li><Link to="/" className="text-sm text-base-content/70 hover:text-primary transition-colors">🏠 Accueil</Link></li>
              <li><Link to="/about" className="text-sm text-base-content/70 hover:text-primary transition-colors">ℹ️ À propos</Link></li>
              <li><Link to="/contact" className="text-sm text-base-content/70 hover:text-primary transition-colors">📞 Contact</Link></li>
              <li><a href="#" className="text-sm text-base-content/70 hover:text-primary transition-colors">📋 Devis gratuit</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Contact & Newsletter</h3>

            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-primary">📞</span>
                <span className="text-base-content/70">01 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✉️</span>
                <span className="text-base-content/70">contact@woodshot.fr</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">📍</span>
                <span className="text-base-content/70">Lyon, France</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-2">
              <p className="text-sm text-base-content/70">Restez informé</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="input input-bordered input-sm flex-1"
                />
                <button className="btn btn-primary btn-sm">S'abonner</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-base-300">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-base-content/60">
              © 2025 WoodShot. Tous droits réservés.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-base-content/60 hover:text-primary transition-colors">Conditions générales</a>
              <a href="#" className="text-base-content/60 hover:text-primary transition-colors">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;