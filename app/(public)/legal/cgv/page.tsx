import React from 'react';

export default function CGVPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl font-black text-slate-900 mb-6">Conditions Générales de Vente & d&apos;Utilisation</h1>
      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-6">
        <section>
          <h2 className="text-base font-bold text-slate-900">1. Nature du Service SOSGAZ DOMESTIC</h2>
          <p>
            SOSGAZ DOMESTIC est une plateforme numérique d&apos;intermédiation et de logistique urbaine opérant dans le district d&apos;Abidjan.
            La plateforme met en relation des consommateurs particuliers avec des dépôts de gaz de pétrole liquéfié (GPL) agréés par le Ministère des Mines, du Pétrole et de l&apos;Énergie, et des livreurs indépendants accrédités.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900">2. Tarification & Prix Réglementés</h2>
          <p>
            Les prix de recharge des bouteilles de gaz (B6, B12.5, B28) appliqués par nos partenaires respectent scrupuleusement les barèmes officiels plafonnés par le Gouvernement de Côte d&apos;Ivoire.
            Toute commande inclut de façon distincte :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Le prix officiel du gaz (recharge ou consigne incluse).</li>
            <li>Les frais d&apos;acheminement et de livraison calculés selon la commune et l&apos;option de célérité (standard ou express).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900">3. Modalités de Commande et de Paiement</h2>
          <p>
            Les commandes sont passées sans création obligatoire de compte utilisateur.
            Aucune avance financière n&apos;est exigée en ligne au lancement du MVP. Le règlement s&apos;effectue en espèces exclusivement à la remise de la bouteille, après contrôle visuel du scellé d&apos;origine par le client.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900">4. Sécurité GPL & Responsabilité</h2>
          <p>
            Le client s&apos;engage à vérifier lors de la remise que la bouteille dispose d&apos;un bouchon de scellement intact et ne présente aucun dommage extérieur. En cas de doute, la bouteille doit être immédiatement refusée.
            SOSGAZ décline toute responsabilité en cas de raccordement défectueux réalisé avec un tuyau ou un détendeur périmé.
          </p>
        </section>
      </div>
    </div>
  );
}
