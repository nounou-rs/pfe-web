import React, { useState } from 'react';
import { UserPlus, Shield, Mail, Trash2, Edit, Search, UserCheck } from 'lucide-react';

const UsersPage = () => {
  // Liste des utilisateurs (Données simulées)
  const [users] = useState([
    { id: 1, name: "Nourhene Rsaissi", email: "nourhene.rsaissi@wic-sa.com", role: "Super Admin", status: "Actif" },
    { id: 2, name: "Ahmed Ben Salah", email: "ahmed.tech@wic-sa.com", role: "Technicien", status: "Actif" },
    { id: 3, name: "Sami Mansour", email: "sami.m@wic-sa.com", role: "Technicien", status: "Inactif" },
  ]);

  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      
      {/* HEADER PAGE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={32} color="var(--color-primary)" /> Gestion des Utilisateurs
          </h1>
          <p style={{ color: 'var(--color-text-light)' }}>Contrôle des accès et rôles de la plateforme Wicmic</p>
        </div>
        <button className="btn btn-primary" style={{ gap: '8px' }}>
          <UserPlus size={20} /> Ajouter un membre
        </button>
      </div>

      {/* BARRE DE RECHERCHE */}
      <div className="card card-compact" style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: 'white' }}>
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '15px' }}>
          <Search size={18} color="var(--color-text-light)" />
          <input 
            type="text" 
            className="input" 
            placeholder="Rechercher un utilisateur par nom ou email..." 
            style={{ border: 'none', boxShadow: 'none' }}
          />
        </div>
      </div>

      {/* TABLEAU DES UTILISATEURS */}
      <div className="card" style={{ backgroundColor: 'white', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '15px', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>UTILISATEUR</th>
              <th style={{ padding: '15px', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>RÔLE</th>
              <th style={{ padding: '15px', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>STATUT</th>
              <th style={{ padding: '15px', color: 'var(--color-text-light)', fontSize: '0.9rem', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{user.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                    <UserCheck size={16} color="var(--color-primary)" />
                    {user.role}
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <span className={`badge ${user.status === 'Actif' ? 'badge-success' : 'badge-danger'}`}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '15px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" title="Modifier">
                      <Edit size={16} />
                    </button>
                    <button className="btn btn-danger btn-sm" title="Supprimer" style={{ backgroundColor: '#fee2e2', color: 'var(--color-danger)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NOTE DE SÉCURITÉ */}
      <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', border: '1px dashed var(--color-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Shield size={20} color="var(--color-primary)" />
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-primary-dark)' }}>
          <strong>Note de sécurité :</strong> Seuls les Super Admins peuvent modifier les privilèges des techniciens de maintenance.
        </p>
      </div>
    </div>
  );
};

export default UsersPage;