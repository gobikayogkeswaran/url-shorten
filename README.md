
# 🔗 URL Shortener

A full-stack web application to shorten long URLs, manage them via a user dashboard, and customize slugs.  
Built with **React**, **Node.js**, **Express**, and **MongoDB**.

---

## Features

- ✅ User authentication (signup & login)
- 🔗 Shorten long URLs
- ✏️ Optional custom slugs
- 📋 Dashboard to view, edit, delete links
- 🔁 Redirects short URL to original URL

---

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/40779ab4-0f13-402c-911c-993258dc224b)

---

## 🧱 Tech Stack

| Layer       | Technology                |
|-------------|---------------------------|
| Frontend    | React, CSS                |
| Backend     | Node.js, Express.js       |
| Database    | MongoDB (via Mongoose)    |

---

## 📁 Project Structure

```
url-shortener/
├── frontend/             # React frontend
├── backend/              # Express backend
├── App.js, Login.js, ... # React components
├── server.js             # Main backend file
├── style.css             # CSS styles
└── README.md             # This file
```

---

## ⚙️ Getting Started

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/gobikayogkeswaran/url-shorten.git
cd url-shorten
```

### 🔹 2. Install Dependencies

#### Backend:

```bash
cd backend
npm install
```

#### Frontend:

```bash
cd ../frontend
npm install
```

---

### 🔹 3. Set Up Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
MONGODB_URI=your_mongodb_connection_url
PORT=5000
```

> Don’t share this file publicly. Add `.env` to `.gitignore`.

---

### 🔹 4. Run the App Locally

#### Start Backend:

```bash
cd backend
node server.js
```

#### Start Frontend:

```bash
cd ../frontend
npm start
```

Visit: `http://localhost:3000`

---

## 🧪 Example User Flow

1. User signs up or logs in
2. Enters a long URL and optional slug
3. App returns a short URL like `https://yourapp.com/abc123`
4. User can edit/delete it anytime via dashboard
5. Visiting the short link redirects to the original URL

---

