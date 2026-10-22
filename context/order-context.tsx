'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus, UserRole, AuditLog } from '@/types';
import { INITIAL_ORDERS, MOCK_AUDIT_LOGS, MOCK_PARTNERS, MOCK_COURIERS } from '@/data/mock-data';
import { validateStatusTransition } from '@/lib/order-state';
import { getAllOrdersAction, updateOrderStatusAction } from '@/app/actions/orders';

interface OrderContextType {
  orders: Order[];
  auditLogs: AuditLog[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  getOrder: (id: string) => Order | undefined;
  getOrderByToken: (token: string) => Order | undefined;
  createOrder: (orderData: Partial<Order> & { customerName: string; customerPhone: string }) => Order;
  updateOrderStatus: (
    orderId: string,
    targetStatus: OrderStatus,
    reason?: string
  ) => { success: boolean; error?: string };
  assignPartnerAndCourier: (
    orderId: string,
    partnerId: string,
    courierId: string
  ) => { success: boolean; error?: string };
  declareIncident: (orderId: string, reason: string) => { success: boolean; error?: string };
  resolveIncident: (orderId: string, reason: string) => { success: boolean; error?: string };
  cancelOrder: (orderId: string, reason: string) => { success: boolean; error?: string };
  markClientInformed: (orderId: string, channel: 'whatsapp' | 'call') => void;
  resetDemoData: () => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

const STORAGE_KEY = 'sosgaz_orders_v1';
const AUDIT_STORAGE_KEY = 'sosgaz_audit_v1';
const ROLE_STORAGE_KEY = 'sosgaz_role_v1';

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [currentRole, setCurrentRoleState] = useState<UserRole>('admin');
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger depuis le localStorage au montage puis synchroniser avec Supabase
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem(STORAGE_KEY);
      const savedAudit = localStorage.getItem(AUDIT_STORAGE_KEY);
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole;

      queueMicrotask(() => {
        if (savedOrders) {
          try { setOrders(JSON.parse(savedOrders)); } catch {}
        }
        if (savedAudit) {
          try { setAuditLogs(JSON.parse(savedAudit)); } catch {}
        }
        if (savedRole && (savedRole === 'admin' || savedRole === 'operateur')) {
          setCurrentRoleState(savedRole);
        }
        setIsLoaded(true);
      });
    } catch {
      queueMicrotask(() => setIsLoaded(true));
    }

    // Récupérer les données Supabase en arrière-plan
    getAllOrdersAction()
      .then((serverOrders) => {
        if (serverOrders && serverOrders.length > 0) {
          setOrders((prev) => {
            // Fusion intelligente par ID pour ne pas écraser les créations récentes
            const orderMap = new Map<string, Order>();
            serverOrders.forEach((o) => orderMap.set(o.id, o));
            prev.forEach((o) => {
              if (!orderMap.has(o.id)) orderMap.set(o.id, o);
            });
            return Array.from(orderMap.values());
          });
        }
      })
      .catch((err) => console.error('Erreur sync commandes Supabase:', err));
  }, []);

  // Sauvegarder dans le localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(auditLogs));
      localStorage.setItem(ROLE_STORAGE_KEY, currentRole);
    } catch {
      // Ignorer erreur quota
    }
  }, [orders, auditLogs, currentRole, isLoaded]);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
  };

  const getOrder = (id: string) => {
    return orders.find((o) => o.id === id);
  };

  const getOrderByToken = (token: string) => {
    return orders.find((o) => o.publicToken === token);
  };

  const addAuditLog = (action: string, entityType: string, entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      entityType,
      entityId,
      performedBy: currentRole === 'admin' ? 'Administrateur (M. Sylla)' : 'Opérateur (Aline K.)',
      userRole: currentRole,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const createOrder = (orderData: Partial<Order> & { customerName: string; customerPhone: string }): Order => {
    const nextNumber = orders.length + 101;
    const orderId = orderData.id || `SGZ-2026-${String(nextNumber).padStart(6, '0')}`;
    const token = orderData.publicToken || `tok-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;

    const newOrder: Order = {
      id: orderId,
      publicToken: token,
      customer: {
        id: `cust-${Date.now()}`,
        fullName: orderData.customerName,
        phone: orderData.customerPhone,
        commune: orderData.commune || 'Cocody',
        quartier: orderData.quartier || 'Angré',
        address: orderData.addressLandmark || 'Repère fourni',
        landmark: orderData.addressLandmark || 'Non spécifié',
      },
      items: orderData.items || [],
      commune: orderData.commune || 'Cocody',
      quartier: orderData.quartier || 'Angré',
      addressLandmark: orderData.addressLandmark || '',
      deliveryMode: orderData.deliveryMode || 'standard',
      deliveryFee: orderData.deliveryFee || 1000,
      subtotalProducts: orderData.subtotalProducts || 5500,
      totalAmount: orderData.totalAmount || 6500,
      sosgazCommission: orderData.sosgazCommission || 500,
      partnerPayout: orderData.partnerPayout || 5000,
      status: 'NOUVELLE',
      isClientNotifiedWhatsapp: false,
      isClientCalled: false,
      paymentMode: 'especes_livraison',
      paymentStatus: 'en_attente',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          id: `hist-${Date.now()}`,
          orderId,
          fromStatus: 'NOUVELLE',
          toStatus: 'NOUVELLE',
          changedBy: 'Client (Web)',
          authorRole: 'system',
          reason: 'Nouvelle commande enregistrée en ligne',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    addAuditLog('COMMANDE_CREEE', 'orders', orderId, `Nouvelle commande enregistrée par ${orderData.customerName}`);

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    targetStatus: OrderStatus,
    reason?: string
  ): { success: boolean; error?: string } => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Commande introuvable' };

    const validation = validateStatusTransition(
      order.status,
      targetStatus,
      currentRole,
      reason,
      Boolean(order.partnerId && order.courierId)
    );

    if (!validation.isValid) {
      return { success: false, error: validation.errorMessage };
    }

    const now = new Date().toISOString();
    const updatedHistory = [
      ...order.statusHistory,
      {
        id: `hist-${Date.now()}`,
        orderId,
        fromStatus: order.status,
        toStatus: targetStatus,
        changedBy: currentRole === 'admin' ? 'Administrateur (M. Sylla)' : 'Opérateur (Aline K.)',
        authorRole: currentRole,
        reason: reason || `Passage de statut vers ${targetStatus}`,
        timestamp: now,
      },
    ];

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          previousStatus: o.status,
          status: targetStatus,
          updatedAt: now,
          deliveredAt: targetStatus === 'LIVREE' ? now : o.deliveredAt,
          paymentStatus: targetStatus === 'LIVREE' ? 'confirme' : o.paymentStatus,
          cancellationReason: targetStatus === 'ANNULEE' ? reason : o.cancellationReason,
          statusHistory: updatedHistory,
        };
      })
    );

    addAuditLog(
      'STATUT_MODIFIE',
      'orders',
      orderId,
      `Statut passé de ${order.status} à ${targetStatus}${reason ? ` (Motif : ${reason})` : ''}`
    );

    // Synchronisation en arrière-plan avec Supabase
    updateOrderStatusAction({
      orderId,
      newStatus: targetStatus,
      changedBy: currentRole === 'admin' ? 'Administrateur (M. Sylla)' : 'Opérateur (Aline K.)',
      authorRole: currentRole,
      reason,
    }).catch((err) => console.error('Erreur updateOrderStatusAction:', err));

    return { success: true };
  };

  const assignPartnerAndCourier = (
    orderId: string,
    partnerId: string,
    courierId: string
  ): { success: boolean; error?: string } => {
    const partner = MOCK_PARTNERS.find((p) => p.id === partnerId);
    const courier = MOCK_COURIERS.find((c) => c.id === courierId);

    if (!partner || !courier) {
      return { success: false, error: 'Dépôt partenaire ou livreur invalide.' };
    }

    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Commande introuvable.' };

    const now = new Date().toISOString();
    const updatedHistory = [
      ...order.statusHistory,
      {
        id: `hist-${Date.now()}`,
        orderId,
        fromStatus: order.status,
        toStatus: 'LIVREUR_AFFECTE' as OrderStatus,
        changedBy: currentRole === 'admin' ? 'Administrateur (M. Sylla)' : 'Opérateur (Aline K.)',
        authorRole: currentRole,
        reason: `Affectation au dépôt "${partner.name}" et livreur "${courier.fullName}"`,
        timestamp: now,
      },
    ];

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          partnerId: partner.id,
          partnerName: partner.name,
          courierId: courier.id,
          courierName: courier.fullName,
          courierPhone: courier.phone,
          status: 'LIVREUR_AFFECTE',
          updatedAt: now,
          statusHistory: updatedHistory,
        };
      })
    );

    addAuditLog(
      'AFFECTATION_LIVREUR',
      'orders',
      orderId,
      `Assignée au dépôt ${partner.name} et livreur ${courier.fullName}`
    );

    // Synchronisation en arrière-plan avec Supabase
    updateOrderStatusAction({
      orderId,
      newStatus: 'LIVREUR_AFFECTE',
      changedBy: currentRole === 'admin' ? 'Administrateur (M. Sylla)' : 'Opérateur (Aline K.)',
      authorRole: currentRole,
      reason: `Affectation au dépôt "${partner.name}" et livreur "${courier.fullName}"`,
      partnerId: partner.id,
      courierId: courier.id,
    }).catch((err) => console.error('Erreur assignPartnerAndCourier Supabase:', err));

    return { success: true };
  };

  const declareIncident = (orderId: string, reason: string): { success: boolean; error?: string } => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Commande introuvable' };

    if (!reason || reason.trim().length < 5) {
      return { success: false, error: 'Un motif d’incident détaillé est obligatoire.' };
    }

    const now = new Date().toISOString();
    const updatedHistory = [
      ...order.statusHistory,
      {
        id: `hist-${Date.now()}`,
        orderId,
        fromStatus: order.status,
        toStatus: 'INCIDENT' as OrderStatus,
        changedBy: currentRole === 'admin' ? 'Administrateur (M. Sylla)' : 'Opérateur (Aline K.)',
        authorRole: currentRole,
        reason,
        timestamp: now,
      },
    ];

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          previousStatus: o.status,
          status: 'INCIDENT',
          incidentReason: reason,
          updatedAt: now,
          statusHistory: updatedHistory,
        };
      })
    );

    addAuditLog('INCIDENT_DECLARE', 'orders', orderId, `Incident signalé : ${reason}`);
    return { success: true };
  };

  const resolveIncident = (orderId: string, reason: string): { success: boolean; error?: string } => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Commande introuvable' };

    const restoreStatus = order.previousStatus || 'CONFIRMEE';
    const now = new Date().toISOString();

    const updatedHistory = [
      ...order.statusHistory,
      {
        id: `hist-${Date.now()}`,
        orderId,
        fromStatus: 'INCIDENT' as OrderStatus,
        toStatus: restoreStatus,
        changedBy: currentRole === 'admin' ? 'Administrateur (M. Sylla)' : 'Opérateur (Aline K.)',
        authorRole: currentRole,
        reason: `Incident résolu : ${reason}. Retour au statut ${restoreStatus}`,
        timestamp: now,
      },
    ];

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: restoreStatus,
          incidentReason: undefined,
          updatedAt: now,
          statusHistory: updatedHistory,
        };
      })
    );

    addAuditLog('INCIDENT_RESOLU', 'orders', orderId, `Incident levé : ${reason}`);
    return { success: true };
  };

  const cancelOrder = (orderId: string, reason: string): { success: boolean; error?: string } => {
    return updateOrderStatus(orderId, 'ANNULEE', reason);
  };

  const markClientInformed = (orderId: string, channel: 'whatsapp' | 'call') => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          isClientCalled: channel === 'call' ? true : o.isClientCalled,
          isClientNotifiedWhatsapp: channel === 'whatsapp' ? true : o.isClientNotifiedWhatsapp,
        };
      })
    );
    addAuditLog(
      'CONTACT_CLIENT',
      'orders',
      orderId,
      `Client informé par ${channel === 'call' ? 'Appel téléphonique' : 'Message WhatsApp'}`
    );
  };

  const resetDemoData = () => {
    setOrders(INITIAL_ORDERS);
    setAuditLogs(MOCK_AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        auditLogs,
        currentRole,
        setCurrentRole,
        getOrder,
        getOrderByToken,
        createOrder,
        updateOrderStatus,
        assignPartnerAndCourier,
        declareIncident,
        resolveIncident,
        cancelOrder,
        markClientInformed,
        resetDemoData,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
