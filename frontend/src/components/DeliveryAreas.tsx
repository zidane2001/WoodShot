import React from 'react';
import { Link } from 'react-router-dom';

const DeliveryAreas: React.FC = () => {
  const areas = [
    'Toronto', 'Pickering', 'Ajax', 'Whitby', 'Oshawa', 'Port Perry',
    'Uxbridge', 'Stayner', 'Tottenham', 'Washago', 'Barrie', 'Orillia',
    'Newmarket', 'Aurora', 'King City', 'Vaughan', 'Richmond Hill',
    'Markham', 'Scarborough', 'North York', 'Etobicoke', 'Mississauga'
  ];

  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-base-content mb-4">
            Zones de Livraison
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Nous livrons dans tout le sud de l'Ontario. Découvrez si votre région est desservie.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {areas.map((area, index) => (
            <div
              key={area}
              className="bg-base-100 rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow duration-300"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="text-2xl mb-2">📍</div>
              <h3 className="font-semibold text-base-content">{area}</h3>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-base-content/70 mb-4">
            Votre ville n'est pas listée? Contactez-nous pour une livraison personnalisée.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Demander une livraison
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DeliveryAreas;