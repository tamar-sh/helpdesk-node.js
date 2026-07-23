import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בהרשמה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>הרשמה</h1>
        {error && <div className="error-message">{error}</div>}
        <label>
          שם מלא
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          אימייל
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          סיסמה
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </label>
        <label>
          טלפון
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'נרשמת...' : 'הרשמה'}
        </button>
        <p>
          כבר יש לך חשבון? <Link to="/login">התחברות</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
