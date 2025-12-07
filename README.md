# 🔗 URL Shortener with Authentication & QR Codes

A full-stack MERN application that allows users to shorten URLs, generate QR codes, and manage their links with JWT authentication.

![URL Shortener](https://img.shields.io/badge/URL-Shortener-blue) ![MERN Stack](https://img.shields.io/badge/MERN-Stack-green) ![JWT Auth](https://img.shields.io/badge/JWT-Auth-orange) ![QR Codes](https://img.shields.io/badge/QR-Codes-lightgrey)

## ✨ Features

- **JWT Authentication** - User registration and login
- **URL Shortening** - Convert long URLs to short codes
- **QR Code Generation** - Automatically generate QR codes for shortened URLs
- **User Dashboard** - View and manage all your shortened URLs
- **Responsive UI** - Built with Chakra UI for beautiful, responsive design
- **Fast & Lightweight** - Built with Vite + React frontend
- **Production Ready** - Deployed on Render + Vercel

## 🎥 Project Demo

Click the image below to watch the demo:

- [![Watch the video]( <img width="1098" height="677" alt="image" src="https://github.com/user-attachments/assets/cdd10148-8d79-417f-9f81-bbe7ce5c4559" />)]([PASTE_LOOM_SHARE_LINK_HERE](https://www.loom.com/share/2b01311c6008455bb36b8ef32f3a404b))
- **Frontend:** [https://url-shortener-sand-eight.vercel.app/](https://url-shortener-sand-eight.vercel.app/)
- **Backend API:** [https://url-shortener-ymc2.onrender.com](https://url-shortener-ymc2.onrender.com)

## 🛠️ Tech Stack

### Frontend:
- **React** + Vite
- **Chakra UI** for styling
- **Axios** for API calls
- **React Router** for navigation

### Backend:
- **Node.js** + Express.js
- **MongoDB Atlas** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **QRCode** for QR generation

### Deployment:
- **Render.com** for backend hosting
- **Vercel** for frontend hosting
- **MongoDB Atlas** for database

## 📦 Installation

### Prerequisites:
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### 1. Clone the Repository:
```bash
git clone https://github.com/Vedantk1919/url-shortener.git
cd url-shortener
```

### 2. Setup Backend:
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/shortUrl
BASEURI=http://localhost:5000
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=24h
PORT=5000
NODE_ENV=development
```

### 3. Setup Frontend:
```bash
cd ../client
npm install
```

### 4. Run Development Servers:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## 🎯 Usage

1. **Register/Login** - Create an account or login with existing credentials
2. **Shorten URL** - Paste a long URL and get a shortened version
3. **QR Code** - Download QR code for your shortened URL
4. **Manage Links** - View all your shortened URLs in your dashboard
5. **Share** - Use the shortened URL anywhere

## 📋 API Endpoints

### Authentication:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### URL Shortening:
- `POST /api/url/shorten` - Create shortened URL (Authenticated)
- `GET /api/url/my-urls` - Get user's URLs (Authenticated)
- `GET /:urlCode` - Redirect to original URL (Public)

## 🚀 Deployment

### Backend (Render.com):
1. Connect GitHub repository to Render
2. Set root directory to `server`
3. Add environment variables in Render dashboard
4. Deploy automatically from main branch

### Frontend (Vercel):
1. Connect GitHub repository to Vercel
2. Set root directory to `client`
3. Build command: `npm run build`
4. Deploy automatically

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

