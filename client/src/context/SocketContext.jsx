import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getMyNotificationsRequest } from '../api/notifications';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    getMyNotificationsRequest()
      .then((res) => setNotifications(res.data.data))
      .catch(() => {});

    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
    });
    socketRef.current = socket;

    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const joinTicket = (ticketId) => {
    socketRef.current?.emit('joinTicket', ticketId);
  };

  const leaveTicket = (ticketId) => {
    socketRef.current?.emit('leaveTicket', ticketId);
  };

  const sendMessage = (ticketId, message) => {
    socketRef.current?.emit('sendMessage', { ticketId, message });
  };

  const onNewMessage = (callback) => {
    socketRef.current?.on('newMessage', callback);
    return () => socketRef.current?.off('newMessage', callback);
  };

  const markLocalAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  return (
    <SocketContext.Provider
      value={{ notifications, joinTicket, leaveTicket, sendMessage, onNewMessage, markLocalAsRead }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
