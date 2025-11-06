import React from 'react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Marie Dubois",
      location: "Toronto",
      rating: 5,
      text: "Excellent service! Le bois est arrivé parfaitement sec et la livraison était ponctuelle. Je recommande vivement WoodShot.",
      avatar: "/photos/photospersonnes/image copy 2.png"
    },
    {
      name: "Pierre Martin",
      location: "Ottawa",
      rating: 5,
      text: "Qualité exceptionnelle du bois de chêne. Le chauffage est efficace et l'odeur est incomparable. Service client au top!",
      avatar: "/photos/photospersonnes/image copy.png"
    },
    {
      name: "Sophie Laurent",
      location: "Montreal",
      rating: 5,
      text: "Depuis 3 ans, je fais confiance à WoodShot pour mon bois de chauffage. Toujours satisfait de la qualité et du prix.",
      avatar: "/photos/photospersonnes/image.png"
    }
  ];

  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-base-content mb-4">
            Avis de nos clients
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Découvrez ce que disent nos clients satisfaits de notre service et de nos produits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="avatar mx-auto mb-2">
                    <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="font-semibold text-base-content">{testimonial.name}</h3>
                  <p className="text-sm text-base-content/60">{testimonial.location}</p>
                </div>

                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>

                <p className="text-base-content/80 italic">
                  "{testimonial.text}"
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-base-content/70 mb-4">
            Rejoignez nos clients satisfaits
          </p>
          <a href="#products" className="btn btn-primary">
            Commander maintenant
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;