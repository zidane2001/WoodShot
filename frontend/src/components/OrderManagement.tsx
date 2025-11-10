import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  user_id: number;
  user?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchOrders(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'confirmed': return 'badge-info';
      case 'shipped': return 'badge-primary';
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">
          📋 Gestion des Commandes
        </h1>
        <p className="text-lg text-base-content/70">
          Gérez toutes les commandes de votre plateforme
        </p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono">#{order.id}</td>
                    <td>
                      <div>
                        <div className="font-semibold">
                          {order.user?.first_name} {order.user?.last_name}
                        </div>
                        <div className="text-sm text-base-content/60">
                          {order.user?.email}
                        </div>
                      </div>
                    </td>
                    <td className="font-bold text-primary">
                      {order.total_amount.toFixed(2)}€
                    </td>
                    <td>
                      <div className={`badge ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </td>
                    <td>
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td>
                      <div className="dropdown dropdown-left">
                        <label tabIndex={0} className="btn btn-sm btn-outline">
                          Modifier
                        </label>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                          <li><a onClick={() => updateOrderStatus(order.id, 'confirmed')}>Confirmer</a></li>
                          <li><a onClick={() => updateOrderStatus(order.id, 'shipped')}>Expédier</a></li>
                          <li><a onClick={() => updateOrderStatus(order.id, 'delivered')}>Livrer</a></li>
                          <li><a onClick={() => updateOrderStatus(order.id, 'cancelled')} className="text-error">Annuler</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">Aucune commande</h3>
              <p className="text-base-content/60">Les nouvelles commandes apparaîtront ici</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;