import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="hero min-h-screen relative overflow-hidden" style={{
      backgroundImage: `url('/photos/imagefond.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundBlendMode: 'overlay'
    }}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-base-100/80 to-secondary/30"></div>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="hero-content text-center relative z-10">
        <div className="max-w-4xl fade-in">
          <h1 className="text-6xl md:text-7xl font-bold gradient-text mb-6 leading-tight">
            Bois de Chauffage Premium
          </h1>
          <p className="py-6 text-xl md:text-2xl text-base-content/80 max-w-3xl mx-auto leading-relaxed">
            Découvrez notre sélection de bois de chauffage de qualité supérieure.
            Chêne, hêtre, bouleau et plus encore. Livraison rapide et conseils experts.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button className="btn btn-primary btn-lg hover-lift scale-in px-8 py-4 text-lg font-semibold">
              <span className="mr-2">🛒</span>
              Voir nos produits
            </button>
            <button className="btn btn-outline btn-lg hover-lift scale-in px-8 py-4 text-lg font-semibold">
              <span className="mr-2">📞</span>
              Demander un devis
            </button>
          </div>

          {/* Enhanced stats with animations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="stat glass rounded-xl slide-in-left">
              <div className="stat-figure text-primary">
                <svg className="inline-block w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="stat-title text-base-content/70">Qualité</div>
              <div className="stat-value text-primary text-4xl font-bold">100%</div>
              <div className="stat-desc text-base-content/60">Bois certifié</div>
            </div>

            <div className="stat glass rounded-xl fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="stat-figure text-secondary">
                <svg className="inline-block w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="stat-title text-base-content/70">Livraison</div>
              <div className="stat-value text-secondary text-4xl font-bold">24h</div>
              <div className="stat-desc text-base-content/60">Service express</div>
            </div>

            <div className="stat glass rounded-xl slide-in-right">
              <div className="stat-figure text-accent">
                <svg className="inline-block w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <div className="stat-title text-base-content/70">Satisfaction</div>
              <div className="stat-value text-accent text-4xl font-bold">98%</div>
              <div className="stat-desc text-base-content/60">Clients fidèles</div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-base-content/60">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Livraison garantie</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Support 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default Hero;