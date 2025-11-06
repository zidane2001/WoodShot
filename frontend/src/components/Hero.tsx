import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-base-200 to-base-100">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/photos/imagefond.png"
          alt="Bois de chauffage"
          className="w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-base-100/80 via-base-100/60 to-base-100/80"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-base-content mb-6 leading-tight">
            Bois de Chauffage Premium
            <span className="block text-primary">Livraison Rapide</span>
          </h1>
          <p className="text-xl md:text-2xl text-base-content/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Découvrez notre sélection de bois de chauffage de qualité supérieure, soigneusement séché et prêt à brûler.
            Livraison dans tout le sud de l'Ontario avec service professionnel.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a href="#products" className="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform">
              🛒 Voir nos produits
            </a>
            <Link to="/contact" className="btn btn-outline btn-lg px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform">
              📞 Contactez-nous
            </Link>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-base-100/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-base-content/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">Bois Local</h3>
              <p className="text-sm text-base-content/70 text-center">Source durable et responsable</p>
            </div>
            <div className="bg-base-100/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-base-content/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">Livraison Express</h3>
              <p className="text-sm text-base-content/70 text-center">Service rapide et fiable</p>
            </div>
            <div className="bg-base-100/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-base-content/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">Qualité Garantie</h3>
              <p className="text-sm text-base-content/70 text-center">Satisfaction client 100%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;