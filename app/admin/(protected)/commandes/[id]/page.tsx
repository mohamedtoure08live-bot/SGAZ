import React, { Suspense } from 'react';
import { OrderDetailClient } from '@/components/admin/order-detail-client';
import { INITIAL_ORDERS } from '@/data/mock-data';

export function generateStaticParams() {
  return INITIAL_ORDERS.map((order) => ({
    id: order.id,
  }));
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 text-xs">
          Chargement du dossier de commande...
        </div>
      }
    >
      <OrderDetailClient id={resolvedParams.id} />
    </Suspense>
  );
}
