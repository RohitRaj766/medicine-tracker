# Sanjeevani Server Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd sanjeevaniserver
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your database credentials
# Update DATABASE_URL and JWT_SECRET
```

### 3. Set Up Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 4. Start Development Server
```bash
# Option 1: Use the setup script
npm run dev:setup

# Option 2: Start directly
npm run dev
```

## 🔧 Configuration

### Environment Variables (.env)
```env
# Database - Update with your Neon DB credentials
DATABASE_URL="postgresql://username:password@your-neon-host/database"

# JWT - Generate a secure secret
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# CORS - Update for your frontend URL
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Neon Database Setup
1. Create a new project on [Neon](https://neon.tech)
2. Copy the connection string
3. Update `DATABASE_URL` in your `.env` file
4. Run `npm run db:push` to create tables

## 📊 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run dev:setup` - Setup and start development server

## 🔗 API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Medicines
- `POST /api/medicines` - Create medicine
- `GET /api/medicines` - Get medicines (with pagination)
- `GET /api/medicines/:id` - Get specific medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine
- `GET /api/medicines/date/:date` - Get medicines for date
- `GET /api/medicines/stats` - Get medicine statistics
- `GET /api/medicines/logs` - Get medicine logs
- `POST /api/medicines/log` - Log medicine intake

## 🛠️ Troubleshooting

### Common Issues

1. **Module not found errors**
   - Make sure all dependencies are installed: `npm install`
   - Check if TypeScript is compiled: `npm run build`

2. **Database connection errors**
   - Verify your DATABASE_URL in .env
   - Check if your database is accessible
   - Run `npm run db:generate` to ensure Prisma client is generated

3. **Port already in use**
   - Change the PORT in .env file
   - Kill the process using the port: `lsof -ti:3001 | xargs kill -9`

4. **CORS errors**
   - Update CORS_ORIGIN in .env to match your frontend URL
   - Check if the frontend is running on the correct port

### Development Tips

- Use `npm run db:studio` to view and edit your database
- Check server logs for detailed error messages
- Use Postman or similar tools to test API endpoints
- Monitor the `/health` endpoint to ensure server is running

## 🚀 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   - Update DATABASE_URL with production database
   - Set NODE_ENV=production
   - Use secure JWT_SECRET

3. **Start production server**
   ```bash
   npm start
   ```

## 📝 Next Steps

1. Set up your Neon database
2. Update the .env file with your credentials
3. Run the setup commands
4. Test the API endpoints
5. Integrate with your React Native frontend
