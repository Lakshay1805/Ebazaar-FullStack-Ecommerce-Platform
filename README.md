# 🛒 E-Bazaar – Full Stack MERN E-Commerce Platform

A production-style full-stack **e-commerce web application** built using the MERN stack with authentication, payments, admin dashboard, secure APIs, and cloud image storage.

This project demonstrates real-world backend engineering with authentication, validation, security middleware, and payment integration.

---

## 🚀 Live Demo
Frontend: https://your-frontend-url  
Backend API: https://your-backend-url  

---

## ✨ Key Features

### 👤 Authentication & User System
- JWT-based authentication (Access token)
- Refresh token implementation
- User registration & login
- Email verification system (Nodemailer)
- Password reset via email (secure token-based flow)
- Protected routes (User & Admin)

---

### 🛍️ E-Commerce Features
- Product listing with categories
- Advanced search & filtering
- Price sorting (low-high, high-low, newest, top rated)
- Shopping cart system
- Order placement & history tracking
- Stock management

---

### 🧑‍💼 Admin Features
- Create / update / delete products
- Inventory & stock control
- View all orders
- Admin-only protected routes

---

### 💳 Payment Integration
- Razorpay payment gateway (test mode)
- Secure order creation & verification
- Payment signature validation

---

### ☁️ File Uploads
- Cloudinary image storage integration
- Multer middleware for file handling
- Secure image upload for products

---

### 🔐 Security & Backend Engineering
- Input validation using **Joi**
- Rate limiting (prevents brute-force & abuse)
- Protected APIs with middleware
- Role-based access control (RBAC)
- Secure error handling
- Environment variable protection
- CORS configuration

---

## 🧠 Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Nodemailer
- Joi Validation
- Express Rate Limiter
- Multer
- Cloudinary
- Razorpay SDK

---

## 📁 Project Structure

Ebazaar-FullStack-Ecommerce-Platform/
│
├── backend/
│   ├── config/              # DB & cloud configs
│   ├── controllers/         # Route logic (auth, products, orders, payment, Subscription, analytics)
│   ├── middleware/          # Auth, admin, rate limiter, validation, errorHandler
│   ├── models/              # Mongoose schemas (User, Product, Order, Review, Subscription)
│   ├── routes/              # Express routes
│   ├── utils/               # Razorpay, nodeMailer
│   ├── uploads/             # Temporary multer uploads (if used)
│   ├── schemas/             # Joi schemas
│   ├── index.js             # Express app setup
│   └── app.js               # Express app setup
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Pages (Home, Product, Cart, Admin)
│   │   ├── utils/           # axios instance, helpers
│   │   ├── context/         # cart context, theme context
│   │   └── App.jsx
│   └── index.html
│
├── .gitignore
└── README.md

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Lakshay1805/Ebazaar-FullStack-Ecommerce-Platform.git

```
### 2️⃣ Backend Setup
```bash

- cd backend
- npm install

```

#### Create .env file

```bash

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret

RAZOR_KEY_ID=your_razorpay_key
RAZOR_KEY_SECRET=your_razorpay_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

```

#### run Backend
```bash

npm run start
```

### 3️⃣ Frontend Setup
```bash

cd frontend
npm install
npm run dev

```

#### Create .env file
```bash

VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_key

```

---

## 🔥 Advanced Features Implemented
- JWT Authentication with refresh tokens
- Email verification (Nodemailer)
- Password reset system
- Role-based authorization (Admin/User)
- Rate limiting for API protection
- Joi validation for secure input handling
- Cloudinary image uploads
- Razorpay payment verification
- Fully protected backend routes

---

## 📈 Future Improvements
- Wishlist system
- Product recommendations

---

## 👨‍💻 Author

Lakshay Kumar Sethi

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.
It helps a lot!