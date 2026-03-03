# 🧞 Genie - AI-Powered Workspace Chat Platform

A modern, full-stack SaaS platform for team communication with AI integration. Built with Next.js, Node.js, PostgreSQL, Socket.IO, and Google Gemini AI.

![Genie Platform](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- **🔐 Authentication**: Secure JWT-based authentication with HTTP-only cookies
- **💬 Real-Time Chat**: Instant messaging powered by Socket.IO
- **🤖 AI Assistant**: Integrated Gemini AI for intelligent responses (use `@genie` prefix)
- **🏠 Room System**: Create and manage multiple chat rooms
- **👥 User Management**: Role-based access control (Owner, Admin, Member)
- **🌓 Theme Support**: Dark/Light mode with system preference detection
- **📊 Usage Tracking**: AI usage monitoring and limits
- **🎨 Modern UI**: Responsive design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js + Express** - REST API server
- **Socket.IO** - WebSocket server for real-time features
- **Prisma** - Modern ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **Google Gemini AI** - AI integration
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL database
- Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PratikBhosale-07/genie.git
   cd genie
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Edit .env and add your configuration
   # - DATABASE_URL
   # - GEMINI_API_KEY
   # - JWT_SECRET
   
   # Generate Prisma client and sync database
   npx prisma generate
   npx prisma db push
   
   # Start backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Start frontend server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 📁 Project Structure

```
genie/
├── backend/                 # Backend Node.js application
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Express middlewares
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── sockets/        # Socket.IO handlers
│   └── package.json
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   └── lib/           # Utilities and API clients
│   └── package.json
└── README.md
```

## 🎯 Usage

### Creating an Account
1. Navigate to http://localhost:3000
2. Click "Get Started"
3. Register with email and password
4. Login to access the dashboard

### Using Chat Rooms
1. Click "+ New" to create a room
2. Select a room from the sidebar
3. Start chatting in real-time
4. Use `@genie your question` to interact with AI

## 🔑 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="your_secure_secret"
GEMINI_API_KEY="your_api_key"
FRONTEND_URL="http://localhost:3000"
PORT=8000
NODE_ENV=development
```

## 🗺️ Roadmap

- [x] Phase 1: Architecture Refactor
- [x] Phase 2: Authentication System
- [x] Phase 3: Room Management
- [x] Phase 4: Real-Time Chat
- [x] Phase 5: AI Integration
- [ ] Phase 6: File Upload (S3)
- [ ] Phase 7: Video Calls (WebRTC)
- [ ] Phase 8: Stripe Subscriptions
- [ ] Phase 9: Security Enhancements
- [ ] Phase 10: Scalability Optimizations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Pratik Bhosale**
- GitHub: [@PratikBhosale-07](https://github.com/PratikBhosale-07)

## 🙏 Acknowledgments

- Google Gemini AI for AI capabilities
- Next.js team for the amazing framework
- Socket.IO for real-time functionality
- Prisma for database tooling
