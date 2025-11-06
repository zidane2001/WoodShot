import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  woodType: string;
  pricePerUnit: number;
  unit: string;
  stockQuantity: number;
  imageUrl: string;
  specifications: {
    humidity: number;
    density: number;
    calorificValue: number;
    cuttingType: string;
    storageAdvice: string;
    burningTips: string[];
  };
}

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { dispatch } = useCart();

  // Mock additional images
  const images = [
    product.imageUrl || '/placeholder-wood.jpg',
    '/wood-detail-1.jpg',
    '/wood-detail-2.jpg',
    '/wood-detail-3.jpg'
  ];

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  const getWoodTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      oak: 'Chêne',
      beech: 'Hêtre',
      birch: 'Bouleau',
      pine: 'Pin',
      mixed: 'Mixte'
    };
    return types[type] || type;
  };

  const getCuttingTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      logs: 'Bûches',
      split: 'Fendu',
      pellets: 'Granulés',
      mixed: 'Mixte'
    };
    return types[type] || type;
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-base-200">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-wood.jpg';
                }}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-base-300'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-wood.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">{product.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <div className="badge badge-primary">{getWoodTypeName(product.woodType)}</div>
                <div className="badge badge-secondary">{getCuttingTypeName(product.specifications.cuttingType)}</div>
                <div className={`badge ${product.stockQuantity > 0 ? 'badge-success' : 'badge-error'}`}>
                  {product.stockQuantity > 0 ? 'En stock' : 'Rupture'}
                </div>
              </div>
              <p className="text-base-content/80">{product.description}</p>
            </div>

            {/* Specifications */}
            <div className="bg-base-200 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Spécifications Techniques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-base-content/60">Humidité</span>
                  <div className="font-medium">{product.specifications.humidity}%</div>
                </div>
                <div>
                  <span className="text-sm text-base-content/60">Densité</span>
                  <div className="font-medium">{product.specifications.density} kg/m³</div>
                </div>
                <div>
                  <span className="text-sm text-base-content/60">Pouvoir calorifique</span>
                  <div className="font-medium">{product.specifications.calorificValue} kWh/kg</div>
                </div>
                <div>
                  <span className="text-sm text-base-content/60">Stock disponible</span>
                  <div className="font-medium">{product.stockQuantity} {product.unit}</div>
                </div>
              </div>
            </div>

            {/* Storage Advice */}
            <div className="bg-info/10 p-4 rounded-lg">
              <h4 className="font-semibold text-info mb-2">💡 Conseils de stockage</h4>
              <p className="text-sm">{product.specifications.storageAdvice}</p>
            </div>

            {/* Burning Tips */}
            <div className="bg-warning/10 p-4 rounded-lg">
              <h4 className="font-semibold text-warning mb-2">🔥 Conseils d'utilisation</h4>
              <ul className="text-sm space-y-1">
                {product.specifications?.burningTips?.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    {tip}
                  </li>
                )) || (
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    Utilisez selon les recommandations du fabricant
                  </li>
                )}
              </ul>
            </div>

            {/* Price and Quantity */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-primary">
                  {(product.pricePerUnit * quantity).toFixed(2)}€
                </div>
                <div className="text-sm text-base-content/60">
                  {product.pricePerUnit}€ / {product.unit}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium">Quantité:</span>
                <div className="join">
                  <button
                    className="btn btn-sm join-item"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <div className="btn btn-sm join-item no-animation cursor-default">
                    {quantity}
                  </div>
                  <button
                    className="btn btn-sm join-item"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockQuantity}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-base-content/60">
                  Max: {product.stockQuantity} {product.unit}
                </span>
              </div>

              <button
                className="btn btn-primary btn-block btn-lg"
                onClick={() => {
                  dispatch({
                    type: 'ADD_ITEM',
                    payload: {
                      product: {
                        id: product.id,
                        name: product.name,
                        pricePerUnit: product.pricePerUnit,
                        unit: product.unit,
                        imageUrl: product.imageUrl,
                      },
                      quantity,
                    },
                  });
                  onClose();
                }}
                disabled={product.stockQuantity === 0}
              >
                {product.stockQuantity === 0 ? 'Rupture de stock' : `Ajouter ${quantity} ${product.unit} au panier`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;