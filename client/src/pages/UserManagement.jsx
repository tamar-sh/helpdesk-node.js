import { useEffect, useState } from 'react';
import { getUsersRequest, createUserRequest, updateUserRequest, deleteUserRequest } from '../api/users';

const emptyForm = { name: '', email: '', password: '', phone: '', role: 'employee' };

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadUsers = () => {
    setLoading(true);
    getUsersRequest()
      .then((res) => setUsers(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(loadUsers, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startEdit = (u) => {
    setEditingId(u._id);
    setForm({ name: u.name, email: u.email, password: '', phone: u.phone, role: u.role });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await updateUserRequest(editingId, payload);
      } else {
        await createUserRequest(form);
      }
      cancelEdit();
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בשמירת המשתמש');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('למחוק את המשתמש?')) return;
    await deleteUserRequest(id);
    loadUsers();
  };

  return (
    <div className="page">
      <h1>ניהול משתמשים</h1>

      <form className="user-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'עריכת משתמש' : 'יצירת משתמש חדש'}</h3>
        {error && <div className="error-message">{error}</div>}
        <label>
          שם
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          אימייל
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          סיסמה {editingId && '(השאירי ריק כדי לא לשנות)'}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required={!editingId}
          />
        </label>
        <label>
          טלפון
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
        </label>
        <label>
          תפקיד
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="employee">employee</option>
            <option value="technician">technician</option>
            <option value="admin">admin</option>
          </select>
        </label>
        <div className="form-actions">
          <button type="submit">{editingId ? 'עדכון' : 'יצירה'}</button>
          {editingId && (
            <button type="button" onClick={cancelEdit}>
              ביטול
            </button>
          )}
        </div>
      </form>

      <h3>רשימת משתמשים</h3>
      {loading ? (
        <p>טוען...</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>שם</th>
              <th>אימייל</th>
              <th>טלפון</th>
              <th>תפקיד</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => startEdit(u)}>עריכה</button>
                  <button onClick={() => handleDelete(u._id)}>מחיקה</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
