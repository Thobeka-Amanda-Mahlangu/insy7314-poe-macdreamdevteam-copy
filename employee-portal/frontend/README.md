# Employee Portal Frontend

React frontend for the employee portal application.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Create a `.env` file in the root directory with:
   ```
   PORT=3001
   REACT_APP_API_URL=https://localhost:5002/api
   ```

3. **Run the application:**
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3001`

## Project Structure

```
frontend/
├── public/               # Static files
│   ├── index.html       # Main HTML template
│   └── manifest.json    # PWA manifest
├── src/
│   ├── api/
│   │   └── api.js       # Axios instances with interceptors
│   ├── assets/          # Images and static assets
│   ├── components/
│   │   └── Navbar.js    # Navigation component
│   ├── context/
│   │   └── AuthContext.js  # Authentication context provider
│   ├── forms/           # Form components (extensible)
│   ├── pages/
│   │   ├── HomePage.js     # Landing page
│   │   ├── LoginPage.js    # Employee login
│   │   ├── PortalPage.js   # Protected dashboard
│   │   └── ErrorPage.js    # Error handling
│   ├── App.js           # Main app with routing
│   ├── App.css          # App-specific styles
│   ├── index.js         # Entry point
│   └── index.css        # Global styles with theme variables
```

## Features

### Security
- JWT-based authentication
- CSRF protection with tokens
- Protected routes with authentication guards
- Axios interceptors for automatic token management
- Secure credential storage

### UI/UX
- Responsive Bootstrap 5 design
- Dark theme with green/purple accent colors
- Bootstrap Icons for visual elements
- Mobile-friendly navigation
- Form validation with Formik and Yup

### Theme Colors
- Primary Green: `#28a745`
- Secondary Purple: `#6f42c1`
- Dark Background: `#1a1a2e`
- Light Surface: `#2d2d44`

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build production bundle
- `npm test` - Run tests

## API Integration

The frontend connects to the backend at `https://localhost:5002/api` (configurable via `.env`).

### Endpoints Used:
- `POST /auth/login` - Employee authentication
- `GET /auth/csrf-token` - Get CSRF token

### Employee Login Format:
- **Employee ID**: EMP##### (e.g., EMP12345)
- **Password**: Minimum 8 characters with uppercase, number, and special character

## Browser Support

Modern browsers with ES6+ support:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
