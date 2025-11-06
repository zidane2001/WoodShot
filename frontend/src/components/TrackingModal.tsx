import React, { useState } from 'react';
import DeliveryTracker from './DeliveryTracker';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TrackingModal: React.FC<TrackingModalProps> = ({ isOpen, onClose }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showTracker, setShowTracker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setShowTracker(true);
    }
  };

  const handleCloseTracker = () => {
    setShowTracker(false);
    setTrackingNumber('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>

          <h3 className="font-bold text-2xl text-primary mb-6">
            Suivre ma livraison
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Numéro de suivi</span>
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Ex: WS-2024-001234"
                className="input input-bordered"
                required
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Vous trouverez ce numéro dans votre email de confirmation
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Suivre ma commande
            </button>
          </form>

          <div className="divider">OU</div>

          <div className="space-y-4">
            <h4 className="font-semibold">Vous n'avez pas de numéro de suivi ?</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="card-title text-sm">📧 Email de confirmation</h5>
                  <p className="text-xs text-base-content/70">
                    Vérifiez votre boîte mail pour le numéro de suivi
                  </p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="card-title text-sm">📞 Support client</h5>
                  <p className="text-xs text-base-content/70">
                    Appelez-nous au 01 23 45 67 89
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h5 className="font-bold">Conseil</h5>
              <p>Les informations de suivi sont mises à jour en temps réel pendant le transport.</p>
            </div>
          </div>
        </div>
      </div>

      {showTracker && (
        <DeliveryTracker
          trackingNumber={trackingNumber}
          onClose={handleCloseTracker}
        />
      )}
    </>
  );
};

export default TrackingModal;