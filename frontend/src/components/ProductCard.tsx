import React from 'react';

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

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden h-full">
      {/* Stock indicator */}
      {product.stockQuantity < 10 && product.stockQuantity > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <div className="badge badge-warning text-xs font-semibold animate-pulse">
            Stock faible
          </div>
        </div>
      )}

      {/* Out of stock overlay */}
      {product.stockQuantity === 0 && (
        <div className="absolute inset-0 bg-base-content/20 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="bg-error text-error-content px-4 py-2 rounded-full font-semibold text-sm">
            Rupture de stock
          </div>
        </div>
      )}

      <figure className="px-4 pt-4 relative">
        <div className="rounded-xl h-48 w-full bg-base-200 flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const placeholder = parent.querySelector('.placeholder-text') as HTMLElement;
                  if (placeholder) placeholder.style.display = 'block';
                }
              }}
            />
          ) : null}
          <div className="placeholder-text absolute inset-0 flex items-center justify-center text-base-content/60 text-sm font-medium">
            🪵 {product.name}
          </div>
        </div>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-100/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </figure>

      <div className="card-body p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <h2 className="card-title text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300 flex-1">
            {product.name}
          </h2>
          <div className="badge badge-primary badge-sm font-medium ml-2 flex-shrink-0">
            {product.woodType === 'oak' ? '🌳 Chêne' :
             product.woodType === 'beech' ? '🍂 Hêtre' :
             product.woodType === 'birch' ? '🌿 Bouleau' :
             product.woodType === 'pine' ? '🌲 Pin' :
             product.woodType === 'maple' ? '🍁 Érable' :
             product.woodType === 'ash' ? '🌳 Frêne' :
             '� Mixte'}
          </div>
        </div>

        <p className="text-sm text-base-content/70 line-clamp-2 mb-4 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Enhanced specifications */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="badge badge-outline badge-sm hover-lift">
            💧 {product.specifications.humidity}% humidité
          </div>
          <div className="badge badge-outline badge-sm hover-lift">
            🔥 {product.specifications.calorificValue} kWh/kg
          </div>
          <div className="badge badge-outline badge-sm hover-lift capitalize">
            {product.specifications.cuttingType === 'logs' ? '📏 Bûches' :
             product.specifications.cuttingType === 'split' ? '🪵 Fendu' :
             product.specifications.cuttingType === 'pellets' ? '🎯 Granulés' :
             product.specifications.cuttingType}
          </div>
        </div>

        {/* Price and stock info */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <div className="text-2xl font-bold text-primary">
              {product.pricePerUnit.toFixed(2)}€
            </div>
            <div className="text-xs text-base-content/60 uppercase tracking-wide">
              par {product.unit}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${
              product.stockQuantity > 20 ? 'text-success' :
              product.stockQuantity > 0 ? 'text-warning' :
              'text-error'
            }`}>
              {product.stockQuantity > 20 ? '✅ En stock' :
               product.stockQuantity > 0 ? `⚠️ ${product.stockQuantity} restants` :
               '❌ Épuisé'}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="card-actions justify-end gap-2 mt-auto">
          <button
            className="btn btn-outline btn-sm hover-lift flex-1"
            onClick={() => onViewDetails(product)}
          >
            <span className="mr-1">👁️</span>
            Détails
          </button>
          <button
            className="btn btn-primary btn-sm hover-lift flex-1"
            onClick={() => onAddToCart(product)}
            disabled={product.stockQuantity === 0}
          >
            <span className="mr-1">🛒</span>
            {product.stockQuantity === 0 ? 'Indisponible' : 'Ajouter'}
          </button>
        </div>
      </div>

      {/* Subtle border animation */}
      <div className="absolute inset-0 rounded-2xl border-2 border-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ProductCard;