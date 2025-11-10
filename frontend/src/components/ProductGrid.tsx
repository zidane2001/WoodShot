import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
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

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWoodType, setSelectedWoodType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from:', `${import.meta.env.VITE_API_URL}/api/products`);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log('Received data:', data);
          // Transform API response (snake_case) to frontend interface (camelCase)
          const transformedData = data.map((product: any) => ({
            id: product.id.toString(),
            name: product.name,
            description: product.description || '',
            woodType: product.wood_type,
            pricePerUnit: product.price_per_unit,
            unit: product.unit,
            stockQuantity: product.stock_quantity,
            imageUrl: product.image_url || '',
            specifications: product.specifications || {
              humidity: 0,
              density: 0,
              calorificValue: 0,
              cuttingType: 'unknown',
              storageAdvice: '',
              burningTips: []
            }
          }));
          console.log('Transformed data:', transformedData);
          setProducts(transformedData);
        } else {
          console.error('Failed to fetch products:', response.status, response.statusText);
          // Show error state instead of infinite loading
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Show error state instead of infinite loading
        setProducts([]);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  const filteredProducts = products.filter(product =>
    selectedWoodType === 'all' || product.woodType === selectedWoodType
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.pricePerUnit - b.pricePerUnit;
      case 'price-high':
        return b.pricePerUnit - a.pricePerUnit;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const { dispatch } = useCart();

  const handleAddToCart = (product: Product) => {
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
        quantity: 1,
      },
    });
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4 text-base-content/70">Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters Bar */}
      <div className="bg-base-100 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Type de bois</span>
              </label>
              <select
                className="select select-bordered focus-visible"
                value={selectedWoodType}
                onChange={(e) => setSelectedWoodType(e.target.value)}
              >
                <option value="all">🌲 Tous les types</option>
                <option value="oak">🌳 Chêne</option>
                <option value="beech">🍂 Hêtre</option>
                <option value="birch">🌿 Bouleau</option>
                <option value="pine">🌲 Pin</option>
                <option value="maple">🍁 Érable</option>
                <option value="ash">🌳 Frêne</option>
                <option value="mixed">🌲 Mixte</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Trier par</span>
              </label>
              <select
                className="select select-bordered focus-visible"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">📝 Nom (A-Z)</option>
                <option value="price-low">💰 Prix croissant</option>
                <option value="price-high">💰 Prix décroissant</option>
              </select>
            </div>
          </div>

          <div className="text-center md:text-right">
            <div className="text-sm text-base-content/70">
              {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''} trouvé{sortedProducts.length > 1 ? 's' : ''}
            </div>
            <div className="badge badge-primary badge-sm mt-1">
              🔥 Offres spéciales
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="skeleton h-48 w-full rounded-xl mb-4"></div>
                <div className="skeleton h-6 w-3/4 mb-2"></div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-6 animate-bounce">🔍</div>
          <h3 className="text-2xl font-bold mb-4 text-base-content">Aucun produit trouvé</h3>
          <p className="text-lg text-base-content/70 mb-6 max-w-md mx-auto">
            Essayez de modifier vos filtres ou de rechercher un autre type de bois.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              setSelectedWoodType('all');
              setSortBy('name');
            }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedProducts.map((product, index) => (
            <div
              key={product.id}
              className="fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default ProductGrid;