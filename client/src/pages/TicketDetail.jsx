import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTicketByIdRequest, assignTicketRequest, updateTicketStatusRequest, addAttachmentsRequest } from '../api/tickets';
import { getCommentsRequest, createCommentRequest } from '../api/comments';
import { getUsersRequest } from '../api/users';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { getFileUrl } from '../utils/fileUrl';

const STATUS_OPTIONS = ['Open', 'In Progress', 'Waiting for Employee', 'Resolved', 'Closed'];

const TicketDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { joinTicket, leaveTicket, sendMessage, onNewMessage } = useSocket();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [messageText, setMessageText] = useState('');
  const [newFiles, setNewFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const loadTicket = () => {
    getTicketByIdRequest(id).then((res) => setTicket(res.data.data));
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([getTicketByIdRequest(id), getCommentsRequest(id)])
      .then(([ticketRes, commentsRes]) => {
        setTicket(ticketRes.data.data);
        setComments(commentsRes.data.data);
      })
      .catch((err) => setError(err.response?.data?.message || 'שגיאה בטעינת הקריאה'))
      .finally(() => setLoading(false));

    if (user.role === 'admin') {
      getUsersRequest().then((res) =>
        setTechnicians(res.data.data.filter((u) => u.role === 'technician'))
      );
    }

    joinTicket(id);
    const unsubscribe = onNewMessage((comment) => {
      if (comment.ticket === id) {
        setComments((prev) => [...prev, comment]);
      }
    });

    return () => {
      leaveTicket(id);
      unsubscribe && unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedTechnician) return;
    await assignTicketRequest(id, selectedTechnician);
    loadTicket();
  };

  const handleStatusChange = async (e) => {
    await updateTicketStatusRequest(id, e.target.value);
    loadTicket();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendMessage(id, messageText.trim());
    setMessageText('');
  };

  const handleAddFiles = async (e) => {
    e.preventDefault();
    if (newFiles.length === 0) return;
    const formData = new FormData();
    for (const file of newFiles) {
      formData.append('files', file);
    }
    await addAttachmentsRequest(id, formData);
    setNewFiles([]);
    loadTicket();
  };

  if (loading) return <div className="page">טוען...</div>;
  if (error) return <div className="page error-message">{error}</div>;
  if (!ticket) return null;

  const isMyTicketAsTechnician = user.role === 'technician' && ticket.technician === user.id;

  return (
    <div className="page ticket-detail">
      <div className="ticket-header">
        <h1>{ticket.title}</h1>
        <span className={`badge status-${ticket.status.replace(/\s/g, '')}`}>{ticket.status}</span>
      </div>

      <div className="ticket-info">
        <p>
          <strong>תיאור:</strong> {ticket.description}
        </p>
        <p>
          <strong>קטגוריה:</strong> {ticket.category || '-'}
        </p>
        <p>
          <strong>דחיפות:</strong> <span className={`badge priority-${ticket.priority}`}>{ticket.priority}</span>
        </p>
        <p>
          <strong>נפתחה:</strong> {new Date(ticket.createdAt).toLocaleString('he-IL')}
        </p>
        <p>
          <strong>עודכנה:</strong> {new Date(ticket.updatedAt).toLocaleString('he-IL')}
        </p>
      </div>

      <div className="ticket-attachments">
        <h3>קבצים מצורפים</h3>
        {ticket.attachments.length === 0 ? (
          <p>אין קבצים</p>
        ) : (
          <ul>
            {ticket.attachments.map((path, i) => (
              <li key={i}>
                <a href={getFileUrl(path)} target="_blank" rel="noreferrer">
                  קובץ {i + 1}
                </a>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleAddFiles} className="inline-form">
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={(e) => setNewFiles(Array.from(e.target.files))}
          />
          <button type="submit" disabled={newFiles.length === 0}>
            הוספת קבצים
          </button>
        </form>
      </div>

      {user.role === 'admin' && (
        <div className="ticket-assign">
          <h3>הקצאה לטכנאי</h3>
          {ticket.technician ? (
            <p>מוקצית לטכנאי (ID: {ticket.technician})</p>
          ) : (
            <p>טרם הוקצתה</p>
          )}
          <form onSubmit={handleAssign} className="inline-form">
            <select value={selectedTechnician} onChange={(e) => setSelectedTechnician(e.target.value)}>
              <option value="">בחר טכנאי...</option>
              {technicians.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
            <button type="submit">הקצאה</button>
          </form>
        </div>
      )}

      {isMyTicketAsTechnician && (
        <div className="ticket-status-change">
          <h3>עדכון סטטוס</h3>
          <select value={ticket.status} onChange={handleStatusChange}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="ticket-chat">
        <h3>תגובות / צ'אט</h3>
        <div className="messages-list">
          {comments.map((c) => (
            <div key={c._id} className={`message ${c.user === user.id ? 'own' : ''}`}>
              <p>{c.message}</p>
              <span className="time">{new Date(c.createdAt).toLocaleString('he-IL')}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="inline-form">
          <input
            type="text"
            placeholder="כתבי הודעה..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button type="submit">שליחה</button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetail;
