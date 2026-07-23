import { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { markNotificationAsReadRequest } from '../api/notifications';

const NotificationBell = () => {
  const { notifications, markLocalAsRead } = useSocket();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRead = async (notification) => {
    if (notification.isRead) return;
    await markNotificationAsReadRequest(notification._id);
    markLocalAsRead(notification._id);
  };

  return (
    <div className="notification-bell">
      <button className="bell-button" onClick={() => setOpen((o) => !o)}>
        🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>
      {open && (
        <div className="notification-dropdown">
          {notifications.length === 0 && <p className="empty">אין התראות</p>}
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`notification-item ${n.isRead ? '' : 'unread'}`}
              onClick={() => handleRead(n)}
            >
              <p>{n.message}</p>
              <span className="time">{new Date(n.createdAt).toLocaleString('he-IL')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
