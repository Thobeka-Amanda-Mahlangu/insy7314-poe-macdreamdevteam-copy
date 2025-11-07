# Employee Portal Backend

Backend API server for the employee portal application.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `config/key.env` to `.env` in the root directory
   - Update MongoDB connection strings and JWT secret
   - Configure frontend origin URL

3. **Run the server:**
   ```bash
   npm start      # Production
   npm run dev    # Development (with nodemon)
   ```

## Project Structure

```
backend/
├── app.js              # Express app configuration
├── server.js           # Server entry point with HTTPS support
├── config/
│   ├── db.js          # MongoDB connection
│   └── key.env        # Environment variables template
├── middleware/
│   ├── auth.js        # JWT authentication middleware
│   ├── csrf.js        # CSRF protection
│   ├── security.js    # Rate limiting
│   └── validate.js    # Input validation middleware
├── models/
│   └── Employee.js    # Employee MongoDB schema
├── routes/
│   └── auth.js        # Authentication routes (register, login)
├── controllers/       # Business logic controllers
├── utils/
│   └── regex.js       # Validation regex patterns
├── tests/             # Test files
└── infra/
    └── certs/         # SSL certificates
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login employee (no registration endpoint)
- `GET /api/auth/csrf-token` - Get CSRF token

### Health Check
- `GET /health` - Server health check

### Employee Management
Employees are added via administrative script:
- `npm run add-employee` - Add employee interactively
- `npm run add-employee-batch` - Add multiple employees from script

## Security Features

- JWT-based authentication (15-minute expiration)
- CSRF protection
- Rate limiting on login endpoints
- Input validation with regex patterns
- Password hashing with bcrypt (12 rounds of salting)
- Helmet.js security headers
- CORS configuration
- MongoDB connection with TLS
- No public registration (controlled employee onboarding)

## Employee Model

Simplified model with only essential fields:
- `fullName`: String (3-50 chars, letters/spaces/apostrophes/hyphens)
- `employeeId`: String (unique, format: EMP followed by 5-10 digits, e.g., EMP00001)
- `password`: String (automatically hashed with bcrypt, min 8 chars with uppercase, number, special char)

## Testing

```bash
npm test
```

## Port

Default port: `5002` (configurable via `PORT` environment variable)

