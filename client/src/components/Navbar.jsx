import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">HelpDesk</Link>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/tickets">קריאות</Link>
        {user.role === 'employee' && <Link to="/tickets/new">קריאה חדשה</Link>}
        {user.role === 'admin' && <Link to="/admin/users">ניהול משתמשים</Link>}
      </div>
      <div className="navbar-user">
        <NotificationBell />
        <span className="user-name">
          {user.name} ({user.role})
        </span>
        <button onClick={handleLogout}>התנתקות</button>
      </div>
    </nav>
  );
};

export default Navbar;
