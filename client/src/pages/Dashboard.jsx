import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTicketsRequest } from '../api/tickets';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { notifications } = useSocket();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTicketsRequest()
      .then((res) => setTickets(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter(
    (t) => t.status === 'In Progress' || t.status === 'Waiting for Employee'
  ).length;
  const closedCount = tickets.filter(
    (t) => t.status === 'Resolved' || t.status === 'Closed'
  ).length;
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="page">
      <h1>שלום {user.name}</h1>
      {loading ? (
        <p>טוען...</p>
      ) : (
        <div className="stat-cards">
          <div className="stat-card">
            <span className="stat-number">{openCount}</span>
            <span className="stat-label">קריאות פתוחות</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{inProgressCount}</span>
            <span className="stat-label">קריאות בטיפול</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{closedCount}</span>
            <span className="stat-label">קריאות שנסגרו</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{unreadNotifications}</span>
            <span className="stat-label">התראות חדשות</span>
          </div>
        </div>
      )}
      <div className="dashboard-actions">
        <Link to="/tickets" className="button">
          לרשימת הקריאות
        </Link>
        {user.role === 'employee' && (
          <Link to="/tickets/new" className="button primary">
            פתיחת קריאה חדשה
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
