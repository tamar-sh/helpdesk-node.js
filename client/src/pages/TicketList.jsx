import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTicketsRequest } from '../api/tickets';

const STATUS_OPTIONS = ['Open', 'In Progress', 'Waiting for Employee', 'Resolved', 'Closed'];

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    getTicketsRequest()
      .then((res) => setTickets(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tickets
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .filter((t) => (statusFilter ? t.status === statusFilter : true))
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'priority') {
        const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return order[a.priority] - order[b.priority];
      }
      return 0;
    });

  return (
    <div className="page">
      <h1>קריאות שירות</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="חיפוש לפי כותרת..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">כל הסטטוסים</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">חדש ביותר</option>
          <option value="oldest">ישן ביותר</option>
          <option value="priority">לפי דחיפות</option>
        </select>
      </div>

      {loading ? (
        <p>טוען...</p>
      ) : filtered.length === 0 ? (
        <p>לא נמצאו קריאות</p>
      ) : (
        <div className="ticket-list">
          {filtered.map((ticket) => (
            <Link to={`/tickets/${ticket._id}`} key={ticket._id} className="ticket-card">
              <div className="ticket-card-header">
                <h3>{ticket.title}</h3>
                <span className={`badge priority-${ticket.priority}`}>{ticket.priority}</span>
              </div>
              <p>{ticket.description}</p>
              <div className="ticket-card-footer">
                <span className={`badge status-${ticket.status.replace(/\s/g, '')}`}>
                  {ticket.status}
                </span>
                <span>{new Date(ticket.createdAt).toLocaleDateString('he-IL')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;
