# Sanjeevani Server

A comprehensive Node.js API server for the Sanjeevani Medicine Tracker application, built with Express, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- **Authentication**: JWT-based authentication with user management
- **Medicine Management**: Full CRUD operations for medicine tracking
- **Medicine Logging**: Track medicine intake with status tracking
- **Statistics**: Comprehensive medicine statistics and compliance tracking
- **Security**: Rate limiting, CORS, helmet, and input validation
- **Database**: PostgreSQL with Prisma ORM
- **TypeScript**: Full type safety and modern JavaScript features

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your database URL and other configurations.

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Or run migrations
   npm run db:migrate
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Medicines
- `POST /api/medicines` - Create a new medicine
- `GET /api/medicines` - Get user's medicines (with pagination and filtering)
- `GET /api/medicines/:id` - Get specific medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine
- `GET /api/medicines/date/:date` - Get medicines for specific date
- `GET /api/medicines/stats` - Get medicine statistics
- `GET /api/medicines/logs` - Get medicine logs
- `POST /api/medicines/log` - Log medicine intake

### Health Check
- `GET /health` - Server health check

## 🗄️ Database Schema

### Users
- User authentication and profile information

### Medicines
- Medicine details including name, dosage, frequency, dates, and notes
- Linked to users with foreign key relationship

### Medicine Logs
- Track medicine intake status (TAKEN, MISSED, PENDING, EDITED)
- Date-based logging with optional notes

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

### Project Structure

```
src/
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── routes/         # API route definitions
├── services/       # Business logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── app.ts          # Express app configuration
└── server.ts       # Server entry point
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevent API abuse with configurable limits
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Prisma ORM prevents SQL injection

## 📊 Monitoring

- **Health Check**: `/health` endpoint for server monitoring
- **Logging**: Morgan HTTP request logging
- **Error Handling**: Comprehensive error handling and logging

## 🌐 Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sanjeevani_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set up production environment variables**

3. **Start the production server:**
   ```bash
   npm start
   ```

## 📝 License

ISC License
