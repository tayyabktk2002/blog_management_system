# Blog Management Application

A full-stack **Blog Management Application** built as part of an interview task. The project includes a **Node.js + Express backend** and a **Next.js frontend**, following clean architecture and best practices.

---

## 🏗️ Project Structure

```
Blog-Management-App
│
├── Backend
│   ├── src
│   │   ├── controllers
│   │   ├── routes
│   │   ├── models
│   │   ├── middlewares
│   │   └── config
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── Frontend
│   ├── app / pages
│   ├── components
│   ├── services
│   ├── package.json
│   └── next.config.js
│
└── README.md
```

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcrypt
* nodemon (development)

### Frontend

* Next.js
* React.js
* Tailwind CSS
* Axios

### Tools

* Git & GitHub
* Postman
* npm

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-github-repo-url>
cd Blog-Management-App
```

---

## 🔧 Backend Setup (Node.js + Express)

```bash
cd Backend
npm install
```

### Environment Variables

Create a `.env` file using `.env.sample`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run Backend (Development)

```bash
npm run dev
```

> Backend runs using **nodemon** on `http://localhost:5000`

---

## 🎨 Frontend Setup (Next.js)

```bash
cd Frontend
npm install
npm run dev
```

> Frontend runs on `http://localhost:3000`

---

## 🔌 API Documentation (Sample)

### 🔐 Authentication

#### Register User

```
POST /api/auth/register
```

**Request Body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "12345678"
}
```

---

#### Login User

```
POST /api/auth/login
```

**Response**

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "email": "john@example.com"
  }
}
```

---

### 📝 Blog APIs

#### Get All Blogs

```
GET /api/v1/blogs
```

#### Create Blog (Protected)

```
POST /api/blogs
Authorization:  <x-access-token>
```

---

## 🧪 Postman / cURL Example

```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"john@example.com","password":"123456"}'
```

---

## 🧠 Architecture Explanation (Brief)

* **Frontend (Next.js)** handles UI, routing, and API consumption
* **Backend (Express)** provides REST APIs
* **MongoDB** stores users & blog data
* **JWT** secures protected routes
* **MVC Pattern** used in backend for scalability

---

## 🚀 Deployment (Optional)

* Backend can be deployed on **Render / Railway**
* Frontend can be deployed on **Vercel / Netlify**
* Environment variables handled securely in hosting platforms

---

## 👨‍💻 Author

**Tayyab Ur Rehman**
Full-Stack Developer

---

## 📄 License

This project is created for interview evaluation purposes.
