import React, { useState } from 'react';

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

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [showModal, setShowModal] = useState(false);

  // Images alternatives locales
  const getAdditionalImages = (woodType: string): string[] => {
    const imageSets: { [key: string]: string[] } = {
      oak: ['/photos/boisChauffageChene.png', '/photos/image copy 2.png', '/photos/image copy 5.png'],
      beech: ['/photos/boisChauffageHetre.png', '/photos/image copy 3.png', '/photos/image copy 6.png'],
      birch: ['/photos/boisChauffageBouleau.png', '/photos/image copy 7.png', '/photos/image.png'],
      pine: ['/photos/placeholder-wood.jpg', '/photos/imagefond.png', '/photos/image copy.png'],
      maple: ['/photos/placeholder-wood.jpg', '/photos/image copy 2.png', '/photos/image copy 3.png'],
      ash: ['/photos/placeholder-wood.jpg', '/photos/image copy 5.png', '/photos/image copy 6.png'],
      mixed: ['/photos/image copy 2.png', '/photos/image copy 7.png', '/photos/imagefond.png']
    };

    return imageSets[woodType] || ['/photos/placeholder-wood.jpg', '/photos/image copy 2.png', '/photos/image copy 3.png'];
  };

  const additionalImages = getAdditionalImages(product.woodType);

  return (
    <>
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden h-full border border-base-300">
        {/* Stock indicator */}
        {product.stockQuantity < 10 && product.stockQuantity > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="badge badge-warning text-xs font-semibold">
              Stock faible
            </div>
          </div>
        )}

        {/* Out of stock overlay */}
        {product.stockQuantity === 0 && (
          <div className="absolute inset-0 bg-base-content/10 backdrop-blur-sm z-20 flex items-center justify-center">
            <div className="bg-base-200 text-base-content px-4 py-2 rounded-full font-semibold text-sm">
              Rupture de stock
            </div>
          </div>
        )}

        <figure className="px-4 pt-4 relative">
          <div className="rounded-lg h-48 w-full bg-base-200 flex items-center justify-center overflow-hidden">
            <img
              src={product.imageUrl || '/photos/placeholder.png'}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const fallbacks: { [key: string]: string } = {
                  oak: '/photos/boisChauffageChene.png',
                  beech: '/photos/boisChauffageHetre.png',
                  birch: '/photos/boisChauffageBouleau.png',
                  pine: '/photos/boisChauffagePin.png',
                  maple: '/photos/boisChauffageErable.png',
                  ash: '/photos/boisChauffageFrene.png',
                  mixed: '/photos/melangeBois.png'
                };
                target.src = fallbacks[product.woodType] || '/photos/placeholder.png';
              }}
            />
          </div>
        </figure>

        <div className="card-body p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <h2 className="card-title text-lg font-semibold line-clamp-2 flex-1">
              {product.name}
            </h2>
            <div className="badge badge-primary badge-sm ml-2 flex-shrink-0">
              {product.woodType === 'oak' ? 'Chêne' :
               product.woodType === 'beech' ? 'Hêtre' :
               product.woodType === 'birch' ? 'Bouleau' :
               product.woodType === 'pine' ? 'Pin' :
               product.woodType === 'maple' ? 'Érable' :
               product.woodType === 'ash' ? 'Frêne' :
               'Mixte'}
            </div>
          </div>

          <p className="text-sm text-base-content/70 line-clamp-2 mb-3 flex-1">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xl font-bold text-primary">
                {product.pricePerUnit.toFixed(2)}€
              </div>
              <div className="text-xs text-base-content/60">
                par {product.unit}
              </div>
            </div>
            <div className={`text-xs font-medium px-2 py-1 rounded ${
              product.stockQuantity > 20 ? 'bg-success/10 text-success' :
              product.stockQuantity > 0 ? 'bg-warning/10 text-warning' :
              'bg-error/10 text-error'
            }`}>
              {product.stockQuantity > 20 ? 'En stock' :
               product.stockQuantity > 0 ? `${product.stockQuantity} rest.` :
               'Épuisé'}
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <button
              className="btn btn-outline btn-sm flex-1"
              onClick={() => setShowModal(true)}
            >
              Détails
            </button>
            <button
              className="btn btn-primary btn-sm flex-1"
              onClick={() => onAddToCart(product)}
              disabled={product.stockQuantity === 0}
            >
              {product.stockQuantity === 0 ? 'Indisponible' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>

      {/* MODALE DÉTAILS */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">{product.name}</h3>
                <button
                  className="btn btn-ghost btn-circle"
                  onClick={() => setShowModal(false)}
                >
                  X
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Section */}
                <div className="text-center">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full max-w-72 h-72 object-cover rounded-xl shadow-lg mx-auto mb-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/photos/placeholder.png';
                    }}
                  />
                  <div className="flex justify-center gap-3 flex-wrap">
                    {additionalImages.slice(0, 3).map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Vue ${i + 2}`}
                        className="w-20 h-20 object-cover rounded-lg shadow cursor-pointer hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ))}
                  </div>
                </div>
      
                {/* Details Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-base-content mb-2">{product.name}</h3>
                    <p className="text-base-content/80 text-sm">{product.description}</p>
                  </div>
      
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Type de bois:</span>
                      <span>{product.woodType === 'oak' ? 'Chêne' :
                             product.woodType === 'beech' ? 'Hêtre' :
                             product.woodType === 'birch' ? 'Bouleau' :
                             product.woodType === 'pine' ? 'Pin' :
                             product.woodType === 'maple' ? 'Érable' :
                             product.woodType === 'ash' ? 'Frêne' :
                             'Mixte'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Humidité:</span>
                      <span>{product.specifications.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Pouvoir calorifique:</span>
                      <span>{product.specifications.calorificValue} kWh/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Type de coupe:</span>
                      <span>{product.specifications.cuttingType === 'logs' ? 'Bûches' :
                             product.specifications.cuttingType === 'split' ? 'Fendu' :
                             product.specifications.cuttingType === 'pellets' ? 'Granulés' :
                             product.specifications.cuttingType}</span>
                    </div>
                  </div>
      
                  <div className="border-t pt-4 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {product.pricePerUnit.toFixed(2)}€
                    </div>
                    <div className="text-sm text-base-content/60">
                      par {product.unit}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;