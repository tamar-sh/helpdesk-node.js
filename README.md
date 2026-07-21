# HelpDesk System — Server

מערכת Help Desk לניהול קריאות שירות — פרויקט גמר בקורס Node.js.

מערכת REST API מלאה המאפשרת לעובדים לפתוח קריאות שירות, לטכנאים לטפל בהן ולמנהלי מערכת לנהל את כל התהליך, כולל התראות וצ'אט בזמן אמת.

## טכנולוגיות

- Node.js + Express
- MongoDB + Mongoose
- JWT (אימות)
- bcryptjs (הצפנת סיסמאות)
- Multer (העלאת קבצים)
- Socket.IO (התראות וצ'אט בזמן אמת)
- dotenv

## ארכיטקטורה

הפרויקט מחולק לשכבות:

```
server.js            נקודת הכניסה - הרכבת האפליקציה
socket.js             לוגיקת Socket.IO (התראות, צ'אט)
Data/
  mongoConnect.js      חיבור ל-MongoDB
  models/               סכימות Mongoose
  crud/                 שכבת גישה גולמית ל-DB (ללא לוגיקה עסקית)
Services/              לוגיקה עסקית וכללי הרשאות
Controllers/            תרגום בין HTTP ל-Services
Routes/                 הגדרת נתיבי ה-API
Middleware/             Authentication, Authorization, Error handler, Upload
uploads/                קבצים שהועלו (תמונות/PDF)
```

## התקנה והרצה

1. **שכפול הפרויקט**
   ```
   git clone <repo-url>
   cd <project-folder>
   ```

2. **התקנת תלויות**
   ```
   npm install
   ```

3. **הגדרת משתני סביבה** — יצירת קובץ `.env` בשורש הפרויקט (על בסיס `example.env`):
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/helpdesk
   JWT_SECRET=<מחרוזת סודית ארוכה משלך>
   ```

4. **ודאו ש-MongoDB רץ** (מקומי או Atlas), בהתאם ל-`MONGO_URI` שהגדרתם.

5. **הרצת השרת**
   ```
   npm start
   ```
   השרת יעלה בכתובת `http://localhost:3000` (או הפורט שהוגדר ב-`.env`).

## יצירת משתמש Admin ראשון

הרשמה ציבורית (`POST /api/auth/register`) יוצרת תמיד משתמש בתפקיד `employee` בלבד (מטעמי אבטחה). כדי ליצור admin ראשון במערכת חדשה, יש לערוך ידנית את שדה ה-`role` של משתמש קיים ל-`"admin"` ישירות במסד הנתונים (למשל דרך MongoDB Compass). לאחר מכן, אותו admin יכול ליצור משתמשי admin/technician נוספים דרך `POST /api/users`.

## סקירת ה-API

כל הבקשות המוגנות דורשות header: `Authorization: Bearer <token>`.
כל תשובות השגיאה חוזרות בפורמט אחיד: `{ "success": false, "message": "..." }`.

### Auth — `/api/auth`
| Method | Path | הרשאה | תיאור |
|---|---|---|---|
| POST | `/register` | פתוח | הרשמת עובד חדש |
| POST | `/login` | פתוח | התחברות, מחזיר JWT |

### Tickets — `/api/tickets`
| Method | Path | הרשאה | תיאור |
|---|---|---|---|
| POST | `/` | employee | פתיחת קריאה (form-data, כולל קבצים אופציונליים בשדה `files`) |
| GET | `/` | מחובר | רשימת קריאות (מסונן לפי role) |
| GET | `/:id` | מחובר + גישה | פרטי קריאה בודדת |
| PATCH | `/:id/assign` | admin | הקצאת קריאה לטכנאי |
| PATCH | `/:id/status` | technician | עדכון סטטוס קריאה |
| POST | `/:id/attachments` | מחובר + גישה | הוספת קבצים לקריאה קיימת |

### Comments — `/api/comments`
| Method | Path | הרשאה | תיאור |
|---|---|---|---|
| POST | `/` | מחובר + גישה | הוספת תגובה לקריאה |
| GET | `/:ticketId` | מחובר + גישה | רשימת תגובות לקריאה |

### Users — `/api/users` (admin בלבד)
| Method | Path | תיאור |
|---|---|---|
| POST | `/` | יצירת משתמש (כל role) |
| GET | `/` | רשימת משתמשים |
| GET | `/:id` | משתמש בודד |
| PATCH | `/:id` | עדכון משתמש |
| DELETE | `/:id` | מחיקת משתמש |

### Notifications — `/api/notifications`
| Method | Path | תיאור |
|---|---|---|
| GET | `/` | ההתראות שלי |
| PATCH | `/:id/read` | סימון התראה כנקראה |

## Socket.IO

חיבור לדוגמה מצד הלקוח:
```js
const socket = io(SERVER_URL, { auth: { token: jwtToken } });

socket.on('notification', (notification) => { ... });

socket.emit('joinTicket', ticketId);
socket.emit('sendMessage', { ticketId, message: 'שלום' });
socket.on('newMessage', (comment) => { ... });
```

## הרשאות לפי תפקיד

| Role | הרשאות |
|---|---|
| employee | פתיחת קריאה, צפייה בקריאות שלו בלבד, הוספת תגובות/קבצים לקריאות שלו |
| technician | צפייה בקריאות שהוקצו אליו, עדכון סטטוס, הוספת תגובות/קבצים |
| admin | גישה מלאה לכל הקריאות, ניהול משתמשים, הקצאת קריאות לטכנאים |
