import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Quel type de bois recommandez-vous pour mon chauffage?",
      answer: "Nous recommandons le chêne ou le hêtre pour une combustion optimale. Le chêne offre une chaleur constante et durable, tandis que le hêtre brûle plus rapidement mais avec une chaleur intense."
    },
    {
      question: "Comment stocker mon bois de chauffage?",
      answer: "Stockez votre bois dans un endroit sec et aéré, à l'abri de la pluie et de l'humidité. Élevez-le du sol avec des palettes et couvrez-le d'une bâche respirante. Ne le stockez pas directement sur le sol."
    },
    {
      question: "Quelle est la durée de livraison?",
      answer: "Nous livrons généralement sous 24-48 heures dans notre zone de livraison. Pour les commandes urgentes, contactez-nous directement pour organiser une livraison express."
    },
    {
      question: "Acceptez-vous les paiements en ligne?",
      answer: "Oui, nous acceptons les paiements par carte de crédit, débit, virement bancaire et espèces à la livraison. Tous les paiements sont sécurisés."
    },
    {
      question: "Puis-je annuler ou modifier ma commande?",
      answer: "Vous pouvez modifier ou annuler votre commande jusqu'à 24 heures avant la livraison prévue. Contactez notre service client pour toute modification."
    },
    {
      question: "Offrez-vous une garantie sur vos produits?",
      answer: "Oui, nous garantissons la qualité de notre bois. Si vous n'êtes pas satisfait, contactez-nous dans les 7 jours suivant la livraison pour un remboursement ou un échange."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-base-content mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur nos produits et services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="card bg-base-100 shadow-md mb-4">
              <div className="card-body p-0">
                <button
                  className="w-full text-left p-6 focus:outline-none focus:bg-base-200 transition-colors"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-base-content pr-4">
                      {faq.question}
                    </h3>
                    <svg
                      className={`w-6 h-6 text-primary transform transition-transform ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {openIndex === index && (
                  <div
                    id={`faq-answer-${index}`}
                    className="px-6 pb-6 text-base-content/80"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-base-content/70 mb-4">
            Vous n'avez pas trouvé la réponse à votre question?
          </p>
          <Link to="/contact" className="btn btn-primary">
            Contactez-nous
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQ;