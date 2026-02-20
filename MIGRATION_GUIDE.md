# Migration Guide: PHP to React

This document outlines the conversion from the PHP RepTrack application to the React version.

## What Was Converted

### Pages Converted

| PHP File | React Component | Route | Description |
|----------|----------------|-------|-------------|
| `login.php` | `src/pages/Login.tsx` | `/login` | User authentication |
| `home_page.php` | `src/pages/Home.tsx` | `/home` | Dashboard with progress and program selection |
| `workouts.php` | `src/pages/Workouts.tsx` | `/workouts` | Exercise tracking interface |
| `progress.php` | `src/pages/Progress.tsx` | `/progress` | Workout history and progress |

### Components Converted

| PHP Include | React Component | Purpose |
|-------------|----------------|---------|
| `assets/modular/navbar.php` | `src/components/Navbar.tsx` | Navigation header |
| N/A | `src/components/BackButton.tsx` | Back navigation button |
| N/A | `src/components/ProtectedRoute.tsx` | Route authentication wrapper |

### Styling Converted

| PHP/CSS | React CSS | Mobile-First |
|---------|-----------|--------------|
| `assets/css/style.css` | `src/styles/*.css` | ✅ Yes |
| Bootstrap 5 CDN | Bootstrap npm package | ✅ Yes |
| Bootstrap Icons CDN | Bootstrap Icons npm | ✅ Yes |

## Architecture Changes

### Session Management

**PHP Approach:**
```php
session_start();
$_SESSION['user_id'] = $user['user_id'];
```

**React Approach:**
```typescript
// Context API + LocalStorage
const AuthContext = createContext<AuthContextType>();
localStorage.setItem('user', JSON.stringify(user));
```

### Data Fetching

**PHP Approach:**
```php
$query = "SELECT * FROM exercises WHERE program_id = '$programId'";
$result = executeQuery($query);
```

**React Approach:**
```typescript
// API service (currently mocked)
const exercises = await exerciseAPI.getExercisesByProgram(programId);
```

### Routing

**PHP Approach:**
```php
// Separate files, server-side routing
header("Location: home_page.php");
```

**React Approach:**
```typescript
// Single-page app, client-side routing
import { useNavigate } from 'react-router-dom';
navigate('/home');
```

### Form Handling

**PHP Approach:**
```php
if (isset($_POST['sign-in-btn'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];
    // Process...
}
```

**React Approach:**
```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  const success = await login(email, password);
  // Handle success...
};
```

## Mobile-First Implementation

### Responsive Design Strategy

1. **Base styles for mobile** (320px - 576px)
   - Single column layouts
   - Larger touch targets
   - Simplified navigation

2. **Tablet enhancements** (576px - 992px)
   - Two-column grids
   - More whitespace
   - Enhanced imagery

3. **Desktop optimization** (992px+)
   - Three-column grids
   - Full feature set
   - Larger imagery

### Example Mobile-First CSS

```css
/* Mobile first (default) */
.card {
  margin-bottom: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .col-md-6 {
    flex: 0 0 50%;
  }
}

/* Desktop and up */
@media (min-width: 992px) {
  .col-lg-4 {
    flex: 0 0 33.333%;
  }
}
```

## Adding a Backend API

### Step 1: Set Up Backend Server

Choose your backend technology:
- **Node.js/Express** (Recommended for JavaScript consistency)
- **PHP/Laravel** (Keep existing database)
- **Python/FastAPI**
- **ASP.NET Core**

### Step 2: Create Database Schema

Use the existing MySQL schema from your PHP app:

```sql
-- Users table
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Programs table
CREATE TABLE programs (
  program_id INT PRIMARY KEY AUTO_INCREMENT,
  program_name VARCHAR(50) NOT NULL
);

-- Exercises table
CREATE TABLE exercises (
  exercise_id INT PRIMARY KEY AUTO_INCREMENT,
  exercise_name VARCHAR(100) NOT NULL,
  program_id INT,
  FOREIGN KEY (program_id) REFERENCES programs(program_id)
);

-- Workouts table
CREATE TABLE workouts (
  workout_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  exercise_id INT,
  sets INT,
  reps INT,
  weight DECIMAL(5,2),
  workout_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id)
);
```

### Step 3: Connect React to API

Update `src/services/api.ts` to make real HTTP requests:

```typescript
// Example: Update the login function
export const authAPI = {
  login: async (email: string, password: string): Promise<User | null> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // For cookies
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    return data.user;
  }
};
```

### Step 4: Update Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

Update `src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

### Step 5: Handle Authentication State

Update `src/context/AuthContext.tsx` to use the API:

```typescript
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const user = await authAPI.login(email, password);
    if (user) {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};
```

## Security Considerations

### What's Currently Missing (Dev Only)

⚠️ **These are NOT production-ready:**

1. **Password hashing** - Passwords should be hashed with bcrypt
2. **JWT tokens** - Use tokens instead of session storage
3. **HTTPS** - Always use HTTPS in production
4. **CORS** - Configure proper CORS headers
5. **Input validation** - Add server-side validation
6. **SQL injection protection** - Use prepared statements
7. **Rate limiting** - Prevent brute force attacks

### Making It Production-Ready

```typescript
// Example: Add JWT token handling
const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  // Store JWT token
  localStorage.setItem('token', data.token);
  
  // Add to all future requests
  axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  
  return data.user;
};
```

## Testing the Application

### Current State (Mock Data)

You can test all features without a backend:
1. Login with any email/password
2. Select workout programs
3. Log exercises (console output)
4. View mock progress data

### With Real Backend

Once you add a backend:
1. Update API calls in `src/services/api.ts`
2. Test each endpoint individually
3. Add error handling
4. Implement loading states

## Deployment

### Frontend Deployment

**Build the app:**
```bash
npm run build
```

**Deploy to:**
- Vercel (Recommended for React)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

### Backend Deployment

**Deploy to:**
- Heroku
- AWS (EC2, Elastic Beanstalk, Lambda)
- DigitalOcean
- Railway

### Full-Stack Deployment

For a complete solution, deploy:
1. Frontend to Vercel/Netlify
2. Backend to Heroku/Railway
3. Database to PlanetScale/AWS RDS
4. Update CORS and environment variables

## Next Steps

### Immediate Tasks

1. ✅ Test the application locally
2. ✅ Verify mobile responsiveness
3. ⬜ Set up a backend API
4. ⬜ Connect to database
5. ⬜ Add authentication
6. ⬜ Deploy to production

### Future Enhancements

- [ ] Add real-time workout tracking
- [ ] Implement charts/graphs for progress
- [ ] Add social features (share workouts)
- [ ] Create custom workout builder
- [ ] Add workout reminders/scheduling
- [ ] Implement offline mode (PWA)
- [ ] Add exercise video demonstrations
- [ ] Create workout templates

## Support

For questions or issues:
1. Check the REACT_README.md
2. Review this migration guide
3. Inspect browser console for errors
4. Check Network tab for API issues

## Summary

✅ **Completed:**
- Full PHP to React conversion
- Mobile-first responsive design
- TypeScript implementation
- React Router navigation
- Context API state management
- Bootstrap 5 styling
- Component-based architecture

⬜ **Requires Backend (Future):**
- Real authentication
- Database integration
- API endpoints
- Production security

The application is now a modern, maintainable React codebase ready for production once you add a proper backend!
