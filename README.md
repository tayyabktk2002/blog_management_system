#  Blog Management Application

A modern, full-stack **Blog Management Application** built with **Node.js + Express** backend and **Next.js** frontend. This project demonstrates clean architecture, secure authentication, and responsive design principles.

##  Features

-  **User Authentication** - Secure JWT-based login/register system
-  **Rich Text Editor** - TipTap editor for creating and editing blog posts
-  **Responsive Design** - Mobile-first approach with Tailwind CSS
-  **Protected Routes** - route protection
-  **User Blog** - Personal blog management interface
-  **Modern UI/UX** - Clean and intuitive user interface
-  **Real-time Updates** - Dynamic content loading and updates

##  Project Structure

```
Blog-Management-App/
│
├── Backend/
│   ├── src/
│   │   ├── controller/
│   │   │   ├── auth.controller.js
│   │   │   └── post.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── post.route.js
│   │   ├── models/
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── config/
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   ├── .env.sample
│   └── .env
│
├── Frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── blog/
│   │   ├── create-blog/
│   │   ├── edit-blog/
│   │   ├── user-blog/
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── ActionBtn.jsx
│   │   ├── BlogCom.jsx
│   │   ├── ConditionalNavbar.jsx
│   │   ├── CreateBtn.jsx
│   │   ├── EditTiptap.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navber.jsx
│   │   └── TIptipEditor.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.js
│   ├── package.json
│   ├── .env.sample
│   └── next.config.mjs
│
└── README.md
```

##  Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **TipTap** - Rich text editor
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Lucide React** - Icon library

### Development Tools
- **nodemon** - Backend development server
- **ESLint** - Code linting
- **Git** - Version control

##  Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 1️ Clone Repository

```bash
git clone https://github.com/tayyabktk2002/blog_management_system.git
cd Blog-Management-App
```

### 2️ Backend Setup

```bash
cd Backend
npm install
```

**Environment Configuration:**
Create `.env` file from `.env.sample`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog-management
# or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/blog-management
JWT_SECRET=your-super-secret-jwt-key-here
```

**Start Backend Server:**
```bash
npm run dev
```
 Backend runs on `http://localhost:5000`

### 3️ Frontend Setup

```bash
cd Frontend
npm install
```

**Environment Configuration:**
Create `.env.local` file from `.env.sample`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1/
```

**Start Frontend Server:**
```bash
npm run dev
```
 Frontend runs on `http://localhost:3000`

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

###  Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
    "success": true,
    "message": "User logged in successfully",
    "data": {
        "id": "694a4e98f16c611f13e517d2",
        "name": "Tayyab Khattak",
        "email": "tayyabktk2002@gmail.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NGE0ZTk4ZjE2YzYxMWYxM2U1MTdkMiIsImVtYWlsIjoidGF5eWFia3RrMjAwMkBnbWFpbC5jb20iLCJpYXQiOjE3NjY2NzAxNDUsImV4cCI6MTc2NzI3NDk0NX0.WbOXb5kkFSZBe-6FWqnFIqCF9kV736FYHkXX5vEhtiE"
    }
}
```

###  Blog Post Endpoints

#### Get All Posts
```http
GET /api/v1/post/list
```

#### Get Post Details
```http
GET /api/v1/post/details/:id
```

#### Create Post (Protected)
```http
POST /api/v1/post/create
x-access-token: <jwt_token>
Content-Type: application/json

{
  "title": "My Blog Post",
  "content": "<p>Rich HTML content from TipTap editor</p>",
  "excerpt": "Brief description of the post"
}
```

#### Update Post (Protected)
```http
PUT /api/v1/post/update/:id
x-access-token: <jwt_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "<p>Updated content</p>"
}
```

#### Delete Post (Protected)
```http
DELETE /api/v1/post/remove/:id
x-access-token:  <jwt_token>
```

#### Get User's Posts (Protected)
```http
GET /api/v1/post/user-posts
x-access-token: <jwt_token>
```

##  Testing with cURL

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword" :"same like passowrd"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Create a blog post:**
```bash
curl -X POST http://localhost:5000/api/v1/post/create \
  -H "Content-Type: application/json" \
  -H "x-access-token: YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Blog Post",
    "content": "<p>This is my first blog post content.</p>"
    author_id: "get from token"
  }'
```

##  Architecture Overview

### Backend Architecture
- **MVC Pattern** - Separation of concerns with controllers, models, and routes
- **Middleware Chain** - Authentication, CORS, and error handling
- **JWT Authentication** - Stateless token-based authentication
- **MongoDB Integration** - Mongoose ODM for database operations

### Frontend Architecture
- **App Router** - Next.js 13+ file-based routing system
- **Context API** - Global state management for authentication
- **Component-Based** - Reusable React components
- **Service Layer** - Centralized API communication

### Security Features
- Password hashing with bcrypt
- JWT token expiration
- Protected API routes
- Input validation and sanitization
- CORS configuration

##  Application Features

### User Management
- User registration and login
- JWT-based authentication
- Protected user dashboard

### Blog Management
- Create, read, update, delete blog posts
- Rich text editing with TipTap
- User-specific blog listings
- Public blog viewing

### UI/UX Features
- Responsive design for all devices
- Loading states and error handling
- Toast notifications
- Conditional navigation
- Modern, clean interface

##  Deployment

### Backend Deployment (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT`
3. Deploy with automatic builds

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`
4. Deploy with automatic builds

##  Available Scripts

### Backend
```bash
npm start        # Production server
npm run dev      # Development with nodemon
npm test         # Run tests (to be implemented)
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint checking
```

##  Support

For any questions or issues, please contact:
- **Email:** tayyabktk2002@gmail.com
- **linkdin:** https://www.linkedin.com/in/tayyab-khattak/
- **Githun:** https://github.com/tayyabktk2002

##  Author

**Tayyab Ur Rehman**  
Full-Stack Developer  
- **Email:** tayyabktk2002@gmail.com

##  License

This project is created for interview evaluation purposes and learning.

---
Inside the Postman collection folder, you will find the API collection JSON file. You can easily test all APIs by importing it into Postman once the server is running.

Thank You So Much. 😊