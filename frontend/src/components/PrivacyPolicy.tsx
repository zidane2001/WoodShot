import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold gradient-text mb-4">
                Politique de Confidentialité
              </h1>
              <p className="text-base-content/70">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-base-content">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">1. Collecte des Données</h2>
                <p>
                  WoodShot collecte uniquement les données nécessaires au traitement de vos commandes :
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Informations de contact (nom, prénom, email, téléphone)</li>
                  <li>Adresse de livraison</li>
                  <li>Historique des commandes</li>
                  <li>Préférences de paiement (sans stockage des données bancaires)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">2. Utilisation des Données</h2>
                <p>
                  Vos données sont utilisées exclusivement pour :
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Traiter et livrer vos commandes</li>
                  <li>Vous contacter concernant votre commande</li>
                  <li>Améliorer nos services</li>
                  <li>Répondre à vos demandes de support</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">3. Protection des Données</h2>
                <p>
                  WoodShot met en œuvre des mesures de sécurité appropriées :
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Chiffrement des données sensibles</li>
                  <li>Accès limité aux données personnelles</li>
                  <li>Sauvegarde régulière des données</li>
                  <li>Conformité RGPD</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">4. Partage des Données</h2>
                <p>
                  WoodShot ne vend ni ne loue vos données personnelles. Nous pouvons partager vos informations uniquement :
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Avec nos prestataires de livraison (uniquement les informations nécessaires)</li>
                  <li>Avec nos partenaires de paiement (conformément aux normes PCI DSS)</li>
                  <li>Lorsque la loi l'exige</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">5. Cookies et Traçage</h2>
                <p>
                  Notre site utilise des cookies essentiels pour :
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Fonctionnement du panier d'achat</li>
                  <li>Mémorisation de vos préférences (thème, langue)</li>
                  <li>Analyse anonyme du trafic (Google Analytics)</li>
                </ul>
                <p className="mt-4">
                  Vous pouvez désactiver les cookies non essentiels dans les paramètres de votre navigateur.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">6. Paiements Cryptomonnaies</h2>
                <p>
                  Pour les paiements en cryptomonnaies :
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Nous utilisons NowPayments comme processeur de paiement</li>
                  <li>Aucune donnée de wallet n'est stockée sur nos serveurs</li>
                  <li>Les transactions sont traitées de manière sécurisée et anonyme</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">7. Vos Droits</h2>
                <p>
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li><strong>Droit d'accès</strong> : Connaître les données que nous détenons</li>
                  <li><strong>Droit de rectification</strong> : Corriger vos données inexactes</li>
                  <li><strong>Droit à l'effacement</strong> : Supprimer vos données</li>
                  <li><strong>Droit à la portabilité</strong> : Récupérer vos données</li>
                  <li><strong>Droit d'opposition</strong> : Refuser certains traitements</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">8. Conservation des Données</h2>
                <p>
                  Nous conservons vos données :
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Données de compte : Pendant la durée de votre relation commerciale</li>
                  <li>Historique des commandes : 10 ans (obligations légales)</li>
                  <li>Données de paiement : Non stockées (conformité PCI DSS)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">9. Sécurité</h2>
                <p>
                  WoodShot utilise des protocoles de sécurité avancés :
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Chiffrement SSL/TLS pour toutes les communications</li>
                  <li>Serveurs sécurisés avec monitoring 24/7</li>
                  <li>Sauvegardes chiffrées et régulières</li>
                  <li>Accès restreint aux données sensibles</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">10. Contact</h2>
                <p>
                  Pour exercer vos droits ou poser des questions sur notre politique de confidentialité :
                </p>
                <div className="mt-4 p-4 bg-base-200 rounded-lg">
                  <p><strong>Email :</strong> privacy@woodshot.fr</p>
                  <p><strong>Adresse :</strong> [Votre adresse]</p>
                  <p><strong>Téléphone :</strong> 01 23 45 67 89</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">11. Modifications</h2>
                <p>
                  Cette politique peut être mise à jour. Les modifications significatives vous seront notifiées
                  par email ou via une notification sur notre site.
                </p>
              </section>

              <div className="mt-12 p-6 bg-base-200 rounded-lg">
                <p className="text-center text-base-content/70">
                  WoodShot s'engage à protéger votre vie privée et à traiter vos données
                  de manière responsable et transparente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;