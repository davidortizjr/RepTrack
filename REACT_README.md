# RepTrack - React Workout Tracker

A modern, mobile-first workout tracking application built with React, TypeScript, and Bootstrap.

## 🚀 Features

- **User Authentication**: Login system with session management
- **Workout Programs**: Pre-defined workout programs (Push, Pull, Legs)
- **Exercise Tracking**: Log sets, reps, and weight for each exercise
- **Progress Monitoring**: View your workout history and progress
- **Mobile-First Design**: Optimized for phones with responsive layouts for tablets and desktops

## 📱 Pages

1. **Login** (`/login`) - User authentication
2. **Home** (`/home`) - Dashboard with progress summary and program selection
3. **Workouts** (`/workouts`) - Exercise tracking interface
4. **Progress** (`/progress`) - Detailed workout history

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Bootstrap 5** - Responsive UI components
- **Bootstrap Icons** - Icon library
- **Vite** - Build tool and dev server

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── BackButton.tsx   # Navigation back button
│   ├── Navbar.tsx       # Top navigation bar
│   └── ProtectedRoute.tsx # Route protection wrapper
├── context/            # React Context providers
│   ├── AuthContext.tsx  # Authentication state
│   └── ProgramContext.tsx # Selected program state
├── pages/              # Page components
│   ├── Home.tsx        # Dashboard
│   ├── Login.tsx       # Login page
│   ├── Progress.tsx    # Progress tracking
│   └── Workouts.tsx    # Exercise logging
├── styles/             # CSS modules
│   ├── global.css      # Global styles
│   ├── Home.css        # Home page styles
│   ├── Login.css       # Login page styles
│   ├── Navbar.css      # Navbar styles
│   ├── Progress.css    # Progress page styles
│   └── Workouts.css    # Workouts page styles
├── types/              # TypeScript definitions
│   └── index.ts        # Type definitions
├── App.tsx             # Main app component with routing
├── main.tsx            # App entry point
├── index.css           # Base styles
└── App.css             # App-specific styles
```

## 🎨 Design Philosophy

### Mobile-First Approach
- All layouts start with mobile design (320px+)
- Progressive enhancement for tablets (768px+)
- Full desktop experience (992px+)

### Color Scheme
- Primary: #9C2F2F (Red)
- Background: #1C1C1C (Dark)
- Text: #EFEDED (Off-white)

### Typography
- Font Family: Montserrat
- Responsive font sizing based on viewport

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
cd RepTrack
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## 🔐 Authentication

Currently uses mock authentication for demonstration. To login:
- Enter any email address
- Enter any password
- Click "Sign in"

**Note**: In a production environment, you would connect this to a real backend API.

## 💾 Data Management

The app currently uses:
- **LocalStorage** for user session persistence
- **Mock Data** for exercises and workouts

### Future Enhancements (Backend Integration)

To make this production-ready, you would need to:

1. Create a REST API or GraphQL backend
2. Connect to a MySQL database (schema based on the original PHP app)
3. Implement the following endpoints:
   - `POST /api/auth/login` - User authentication
   - `POST /api/auth/logout` - User logout
   - `GET /api/exercises?program_id={id}` - Get exercises for a program
   - `POST /api/workouts` - Log a workout
   - `GET /api/workouts/progress` - Get user progress

## 📱 Responsive Breakpoints

- **Mobile**: < 576px
- **Tablet**: 576px - 991px  
- **Desktop**: ≥ 992px

## 🎯 Key Differences from PHP Version

1. **Client-Side Routing**: Uses React Router instead of separate PHP files
2. **State Management**: Context API for global state
3. **Component-Based**: Reusable React components
4. **Type Safety**: TypeScript for better development experience
5. **Modern Build**: Vite for fast development and optimized production builds

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

### Code Style

- Use functional components with hooks
- TypeScript for all components
- CSS modules for styling
- Mobile-first responsive design

## 📝 License

This project is for educational purposes.

## 👤 Author

Converted from PHP to React with mobile-first design
