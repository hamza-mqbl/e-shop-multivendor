# e-shop-multivendor

A fullstack MERN (MongoDB, Express, React, Node.js) multivendor e-commerce platform. This project allows multiple vendors to register, manage their products, and sell to customers in a scalable, modern web application.

## Features

- Multi-vendor support (each vendor manages their own products)
- User authentication and JWT-based authorization
- Product management (CRUD)
- Order management
- Payment integration (Stripe, PayPal)
- Real-time chat and notifications (Socket.io)
- Cloudinary image uploads
- Email notifications (Nodemailer)
- Responsive frontend with React and Tailwind CSS

## Technologies Used

- **Frontend:** React, Redux, Tailwind CSS, Axios, Socket.io-client
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Cloudinary, Nodemailer, Stripe, Socket.io
- **Deployment:** Vercel, Render, or your own server

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/hamza-mqbl/e-shop-multivendor.git
cd e-shop-multivendor
```

### 2. Backend Setup

Open a terminal and run:

```bash
cd backend
npm install
npm run dev
```

- Create a `.env` file in the `backend/socket/` directory with your environment variables (see example below).

### 3. Frontend Setup

Open a second terminal from the project root and run:

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

### 4. Socket Server (Optional, for real-time features)

If you want to enable real-time chat/notifications, open a third terminal and run:

```bash
cd socket
npm install
npm start
```

### 5. Environment Variables

```env
PORT=4000
SMPT_HOST="smtp.gmail.com"
SMPT_PORT=465
SMPT_PASSWORD="your_smtp_password"
SMPT_MAIL="your_email@gmail.com"
CLOUDINARY_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
ACTIVATION_SECRET="your_activation_secret"
MONGO_URL="your_mongodb_connection_string"
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES=5d
```

## Scripts

- **Backend**
  - `npm run dev` – Start backend in development mode
  - `npm start` – Start backend in production mode
- **Frontend**
  - `npm start` – Start React development server

## Folder Structure

```
e-shop-multivendor/
  backend/
  frontend/
  socket/
  uploads/
```

## License

This project is licensed under the ISC License.
