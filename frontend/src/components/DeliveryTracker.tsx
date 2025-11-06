import React, { useState, useEffect } from 'react';

interface DeliveryStatus {
  id: string;
  orderId: string;
  status: 'preparing' | 'picked_up' | 'in_transit' | 'delivered';
  estimatedDelivery: string;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  driverInfo?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  trackingHistory: Array<{
    status: string;
    timestamp: string;
    location?: string;
  }>;
}

interface DeliveryTrackerProps {
  trackingNumber: string;
  onClose: () => void;
}

const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({ trackingNumber, onClose }) => {
  const [delivery, setDelivery] = useState<DeliveryStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const mockDelivery: DeliveryStatus = {
      id: '1',
      orderId: 'ORD-2024-001',
      status: 'in_transit',
      estimatedDelivery: '2024-12-15T14:30:00Z',
      currentLocation: {
        lat: 48.8566,
        lng: 2.3522,
        address: 'Paris 15ème, France'
      },
      driverInfo: {
        name: 'Jean Dupont',
        phone: '+33 6 12 34 56 78',
        vehicle: 'Camion Iveco - AB-123-CD'
      },
      trackingHistory: [
        {
          status: 'Commande confirmée',
          timestamp: '2024-12-14T09:00:00Z',
          location: 'Entrepôt WoodShot'
        },
        {
          status: 'Préparation en cours',
          timestamp: '2024-12-14T10:30:00Z',
          location: 'Entrepôt WoodShot'
        },
        {
          status: 'Prêt pour enlèvement',
          timestamp: '2024-12-14T14:00:00Z',
          location: 'Entrepôt WoodShot'
        },
        {
          status: 'Enlevé par le transporteur',
          timestamp: '2024-12-14T15:30:00Z',
          location: 'Entrepôt WoodShot'
        },
        {
          status: 'En transit',
          timestamp: '2024-12-15T08:00:00Z',
          location: 'Autoroute A1, direction Paris'
        }
      ]
    };

    setTimeout(() => {
      setDelivery(mockDelivery);
      setLoading(false);
    }, 1000);
  }, [trackingNumber]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Commande confirmée': 'bg-blue-500',
      'Préparation en cours': 'bg-yellow-500',
      'Prêt pour enlèvement': 'bg-orange-500',
      'Enlevé par le transporteur': 'bg-purple-500',
      'En transit': 'bg-green-500',
      'Livré': 'bg-emerald-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: string } = {
      'Commande confirmée': '📋',
      'Préparation en cours': '📦',
      'Prêt pour enlèvement': '✅',
      'Enlevé par le transporteur': '🚛',
      'En transit': '🚚',
      'Livré': '🏠'
    };
    return icons[status] || '📍';
  };

  if (loading) {
    return (
      <div className="modal modal-open">
        <div className="modal-box">
          <div className="flex justify-center items-center py-8">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <span className="ml-4">Chargement du suivi...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Numéro de suivi introuvable</h3>
          <p className="py-4">Vérifiez votre numéro de suivi et réessayez.</p>
          <div className="modal-action">
            <button className="btn" onClick={onClose}>Fermer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="font-bold text-2xl text-primary mb-6">
          Suivi de livraison
        </h3>

        <div className="space-y-6">
          {/* Status Overview */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">Commande #{delivery.orderId}</h4>
                  <p className="text-sm text-base-content/60">
                    Livraison estimée: {new Date(delivery.estimatedDelivery).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className={`badge badge-lg ${
                  delivery.status === 'delivered' ? 'badge-success' :
                  delivery.status === 'in_transit' ? 'badge-warning' :
                  'badge-info'
                }`}>
                  {delivery.status === 'preparing' ? 'En préparation' :
                   delivery.status === 'picked_up' ? 'Enlevé' :
                   delivery.status === 'in_transit' ? 'En transit' :
                   'Livré'}
                </div>
              </div>

              {/* Driver Info */}
              {delivery.driverInfo && (
                <div className="bg-info/10 p-4 rounded-lg">
                  <h5 className="font-semibold text-info mb-2">Informations transporteur</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Chauffeur:</span>
                      <p>{delivery.driverInfo.name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Téléphone:</span>
                      <p>{delivery.driverInfo.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium">Véhicule:</span>
                      <p>{delivery.driverInfo.vehicle}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Location */}
              {delivery.currentLocation && (
                <div className="bg-success/10 p-4 rounded-lg">
                  <h5 className="font-semibold text-success mb-2">📍 Position actuelle</h5>
                  <p className="text-sm">{delivery.currentLocation.address}</p>
                  <div className="mt-2">
                    <div className="w-full h-32 bg-base-200 rounded-lg flex items-center justify-center">
                      <span className="text-base-content/60">Carte interactive</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h4 className="card-title">Historique du suivi</h4>

              <div className="space-y-4">
                {delivery.trackingHistory.map((event, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{event.status}</h5>
                        <span className="text-sm text-base-content/60">
                          {new Date(event.timestamp).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {event.location && (
                        <p className="text-sm text-base-content/70 mt-1">{event.location}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h5 className="font-bold">Besoin d'aide ?</h5>
              <p>Contactez notre service client au 01 23 45 67 89</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracker;