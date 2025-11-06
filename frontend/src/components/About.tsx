import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-200 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-primary mb-6">
              À propos de WoodShot
            </h1>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Depuis plus de 20 ans, nous nous engageons à fournir du bois de chauffage
              de la plus haute qualité, issu de forêts gérées durablement.
            </p>
          </div>

          {/* Story Section */}
          <div className="card bg-base-100 shadow-xl mb-12">
            <div className="card-body">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Notre Histoire</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>
                      Fondée en 2003, WoodShot est née de la passion d'un groupe d'amis
                      pour le bois et la nature. Face à la demande croissante en bois de
                      chauffage de qualité, nous avons décidé de créer une entreprise
                      qui allierait tradition et modernité.
                    </p>
                    <p>
                      Notre approche unique combine le savoir-faire ancestral de la
                      sylviculture française avec les technologies modernes de séchage
                      et de transformation du bois. Chaque stère que nous proposons
                      est le fruit d'un processus rigoureux qui garantit performance
                      et respect de l'environnement.
                    </p>
                    <p>
                      Aujourd'hui, nous sommes fiers de compter parmi nos clients
                      particuliers et professionnels qui nous font confiance pour
                      leur chauffage au bois.
                    </p>
                  </div>
                </div>
                <div className="h-96 bg-base-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-20 h-20 text-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <p className="text-base-content/60">Notre scierie moderne</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Qualité Supérieure</h3>
                <p className="text-base-content/70">
                  Chaque produit est rigoureusement sélectionné et contrôlé pour
                  garantir des performances optimales.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Développement Durable</h3>
                <p className="text-base-content/70">
                  Nos bois proviennent exclusivement de forêts gérées durablement,
                  respectant les normes environnementales.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Performance Énergétique</h3>
                <p className="text-base-content/70">
                  Nos produits offrent un excellent rendement calorifique et
                  une combustion propre et efficace.
                </p>
              </div>
            </div>
          </div>

          {/* Process Section */}
          <div className="card bg-base-100 shadow-xl mb-12">
            <div className="card-body">
              <h2 className="text-3xl font-bold text-center mb-8">Notre Processus</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-content font-bold text-xl">1</span>
                  </div>
                  <h3 className="font-bold mb-2">Sélection</h3>
                  <p className="text-sm text-base-content/70">
                    Choix rigoureux des meilleurs bois dans nos forêts partenaires.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-content font-bold text-xl">2</span>
                  </div>
                  <h3 className="font-bold mb-2">Séchage</h3>
                  <p className="text-sm text-base-content/70">
                    Séchage naturel prolongé pour optimiser les performances.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-content font-bold text-xl">3</span>
                  </div>
                  <h3 className="font-bold mb-2">Transformation</h3>
                  <p className="text-sm text-base-content/70">
                    Fendage et conditionnement selon les normes les plus strictes.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-content font-bold text-xl">4</span>
                  </div>
                  <h3 className="font-bold mb-2">Livraison</h3>
                  <p className="text-sm text-base-content/70">
                    Transport sécurisé directement à votre domicile.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="card bg-primary text-primary-content">
              <div className="card-body text-center">
                <div className="text-3xl font-bold">20+</div>
                <div className="text-sm opacity-90">Années d'expérience</div>
              </div>
            </div>

            <div className="card bg-secondary text-secondary-content">
              <div className="card-body text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm opacity-90">Stères vendus</div>
              </div>
            </div>

            <div className="card bg-accent text-accent-content">
              <div className="card-body text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm opacity-90">Clients satisfaits</div>
              </div>
            </div>

            <div className="card bg-neutral text-neutral-content">
              <div className="card-body text-center">
                <div className="text-3xl font-bold">15</div>
                <div className="text-sm opacity-90">Forêts partenaires</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;