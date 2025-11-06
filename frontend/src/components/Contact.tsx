import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-200 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl text-base-content/70">
              Nous sommes là pour répondre à toutes vos questions sur nos produits
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Informations de contact</h2>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Adresse</h3>
                      <p className="text-base-content/70">15 Rue de la Forêt<br />75001 Paris, France</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Téléphone</h3>
                      <p className="text-base-content/70">+33 1 23 45 67 89</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-base-content/70">contact@woodshot.fr</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Horaires d'ouverture</h3>
                      <p className="text-base-content/70">
                        Lun-Ven: 9h-18h<br />
                        Sam: 9h-17h<br />
                        Dim: Fermé
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Envoyez-nous un message</h2>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Prénom</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Nom</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Téléphone</span>
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Sujet</span>
                    </label>
                    <select className="select select-bordered">
                      <option>Demande d'information</option>
                      <option>Commande personnalisée</option>
                      <option>Livraison</option>
                      <option>Réclamation</option>
                      <option>Autre</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Message</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered"
                      rows={5}
                      placeholder="Votre message..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">
                    Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="card bg-base-100 shadow-xl mt-12">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Notre emplacement</h2>
              <div className="h-96 bg-base-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-base-content/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <p className="text-base-content/60">Carte interactive à venir</p>
                  <p className="text-sm text-base-content/50 mt-2">
                    15 Rue de la Forêt, 75001 Paris, France
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;