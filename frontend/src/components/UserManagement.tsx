import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
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
          👥 Gestion des Utilisateurs
        </h1>
        <p className="text-lg text-base-content/70">
          Gérez tous les utilisateurs de votre plateforme
        </p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Statut</th>
                  <th>Date d'inscription</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="font-mono">#{user.id}</td>
                    <td>
                      <div className="font-semibold">
                        {user.first_name} {user.last_name}
                      </div>
                    </td>
                    <td className="font-mono text-sm">
                      {user.email}
                    </td>
                    <td>
                      {user.phone || '-'}
                    </td>
                    <td>
                      <div className={`badge ${user.is_active ? 'badge-success' : 'badge-error'}`}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </div>
                    </td>
                    <td>
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Aucun utilisateur</h3>
              <p className="text-base-content/60">Les nouveaux utilisateurs apparaîtront ici</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;