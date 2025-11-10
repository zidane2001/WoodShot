import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold gradient-text mb-4">
                Conditions Générales de Vente
              </h1>
              <p className="text-base-content/70">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-base-content">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">1. Objet</h2>
                <p>
                  Les présentes conditions générales de vente régissent les relations contractuelles entre WoodShot
                  et ses clients dans le cadre de la vente de bois de chauffage et produits connexes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">2. Produits</h2>
                <p>
                  WoodShot propose une sélection de bois de chauffage de qualité supérieure :
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Bois de chêne, hêtre, bouleau et autres essences nobles</li>
                  <li>Bois sec et prêt à brûler</li>
                  <li>Différents conditionnements : stères, sacs, palettes</li>
                  <li>Certification de qualité et d'origine</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">3. Prix et Paiement</h2>
                <p>
                  Les prix sont indiqués en euros TTC. Le paiement s'effectue :
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Par carte bancaire via notre plateforme sécurisée</li>
                  <li>Par virement bancaire</li>
                  <li>Par cryptomonnaies (Bitcoin, USDT)</li>
                  <li>En espèces lors de la livraison (selon conditions)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">4. Livraison</h2>
                <p>
                  La livraison est assurée dans un rayon de 50km autour de notre dépôt. Les conditions :
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Livraison gratuite dès 100€ d'achat</li>
                  <li>Frais de port : 15€ pour les commandes inférieures à 100€</li>
                  <li>Délais : 2-5 jours ouvrés selon la disponibilité</li>
                  <li>Créneaux horaires : 9h-12h ou 14h-18h</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">5. Droit de Rétractation</h2>
                <p>
                  Conformément à l'article L221-18 du Code de la consommation, le client dispose d'un délai
                  de 14 jours à compter de la réception de la commande pour exercer son droit de rétractation.
                  Les produits doivent être retournés dans leur état d'origine.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">6. Garantie et Service Après-Vente</h2>
                <p>
                  WoodShot garantit la qualité de ses produits. En cas de problème :
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Échange ou remboursement sous 30 jours</li>
                  <li>Support technique disponible 7j/7</li>
                  <li>Conseils d'utilisation fournis</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">7. Responsabilité</h2>
                <p>
                  WoodShot ne peut être tenu responsable des dommages indirects ou imprévisibles.
                  L'utilisation du bois de chauffage doit respecter les normes de sécurité en vigueur.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">8. Protection des Données</h2>
                <p>
                  Les données personnelles sont traitées conformément au RGPD. WoodShot s'engage à :
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Ne pas revendre vos données</li>
                  <li>Assurer la sécurité de vos informations</li>
                  <li>Vous permettre d'exercer vos droits (accès, rectification, suppression)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">9. Litiges</h2>
                <p>
                  Tout litige sera soumis aux tribunaux français compétents.
                  Une médiation préalable sera privilégiée pour résoudre les conflits.
                </p>
              </section>

              <div className="mt-12 p-6 bg-base-200 rounded-lg">
                <p className="text-center text-base-content/70">
                  Pour toute question concernant ces conditions générales de vente,
                  contactez-nous à <a href="mailto:contact@woodshot.fr" className="link link-primary">contact@woodshot.fr</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;