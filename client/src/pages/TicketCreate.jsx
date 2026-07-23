import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicketRequest } from '../api/tickets';

const TicketCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
  });
  const [files, setFiles] = useState([]);
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
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('priority', form.priority);
      for (const file of files) {
        formData.append('files', file);
      }
      const res = await createTicketRequest(formData);
      navigate(`/tickets/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בפתיחת קריאה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>פתיחת קריאה חדשה</h1>
      <form className="ticket-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <label>
          כותרת
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          תיאור התקלה
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            required
          />
        </label>
        <label>
          קטגוריה
          <input type="text" name="category" value={form.category} onChange={handleChange} />
        </label>
        <label>
          רמת דחיפות
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </label>
        <label>
          קבצים מצורפים (אופציונלי - תמונות/PDF)
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'פותחת קריאה...' : 'פתיחת קריאה'}
        </button>
      </form>
    </div>
  );
};

export default TicketCreate;
