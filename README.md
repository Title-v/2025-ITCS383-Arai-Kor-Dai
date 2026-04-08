# 🏣 Post Office Online Shipping System
### 2025-ITCS383 · Arai-Kor-Dai

> A full-stack web application that allows customers to prepare parcels and letters before visiting the post office — register, create shipments, pay online, and print a shipping label.

🔗 **Live Demo:** [https://araikordai-postoffice.vercel.app/login](https://araikordai-postoffice.vercel.app/login)

📱 **Android App Repository:** [https://github.com/FantasticRattee/2025-ITCS383-Emerald-Android](https://github.com/FantasticRattee/2025-ITCS383-Emerald-Android)

---

## 🔑 Demo Credentials

| Field    | Value                  |
|----------|------------------------|
| Username | `SomchaiJ@gmail.com`   |
| Password | `Pass1234`             |

---

## 👥 Team Members

| Student ID | First Name      | Last Name          |
|------------|-----------------|--------------------|
| 6688046    | Warut           | Khamkaveephart     |
| 6688194    | Muhummadcharif  | Kapa               |
| 6688083    | Teeramanop      | Pinsupa            |
| 6688148    | Bunyakorn       | Wongchadakul       |
| 6688205    | Sirawit         | Noomanoch          |
| 6688226    | Thanawat        | Thanasirithip      |

---

## ✨ Main Features

**For Customers:**
- Register with identity verification (national ID card + selfie upload)
- Login with email and password after account approval
- Create shipping orders — select parcel type, size, and weight
- Enter receiver information and delivery address
- Automatic price calculation
- Pay online via PromptPay, credit card, or e-wallet (TrueMoney)
- Generate a PDF shipping label with QR code for tracking
- Track parcel status with a tracking number
- Optional insurance for valuable items

**For Staff (Admin Dashboard):**
- Monitor parcel volume by day, week, and month
- View revenue reports
- Export formatted PDF reports for management

---

## 🗂️ Project Structure

```
2025-ITCS383-Arai-Kor-Dai/
├── README.md
├── designs/
│   └── D1_Design.md
├── frontend/
├── backend/
└── database/
```

### Frontend
```
frontend/
├── public/
│   ├── index.html
│   └── ...
└── src/
    ├── Pages/
    ├── App.js
    └── ...
```

### Backend
```
implementations/backend/
├── routes/
│   ├── activity.js
│   ├── notifications.js
│   ├── shipments.js
│   └── users.js
├── db.js
├── server.js
└── package.json
```

### Database
```
database/
├── schema.sql
├── seed.sql
└── migrations/
    ├── create_users_table.sql
    ├── create_shipments_table.sql
    ├── create_payments_table.sql
    └── create_tracking_table.sql
```

---

## 🚀 Getting Started (Run Locally)

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm (bundled with Node.js)
- [Git](https://git-scm.com/)
- [MySQL](https://dev.mysql.com/downloads/)

### Quick Setup

| Step | Command |
|------|---------|
| 1. Clone | `git clone https://github.com/ICT-Mahidol/2025-ITCS383-Arai-Kor-Dai.git` |
| 2. Setup DB | `mysql -u root -p < implementations/backend/setup.sql` |
| 3. Start backend | `cd implementations/backend && npm install && node server.js` |
| 4. Start frontend | `cd implementations/frontend && npm install && npm start` |

---

### Detailed Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/ICT-Mahidol/2025-ITCS383-Arai-Kor-Dai.git
cd 2025-ITCS383-Arai-Kor-Dai
```

#### 2. Set Up the Database

```bash
mysql -u root -p < implementations/backend/setup.sql
```

Enter your MySQL password when prompted.

#### 3. Set Up Environment Variables

Create a `.env` file inside `implementations/backend/`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=postoffice
PORT=3000
```

> ⚠️ Change `DB_PASS` to match **your own** MySQL password.

#### 4. Run the Backend

```bash
cd implementations/backend
npm install
node server.js
```

Keep this terminal open.

#### 5. Run the Frontend

Open a **second terminal**:

```bash
cd implementations/frontend
npm install
npm start
```

When prompted `Would you like to run the app on another port instead? (Y/n)`, press `Y`.

Your browser should open at **http://localhost:3001** (port 3000 is used by the backend).

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| `DB Access Denied` | Check that `DB_PASS` in `.env` matches your MySQL password |
| `Unknown database 'postoffice'` | Run the setup script in Step 2 first |
| `.env not found` | Make sure the file is inside `implementations/backend/`, not the project root |
| Port conflict | Press `Y` when prompted to switch to the next available port |
| `npm not found` | Install [Node.js](https://nodejs.org/) first; npm is bundled |

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React |
| Backend | Node.js + Express |
| Database | MySQL |
| Hosting | Vercel |

---

## 📋 System Requirements

- **Uptime:** 99.999% high availability
- **Performance:** Page response within 1 second
- **Security:** Encryption for database storage and network transmission
- **Design theme:** Thailand Post (white & red)
