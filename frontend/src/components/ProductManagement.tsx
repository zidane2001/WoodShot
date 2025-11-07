import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: number;
  name: string;
  description: string;
  wood_type: string;
  price_per_unit: number;
  unit: string;
  stock_quantity: number;
  image_url?: string;
  specifications: any;
  is_available: boolean;
  created_at: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { token } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products:', response.status);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
        alert('Produit supprimé avec succès');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleUpdateStock = async (productId: number, newStock: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/inventory/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newStock }),
      });

      if (response.ok) {
        setProducts(products.map(p =>
          p.id === productId ? { ...p, stock_quantity: newStock } : p
        ));
        alert('Stock mis à jour');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Erreur lors de la mise à jour du stock');
    }
  };

  const getWoodTypeIcon = (woodType: string) => {
    const icons = {
      oak: '🌳',
      beech: '🍂',
      birch: '🌿',
      pine: '🌲',
      maple: '🍁',
      ash: '🌳',
      mixed: '🌲'
    };
    return icons[woodType as keyof typeof icons] || '🌲';
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: 'Rupture', color: 'badge-error', bg: 'bg-red-50 border-red-200' };
    if (quantity < 10) return { text: 'Stock bas', color: 'badge-warning', bg: 'bg-orange-50 border-orange-200' };
    if (quantity < 50) return { text: 'Stock moyen', color: 'badge-info', bg: 'bg-blue-50 border-blue-200' };
    return { text: 'En stock', color: 'badge-success', bg: 'bg-green-50 border-green-200' };
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
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-primary mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            📦 Gestion des Produits
          </h1>
          <p className="text-lg text-base-content/70">
            Gérez votre catalogue de bois de chauffage
          </p>
        </div>

        <div className="flex gap-3 items-center">
          {/* View Mode Toggle */}
          <div className="btn-group">
            <button
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('grid')}
            >
              🏠 Grille
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('list')}
            >
              📋 Liste
            </button>
          </div>

          <button
            className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setShowForm(true)}
          >
            <span className="mr-2">➕</span>
            Nouveau Produit
          </button>
        </div>
      </div>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpdateStock={handleUpdateStock}
              getWoodTypeIcon={getWoodTypeIcon}
              getStockStatus={getStockStatus}
            />
          ))}
        </div>
      ) : (
        <ProductsTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdateStock={handleUpdateStock}
          getWoodTypeIcon={getWoodTypeIcon}
          getStockStatus={getStockStatus}
        />
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-2xl mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {editingProduct ? '✏️ Modifier le Produit' : '➕ Nouveau Produit'}
            </h3>

            <ProductForm
              product={editingProduct}
              onSave={(updatedProduct) => {
                if (editingProduct) {
                  setProducts(products.map(p =>
                    p.id === editingProduct.id ? updatedProduct : p
                  ));
                } else {
                  setProducts([...products, updatedProduct]);
                }
                setShowForm(false);
                setEditingProduct(null);
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Product Card Component
interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onUpdateStock: (id: number, stock: number) => void;
  getWoodTypeIcon: (type: string) => string;
  getStockStatus: (quantity: number) => { text: string; color: string; bg: string };
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onUpdateStock,
  getWoodTypeIcon,
  getStockStatus
}) => {
  const [localStock, setLocalStock] = useState(product.stock_quantity);
  const stockStatus = getStockStatus(product.stock_quantity);

  return (
    <div className={`card shadow-xl hover:shadow-2xl transition-all duration-300 border-2 ${stockStatus.bg} hover:scale-105`}>
      {/* Product Image */}
      <figure className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-6xl">
            {getWoodTypeIcon(product.wood_type)}
            <span className="text-sm mt-2 text-base-content/60">Aucune image</span>
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <div className={`badge badge-lg ${product.is_available ? 'badge-success' : 'badge-error'} gap-1`}>
            {product.is_available ? '✅ Disponible' : '❌ Indisponible'}
          </div>
        </div>

        {/* Wood Type Badge */}
        <div className="absolute top-3 left-3">
          <div className="badge badge-lg badge-primary gap-1">
            {getWoodTypeIcon(product.wood_type)}
            {product.wood_type === 'oak' ? 'Chêne' :
              product.wood_type === 'beech' ? 'Hêtre' :
                product.wood_type === 'birch' ? 'Bouleau' :
                  product.wood_type === 'pine' ? 'Pin' : 'Mixte'}
          </div>
        </div>
      </figure>

      {/* Card Body */}
      <div className="card-body p-6">
        {/* Product Name and Price */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="card-title text-xl font-bold text-base-content">
            {product.name}
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {product.price_per_unit}€
            </div>
            <div className="text-sm text-base-content/60">
              par {product.unit}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-base-content/70 line-clamp-2 mb-4">
          {product.description || 'Aucune description disponible'}
        </p>

        {/* Stock Management */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Stock actuel:</span>
            <div className={`badge ${stockStatus.color} badge-lg`}>
              {stockStatus.text}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Quantité:</span>
            <input
              type="number"
              className="input input-bordered input-sm w-20 text-center"
              value={localStock}
              onChange={(e) => setLocalStock(parseInt(e.target.value) || 0)}
              onBlur={() => {
                if (localStock !== product.stock_quantity) {
                  onUpdateStock(product.id, localStock);
                }
              }}
              min="0"
            />
            <span className="text-sm text-base-content/60">unités</span>
          </div>

          {/* Stock Progress Bar */}
          <div className="w-full bg-base-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${product.stock_quantity === 0 ? 'bg-red-500' :
                  product.stock_quantity < 10 ? 'bg-orange-500' :
                    product.stock_quantity < 50 ? 'bg-blue-500' : 'bg-green-500'
                }`}
              style={{
                width: `${Math.min((product.stock_quantity / 100) * 100, 100)}%`
              }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-200">
          <div className="text-xs text-base-content/50">
            Créé le {new Date(product.created_at).toLocaleDateString('fr-FR')}
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-outline btn-primary hover:scale-110 transition-transform"
              onClick={() => onEdit(product)}
            >
              ✏️ Modifier
            </button>
            <button
              className="btn btn-sm btn-error hover:scale-110 transition-transform"
              onClick={() => onDelete(product.id)}
            >
              🗑️ Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Table View Component (pour la vue liste)
interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onUpdateStock: (id: number, stock: number) => void;
  getWoodTypeIcon: (type: string) => string;
  getStockStatus: (quantity: number) => { text: string; color: string; bg: string };
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onEdit,
  onDelete,
  onUpdateStock,
  getWoodTypeIcon,
  getStockStatus
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-0">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="text-lg font-bold">Produit</th>
                <th className="text-lg font-bold">Type</th>
                <th className="text-lg font-bold">Prix</th>
                <th className="text-lg font-bold">Stock</th>
                <th className="text-lg font-bold">Statut</th>
                <th className="text-lg font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const stockStatus = getStockStatus(product.stock_quantity);
                return (
                  <tr key={product.id} className="hover:bg-base-200 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="rounded-lg" />
                            ) : (
                              <span className="text-xl">{getWoodTypeIcon(product.wood_type)}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{product.name}</div>
                          <div className="text-sm text-base-content/60 line-clamp-1">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="badge badge-lg badge-outline gap-1">
                        {getWoodTypeIcon(product.wood_type)}
                        {product.wood_type}
                      </div>
                    </td>
                    <td className="text-lg font-bold text-primary">
                      {product.price_per_unit}€
                      <div className="text-sm font-normal text-base-content/60">
                        /{product.unit}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="input input-bordered input-sm w-20 text-center font-mono"
                          value={product.stock_quantity}
                          onChange={(e) => {
                            const newStock = parseInt(e.target.value) || 0;
                            onUpdateStock(product.id, newStock);
                          }}
                        />
                        <div className={`badge ${stockStatus.color}`}>
                          {stockStatus.text}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`badge badge-lg ${product.is_available ? 'badge-success' : 'badge-error'}`}>
                        {product.is_available ? '✅' : '❌'}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          className="btn btn-sm btn-outline btn-primary hover:scale-110 transition-transform"
                          onClick={() => onEdit(product)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-sm btn-error hover:scale-110 transition-transform"
                          onClick={() => onDelete(product.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Product Form Component (identique à votre version originale)
interface ProductFormProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    wood_type: product?.wood_type || 'oak',
    price_per_unit: product?.price_per_unit || 0,
    unit: product?.unit || 'stère',
    stock_quantity: product?.stock_quantity || 0,
    image_url: product?.image_url || '',
    specifications: product?.specifications || {
      humidity: 18,
      density: 720,
      calorific_value: 4.2,
      cutting_type: 'logs',
      storage_advice: 'Stockez à l\'abri',
      burning_tips: ['Allumez avec du petit bois']
    },
    is_available: product?.is_available ?? true,
  });

  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = product ? `${import.meta.env.VITE_API_URL}/api/admin/products/${product.id}` : `${import.meta.env.VITE_API_URL}/api/products`;
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedProduct = await response.json();
        onSave(savedProduct);
        alert(product ? 'Produit mis à jour' : 'Produit créé');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Nom du produit</span>
          </label>
          <input
            type="text"
            className="input input-bordered input-lg"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Type de bois</span>
          </label>
          <select
            className="select select-bordered select-lg"
            value={formData.wood_type}
            onChange={(e) => setFormData({ ...formData, wood_type: e.target.value })}
          >
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
            <span className="label-text font-semibold">Prix par unité</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              className="input input-bordered input-lg w-full pl-8"
              value={formData.price_per_unit}
              onChange={(e) => setFormData({ ...formData, price_per_unit: parseFloat(e.target.value) })}
              required
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60">€</span>
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Unité</span>
          </label>
          <select
            className="select select-bordered select-lg"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          >
            <option value="stère">Stère</option>
            <option value="kg">Kilogramme</option>
            <option value="palette">Palette</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Stock initial</span>
          </label>
          <input
            type="number"
            className="input input-bordered input-lg"
            value={formData.stock_quantity}
            onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Image du produit</span>
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered file-input-primary file-input-lg"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Upload image to backend
                  const formDataUpload = new FormData();
                  formDataUpload.append('file', file);

                  try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/upload-image`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                      body: formDataUpload,
                    });

                    if (response.ok) {
                      const data = await response.json();
                      setFormData({ ...formData, image_url: data.image_url });
                    } else {
                      alert('Erreur lors du téléversement de l\'image');
                    }
                  } catch (error) {
                    console.error('Upload error:', error);
                    alert('Erreur lors du téléversement');
                  }
                }
              }}
            />
            {formData.image_url && (
              <div className="avatar">
                <div className="w-20 h-20 rounded-lg ring-2 ring-primary ring-offset-2">
                  <img src={formData.image_url} alt="Preview" className="rounded-lg" />
                </div>
              </div>
            )}
          </div>
          <div className="text-sm text-base-content/60 mt-2">
            Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
          </div>
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Description</span>
        </label>
        <textarea
          className="textarea textarea-bordered textarea-lg"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Décrivez votre produit..."
        />
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text font-semibold">Disponible à la vente</span>
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-lg"
            checked={formData.is_available}
            onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
          />
        </label>
      </div>

      <div className="modal-action">
        <button type="button" className="btn btn-lg" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className="btn btn-primary btn-lg">
          {product ? '💾 Mettre à jour' : '✨ Créer le produit'}
        </button>
      </div>
    </form>
  );
};

export default ProductManagement;