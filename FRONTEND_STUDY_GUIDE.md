# Moveo AI Crypto Advisor - Frontend Study Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [HTTP Requests & API Integration](#http-requests--api-integration)
4. [Authentication Flow (JWT)](#authentication-flow-jwt)
5. [State Management](#state-management)
6. [Routing & Protected Routes](#routing--protected-routes)
7. [Key Components](#key-components)
8. [Services & Utilities](#services--utilities)
9. [Common Interview Questions](#common-interview-questions)

---

## Project Overview

**Moveo AI Crypto Advisor** is a personalized crypto investor dashboard that:
- Authenticates users with JWT tokens
- Collects user preferences through an onboarding quiz
- Displays personalized content (coin prices, news, AI insights, memes)
- Provides a clean, professional UI with video backgrounds

### Key Features
- **Authentication**: Login/Signup with JWT token management
- **Onboarding**: 3-step questionnaire (assets, investor type, content preferences)
- **Dashboard**: 4 sections displaying personalized crypto data
- **Responsive Design**: Works on desktop and mobile devices

---

## Architecture & Tech Stack

### Core Technologies

1. **React 18** - UI library with hooks
2. **Vite** - Fast build tool and dev server
3. **React Router DOM v6** - Client-side routing
4. **Redux** - Global state management (legacy, mostly for compatibility)
5. **React Context API** - Authentication state management
6. **Axios** - HTTP client with interceptors
7. **Sass** - CSS preprocessing

### Project Structure

```
src/
├── assets/styles/        # Global SCSS styles
├── cmps/                 # Reusable components
│   ├── dashboard/       # Dashboard section components
│   ├── Loader.jsx       # Loading animation
│   ├── ProtectedRoute.jsx
│   ├── OnboardingGuard.jsx
│   └── UserMsg.jsx      # Toast notifications
├── contexts/            # React Context providers
│   └── AuthContext.jsx  # JWT authentication state
├── pages/               # Page components
│   ├── LoginSignup.jsx
│   ├── Onboarding.jsx
│   └── Dashboard.jsx
├── services/            # Business logic & API calls
│   ├── http.service.js  # Axios wrapper with interceptors
│   ├── storage.service.js
│   ├── user/
│   ├── preferences.service.js
│   └── dashboard.service.js
└── store/               # Redux store (legacy)
    ├── store.js
    ├── user.reducer.js
    └── user.actions.js
```

---

## HTTP Requests & API Integration

### HTTP Service (`http.service.js`)

**Purpose**: Centralized HTTP client using Axios with automatic JWT token injection and global error handling.

#### Key Features:

1. **Base URL Configuration**
   ```javascript
   const BASE_URL = process.env.NODE_ENV === 'production'
       ? '/api/'
       : 'http://localhost:3030/api/'
   ```

2. **Request Interceptor** - Automatically adds JWT token
   ```javascript
   axios.interceptors.request.use((config) => {
       const token = storageService.load('authToken')
       if (token) {
           config.headers.Authorization = `Bearer ${token}`
       }
       return config
   })
   ```

3. **Response Interceptor** - Handles 401 errors globally
   ```javascript
   axios.interceptors.response.use(
       (response) => response,
       (error) => {
           if (error.response?.status === 401) {
               // Clear auth data and redirect to login
               storageService.remove('authToken')
               storageService.remove('authUser')
               window.location.href = '/login'
           }
           return Promise.reject(error)
       }
   )
   ```

4. **API Methods**
   ```javascript
   httpService.get(endpoint, data)    // GET request
   httpService.post(endpoint, data)   // POST request
   httpService.put(endpoint, data)    // PUT request
   httpService.delete(endpoint, data) // DELETE request
   ```

### API Endpoints Used

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/signup` | User registration | No |
| POST | `/api/auth/logout` | User logout | Yes |
| GET | `/api/user/preferences` | Get user preferences | Yes |
| POST | `/api/user/preferences` | Save preferences (onboarding) | Yes |
| PUT | `/api/user/preferences` | Update preferences | Yes |
| GET | `/api/dashboard` | Get personalized dashboard | Yes |

### Example: Making an API Call

```javascript
// In a service file
import { httpService } from './http.service'

export const preferencesService = {
    async getPreferences() {
        // Token automatically added by interceptor
        const response = await httpService.get('user/preferences')
        return response
    },
    
    async savePreferences(preferences) {
        // POST request with data
        const response = await httpService.post('user/preferences', preferences)
        return response
    }
}
```

### Error Handling

- **401 Unauthorized**: Automatically handled by interceptor → clears auth → redirects to login
- **404 Not Found**: Handled in service layer with specific error messages
- **400 Bad Request**: Validation errors returned from backend
- **Network Errors**: Caught in try/catch blocks, user-friendly messages shown

---

## Authentication Flow (JWT)

### Overview

The app uses **JWT (JSON Web Tokens)** for authentication. Tokens are stored in `localStorage` and automatically included in all API requests.

### Components

1. **AuthContext** (`contexts/AuthContext.jsx`)
   - Manages authentication state globally
   - Provides `login()`, `logout()`, `isAuthenticated`, `user`, `token`
   - Loads token from storage on app mount

2. **Storage Service** (`services/storage.service.js`)
   - Abstracts localStorage/sessionStorage operations
   - Handles JSON serialization automatically
   - Provides error handling

### Authentication Flow

#### 1. Login/Signup Process

```javascript
// User submits form
async function handleSubmit(ev) {
    ev.preventDefault()
    try {
        // Call API
        const response = await signup(credentials) // or login()
        
        // Response: { token: "eyJ...", user: {...} }
        
        // Store in AuthContext (saves to localStorage)
        authLogin(response.token, response.user)
        
        // Check onboarding status
        const prefs = await preferencesService.getPreferences()
        if (prefs.completedOnboarding) {
            navigate('/dashboard')
        } else {
            navigate('/onboarding')
        }
    } catch (err) {
        // Show error message
        showErrorMsg(err.message)
    }
}
```

#### 2. Token Storage

```javascript
// In AuthContext
function login(authToken, userData) {
    storageService.save('authToken', authToken)  // localStorage
    storageService.save('authUser', userData)    // localStorage
    setToken(authToken)
    setUser(userData)
    setIsAuthenticated(true)
}
```

#### 3. Automatic Token Injection

```javascript
// In http.service.js - Request Interceptor
axios.interceptors.request.use((config) => {
    const token = storageService.load('authToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
```

#### 4. Token Validation & Refresh

- Token is validated on every API request by backend
- If invalid/expired → 401 response → interceptor clears auth → redirects to login
- No automatic refresh implemented (backend handles token expiration)

### Protected Routes

```javascript
// ProtectedRoute.jsx
export function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth()
    
    if (isLoading) return <div>Loading...</div>
    if (!isAuthenticated) return <Navigate to="/login" replace />
    
    return children
}
```

### Logout Flow

```javascript
async function handleLogout() {
    try {
        await logout()  // Calls API + clears Redux
        authLogout()    // Clears AuthContext + localStorage
        navigate('/login')
    } catch (err) {
        // Even if API fails, clear local auth
        authLogout()
        navigate('/login')
    }
}
```

---

## State Management

### Dual State Management

The app uses **both Redux and React Context**:

1. **Redux** (Legacy)
   - Used for backward compatibility
   - Manages user state in `userModule`
   - Actions: `login()`, `signup()`, `logout()` dispatch to Redux

2. **React Context** (Primary)
   - `AuthContext` is the **source of truth** for authentication
   - Manages: `token`, `user`, `isAuthenticated`, `isLoading`
   - Used by all components via `useAuth()` hook

### Why Both?

- Redux was kept for compatibility with existing code
- Context API is simpler and sufficient for auth state
- Future: Could remove Redux and use only Context

### State Flow Example

```javascript
// 1. User logs in
const response = await signup(credentials)

// 2. Action dispatches to Redux (legacy)
store.dispatch({ type: SET_USER, user: response.user })

// 3. AuthContext stores token (primary)
authLogin(response.token, response.user)

// 4. Components read from Context
const { user, isAuthenticated } = useAuth()
```

---

## Routing & Protected Routes

### Route Structure

```javascript
// RootCmp.jsx
<Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginSignup />} />
    <Route
        path="/onboarding"
        element={
            <ProtectedRoute>
                <OnboardingGuard>
                    <Onboarding />
                </OnboardingGuard>
            </ProtectedRoute>
        }
    />
    <Route
        path="/dashboard"
        element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        }
    />
</Routes>
```

### Route Protection Layers

1. **ProtectedRoute**
   - Checks if user is authenticated
   - Redirects to `/login` if not

2. **OnboardingGuard**
   - Checks if onboarding is completed
   - If completed → redirects to `/dashboard`
   - If not → allows access to `/onboarding`

### Navigation Flow

```
Login/Signup
    ↓
Check Preferences
    ↓
┌─────────────┬─────────────┐
│ Completed   │ Not Completed│
│ Onboarding  │ Onboarding   │
    ↓              ↓
Dashboard    Onboarding
                ↓
            Dashboard
```

---

## Key Components

### 1. LoginSignup (`pages/LoginSignup.jsx`)

**Purpose**: Combined login and signup form with video background

**Key Features**:
- Toggle between login/signup modes
- Dynamic styling based on mode (red/yellow for login, blue for signup)
- Video background with overlay
- Form validation
- Loader animation when switching modes

**State**:
- `isSignup`: Boolean to toggle form mode
- `credentials`: Form data (email, password, firstName, lastName)
- `errorMsg`: Error message to display
- `isSwitching`: Controls loader visibility

### 2. Onboarding (`pages/Onboarding.jsx`)

**Purpose**: Multi-step questionnaire to collect user preferences

**Steps**:
1. **Assets**: Multi-select crypto assets (up to 10)
2. **Investor Type**: Single select (HODLer, Day Trader, etc.)
3. **Content Types**: Multi-select content preferences (up to 6)

**Features**:
- Clickable step navigation
- Step validation
- Progress indicator
- Video background
- Loader after completion

**State Management**:
- `currentStep`: Current step number (1-3)
- `formData`: Collected preferences
- `errors`: Validation errors per step

### 3. Dashboard (`pages/Dashboard.jsx`)

**Purpose**: Main dashboard displaying personalized content

**Sections**:
1. **CoinPricesSection**: Real-time prices for user's selected assets
2. **MarketNewsSection**: News articles about preferred coins
3. **AIInsightSection**: AI-generated insights
4. **MemeSection**: Random crypto memes

**Features**:
- Loads data on mount
- Loading state with Loader component
- Error handling with retry button
- Logout functionality

### 4. Dashboard Sections

#### CoinPricesSection
- Displays coin symbol, price, 24h change, 7d change
- Color-coded changes (green for positive, red for negative)
- Responsive grid layout

#### MarketNewsSection
- Lists news articles with title, source, date, votes
- Clickable links to external articles
- Shows related currencies

#### AIInsightSection
- Displays AI-generated insight text
- Shows model badge if not fallback
- Gradient background styling

#### MemeSection
- Randomly selects from 8 local meme images
- Uses `useMemo` to ensure one selection per mount
- Handles image load errors gracefully

### 5. Loader (`cmps/Loader.jsx`)

**Purpose**: Full-screen loading animation

**Usage**:
- Login/Signup mode switching (5 seconds)
- Onboarding completion (5 seconds)
- Dashboard loading

**Implementation**:
- Full-screen overlay with backdrop blur
- Centered GIF animation
- Fade-in animation

---

## Services & Utilities

### 1. Storage Service (`services/storage.service.js`)

**Purpose**: Centralized storage abstraction

**Methods**:
```javascript
// LocalStorage
storageService.save(key, value)
storageService.load(key)
storageService.remove(key)
storageService.clear()

// SessionStorage
storageService.saveSession(key, value)
storageService.loadSession(key)
storageService.removeSession(key)
storageService.clearSession()
```

**Features**:
- Automatic JSON serialization/parsing
- Error handling (silent in production)
- Type detection (string vs object)

### 2. User Service (`services/user/user.service.remote.js`)

**Purpose**: User authentication API calls

**Methods**:
- `login(userCred)`: Returns `{ token, user }`
- `signup(userCred)`: Returns `{ token, user }`
- `logout()`: Clears storage and calls API
- `getLoggedinUser()`: Gets user from sessionStorage

### 3. Preferences Service (`services/preferences.service.js`)

**Purpose**: User preferences API calls

**Methods**:
- `getPreferences()`: Returns preferences or `{ preferences: null, completedOnboarding: false }`
- `savePreferences(preferences)`: Saves onboarding data
- `updatePreferences(preferences)`: Updates existing preferences

**Error Handling**:
- 404: Returns null preferences (user hasn't completed onboarding)
- 401: Throws error (handled by interceptor)
- 400: Validation errors from backend

### 4. Dashboard Service (`services/dashboard.service.js`)

**Purpose**: Dashboard data API calls

**Methods**:
- `getDashboard()`: Returns complete dashboard data
  - `coinPrices`: Array of coin objects
  - `marketNews`: Array of news articles
  - `aiInsight`: Insight text and metadata
  - `meme`: Meme URL and metadata

### 5. Event Bus Service (`services/event-bus.service.js`)

**Purpose**: Global event system for toast notifications

**Usage**:
```javascript
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

showSuccessMsg('Welcome back!')
showErrorMsg('Something went wrong')
```

**Implementation**:
- Event emitter pattern
- Subscribers listen for `SHOW_MSG` events
- `UserMsg` component displays toasts

---

## Common Interview Questions

### 1. How do you handle HTTP requests in this project?

**Answer**: 
- We use Axios with a centralized `httpService` wrapper
- Request interceptor automatically adds JWT token to all requests
- Response interceptor handles 401 errors globally by clearing auth and redirecting
- Base URL switches between dev (`localhost:3030/api`) and production (`/api/`)
- All services use `httpService` methods (get, post, put, delete)

### 2. Explain the authentication flow.

**Answer**:
1. User submits login/signup form
2. API returns `{ token, user }`
3. Token and user stored in localStorage via `storageService`
4. `AuthContext` updates state (isAuthenticated = true)
5. Token automatically added to all future requests via Axios interceptor
6. If token invalid/expired → 401 response → interceptor clears auth → redirects to login

### 3. How do you manage state in this application?

**Answer**:
- **React Context** (primary): Manages authentication state (token, user, isAuthenticated)
- **Redux** (legacy): Kept for backward compatibility, manages user state
- Context is the source of truth for auth; Redux is synced but not primary
- Components use `useAuth()` hook to access auth state
- Future: Could remove Redux and use only Context

### 4. How are protected routes implemented?

**Answer**:
- `ProtectedRoute` component wraps protected routes
- Checks `isAuthenticated` from `AuthContext`
- If not authenticated → redirects to `/login`
- `OnboardingGuard` adds extra check: if onboarding completed → redirects to `/dashboard`
- Both use React Router's `Navigate` component for redirects

### 5. How do you handle errors in API calls?

**Answer**:
- **Global**: 401 errors handled by Axios response interceptor
- **Service Level**: Try/catch blocks with specific error messages
- **Component Level**: Error state displayed to user with retry options
- **User Feedback**: Toast notifications via `event-bus.service`
- Production: Console errors only in development mode

### 6. Explain the onboarding flow.

**Answer**:
1. After login/signup, check preferences via API
2. If `completedOnboarding === false` → navigate to `/onboarding`
3. User completes 3 steps:
   - Select crypto assets (multi-select, max 10)
   - Choose investor type (single select)
   - Select content types (multi-select, max 6)
4. Each step validates before allowing continue
5. On submit, save preferences via API
6. Show loader for 5 seconds, then navigate to dashboard

### 7. How is the dashboard personalized?

**Answer**:
- Backend uses user preferences to filter/select content:
  - **Coin Prices**: Only shows coins from `interestedAssets`
  - **News**: Filtered by preferred coins
  - **AI Insights**: Tailored to `investorType`
  - **Memes**: Random selection from local images (frontend)
- All data fetched from single `/api/dashboard` endpoint
- Frontend displays data in 4 sections

### 8. How do you handle loading states?

**Answer**:
- **Loader Component**: Full-screen overlay with GIF animation
- Used in 3 scenarios:
  1. Login/Signup mode switching (5 seconds)
  2. Onboarding completion (5 seconds)
  3. Dashboard data loading (until API responds)
- Components use `loading` state to conditionally render Loader
- Error states show retry buttons instead of loaders

### 9. What's the difference between localStorage and sessionStorage?

**Answer**:
- **localStorage**: Persists across browser sessions (used for auth token)
- **sessionStorage**: Cleared when tab closes (used for logged-in user data)
- Both abstracted by `storageService` with same API
- JWT token stored in localStorage (persists after refresh)
- User data stored in both (localStorage for token, sessionStorage for user object)

### 10. How do you ensure code quality and organization?

**Answer**:
- **Separation of Concerns**: Services handle API, components handle UI
- **Centralized Services**: HTTP, storage, events all abstracted
- **Error Handling**: Consistent try/catch with user-friendly messages
- **Production Safety**: Console logs only in development mode
- **Clean Code**: Removed unused files, fixed broken imports
- **Type Safety**: Consistent data structures, validation

### 11. How would you add a new feature (e.g., user settings page)?

**Answer**:
1. Create new page component in `pages/Settings.jsx`
2. Add route in `RootCmp.jsx` (wrap with `ProtectedRoute` if needed)
3. Create service method in appropriate service file (or new service)
4. Add API endpoint call using `httpService`
5. Handle loading/error states
6. Style with existing SCSS variables/patterns
7. Test authentication flow (token automatically added)

### 12. How do you handle form validation?

**Answer**:
- **Client-side**: Validation in component before API call
  - Required fields checked
  - Array length limits (max 10 assets, max 6 content types)
  - Error messages displayed inline
- **Server-side**: Backend validates and returns 400 with specific messages
- **User Feedback**: Errors shown via toast notifications and inline messages

### 13. Explain the video background implementation.

**Answer**:
- HTML5 `<video>` element with autoplay, loop, muted
- Multiple source formats (mp4, webm) for browser compatibility
- CSS overlay with gradient for readability
- Dynamic styling: Login (red/yellow gradient), Signup (blue gradient)
- Video files in `public/videos/` folder

### 14. How do you handle responsive design?

**Answer**:
- **SCSS Media Queries**: Breakpoints for mobile/tablet/desktop
- **Flexbox/Grid**: Responsive layouts (coins grid, news list)
- **Mobile-first**: Base styles for mobile, enhanced for larger screens
- **Typography**: Responsive font sizes
- **Spacing**: Consistent spacing system using variables

### 15. What would you improve in this codebase?

**Answer**:
- **Remove Redux**: Use only Context API for state
- **Add TypeScript**: Type safety for better maintainability
- **Error Boundaries**: React error boundaries for better error handling
- **Testing**: Unit tests for services, integration tests for components
- **Code Splitting**: Lazy load routes for better performance
- **Token Refresh**: Implement automatic token refresh before expiration
- **Caching**: Cache dashboard data to reduce API calls
- **Accessibility**: Add ARIA labels, keyboard navigation

---

## Quick Reference

### Key Files to Know

| File | Purpose |
|------|---------|
| `src/services/http.service.js` | HTTP client with interceptors |
| `src/contexts/AuthContext.jsx` | Authentication state management |
| `src/cmps/ProtectedRoute.jsx` | Route protection component |
| `src/services/storage.service.js` | Storage abstraction |
| `src/pages/Dashboard.jsx` | Main dashboard page |
| `src/services/preferences.service.js` | User preferences API |

### Important Concepts

- **JWT Tokens**: Stored in localStorage, added to requests automatically
- **Axios Interceptors**: Request (add token), Response (handle 401)
- **React Context**: Primary state management for auth
- **Protected Routes**: Components that check authentication
- **Service Layer**: All API calls abstracted in service files

### Common Patterns

1. **API Call Pattern**:
   ```javascript
   try {
       const response = await service.method()
       setData(response)
   } catch (err) {
       showErrorMsg(err.message)
   }
   ```

2. **Protected Component Pattern**:
   ```javascript
   <ProtectedRoute>
       <YourComponent />
   </ProtectedRoute>
   ```

3. **Auth Hook Pattern**:
   ```javascript
   const { user, isAuthenticated, logout } = useAuth()
   ```

---

## Tips for Interview

1. **Know the Flow**: Be able to explain user journey from login to dashboard
2. **HTTP Details**: Understand interceptors, error handling, token injection
3. **State Management**: Explain why both Redux and Context, when to use each
4. **Code Organization**: Explain service layer, component structure
5. **Error Handling**: Show understanding of global vs local error handling
6. **Best Practices**: Production-safe code, clean architecture, separation of concerns

---

**Good luck with your interview!** 🚀

