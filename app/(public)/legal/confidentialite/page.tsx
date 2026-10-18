import React from 'react';

export default function ConfidentialitePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl font-black text-slate-900 mb-6">Politique de Confidentialité & Protection des Données (ARTCI)</h1>
      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-6">
        <section>
          <h2 className="text-base font-bold text-slate-900">1. Principes de Minimisation des Données</h2>
          <p>
            Conformément à la Loi n° 2013-450 relative à la protection des données à caractère personnel en République de Côte d&apos;Ivoire et aux directives de l&apos;ARTCI, SOSGAZ DOMESTIC applique une politique stricte de minimisation.
            Nous ne collectons que les données strictement indispensables à l&apos;exécution matérielle de la livraison :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Prénom ou nom du destinataire.</li>
            <li>Numéro de téléphone pour la confirmation et l&apos;appel du livreur.</li>
            <li>Commune, quartier et repère visuel de livraison.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900">2. Transmission aux Partenaires et Livreurs</h2>
          <p>
            Les livreurs accrédités ne reçoivent que le prénom du client, le repère visuel et le numéro d&apos;appel strictement pour la durée de la course.
            Ils n&apos;ont aucun accès à l&apos;historique complet ou aux données d&apos;autres clients.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900">3. Conservation & Droits</h2>
          <p>
            Chaque commande est sécurisée par un jeton aléatoire unique et non devinable.
            Pour toute demande d&apos;accès, de rectification ou de suppression de vos coordonnées, vous pouvez contacter notre délégué aux données via notre support officiel.
          </p>
        </section>
      </div>
    </div>
  );
}
