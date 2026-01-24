import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { api } from '../lib/api.js';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal.jsx';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, user: null, type: 'form' });
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.users.list();
      setUsers(data);
    } catch (e) {
      showToast(e.message || 'Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await api.roles.list();
      setRoles(data);
    } catch (e) {
      showToast(e.message || 'Error al cargar roles', 'error');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const openFormModal = (user = null) => {
    if (!user) {
      setModal({
        open: true,
        type: 'form',
        user: {
          name: '',
          email: '',
          password: '',
          roleIds: [],
        },
      });
      return;
    }

    setModal({
      open: true,
      type: 'form',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleIds: user.roles.map((r) => r.role.id),
      },
    });
  };

  const openConfirmModal = (id) => setModal({ open: true, type: 'confirm', user: { id } });

  const closeModal = () => setModal({ open: false, user: null, type: 'form' });

  const handleCreate = async () => {
    try {
      const { name, email, password, roleIds } = modal.user;

      if (!name || !email || !password) {
        showToast('Nombre, email y contraseña son obligatorios', 'error');
        return;
      }

      await api.users.create({
        name,
        email,
        password,
        roles: roleIds,
      });

      showToast('Usuario creado', 'success');
      closeModal();
      fetchUsers();
    } catch (e) {
      showToast(e.message || 'Error al crear usuario', 'error');
    }
  };

  const handleUpdate = async () => {
    try {
      const { id, name, email, roleIds } = modal.user;

      if (!name || !email) {
        showToast('Nombre y email son obligatorios', 'error');
        return;
      }

      await api.users.update(id, {
        name,
        email,
        roles: roleIds,
      });

      showToast('Usuario actualizado', 'success');
      closeModal();
      fetchUsers();
    } catch (e) {
      showToast(e.message || 'Error al actualizar usuario', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.users.remove(modal.user.id);
      showToast('Usuario eliminado', 'success');
      setUsers((prev) => prev.filter((u) => u.id !== modal.user.id));
    } catch (e) {
      showToast(e.message || 'Error al eliminar usuario', 'error');
    } finally {
      closeModal();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Usuarios</h2>
        <button className="btn btn-primary flex items-center gap-2" onClick={() => openFormModal()}>
          <FaPlus /> Crear Usuario
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Cargando usuarios...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Nombre</th>
                <th>Roles</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.name}</td>
                  <td>{u.roles.map((r) => r.role.name).join(', ') || '-'}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm btn-outline btn-primary"
                      onClick={() => openFormModal(u)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-error"
                      onClick={() => openConfirmModal(u.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && modal.type === 'form' && (
        <Modal
          open={modal.open}
          title={modal.user?.id ? 'Editar Usuario' : 'Crear Usuario'}
          onClose={closeModal}
          onSave={modal.user?.id ? handleUpdate : handleCreate}
          saveText={modal.user?.id ? 'Actualizar' : 'Crear'}
        >
          <div className="space-y-4">
            <input
              className="input input-bordered w-full"
              placeholder="Nombre"
              value={modal.user.name}
              onChange={(e) =>
                setModal((p) => ({
                  ...p,
                  user: { ...p.user, name: e.target.value },
                }))
              }
            />

            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="Email"
              value={modal.user.email}
              onChange={(e) =>
                setModal((p) => ({
                  ...p,
                  user: { ...p.user, email: e.target.value },
                }))
              }
            />

            {!modal.user.id && (
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="Contraseña"
                value={modal.user.password}
                onChange={(e) =>
                  setModal((p) => ({
                    ...p,
                    user: { ...p.user, password: e.target.value },
                  }))
                }
              />
            )}

            <select
              className="select select-bordered w-full"
              value={modal.user.roleIds?.[0] || ''}
              onChange={(e) =>
                setModal((p) => ({
                  ...p,
                  user: {
                    ...p.user,
                    roleIds: e.target.value ? [Number(e.target.value)] : [],
                  },
                }))
              }
            >
              <option value="">Selecciona un rol</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </Modal>
      )}

      {modal.open && modal.type === 'confirm' && (
        <Modal
          open={modal.open}
          title="Confirmar eliminación"
          onClose={closeModal}
          onSave={handleDelete}
          saveText="Eliminar"
        >
          ¿Estás seguro que quieres eliminar este usuario?
        </Modal>
      )}
    </div>
  );
}
