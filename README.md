# Moveo AI Crypto Advisor – Frontend

Personalized crypto investor dashboard built with React + Vite. Features real-time coin prices, market news, AI insights, and crypto memes tailored to each user's preferences.

## Features

- **Authentication**: JWT-based login/signup with protected routes
- **Onboarding**: Multi-step questionnaire to personalize user experience
- **Dashboard**: 
  - Real-time coin prices (CoinGecko API)
  - Market news (CryptoPanic API)
  - AI-generated insights (personalized)
  - Crypto memes (random, personalized)
- **Video Backgrounds**: Dynamic video backgrounds on login and onboarding pages
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **React Router DOM** - Client-side routing
- **Redux** - State management
- **Axios** - HTTP client
- **Sass** - CSS preprocessing
- **React Context API** - Authentication state

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:3030/api
```

**Optional:**
- `VITE_OPENROUTER_API_KEY` - For AI insights (if calling from frontend)
- `VITE_HF_API_KEY` - Alternative AI provider

## Scripts

- **npm run dev**: Start development server
- **npm run build**: Build for production
- **npm run preview**: Preview production build

## Project Structure

```
src/
├── assets/
│   └── styles/
│       └── main.scss          # Global styles
├── cmps/
│   ├── dashboard/
│   │   ├── CoinPricesSection.jsx
│   │   ├── MarketNewsSection.jsx
│   │   ├── AIInsightSection.jsx
│   │   └── MemeSection.jsx
│   ├── ProtectedRoute.jsx
│   ├── OnboardingGuard.jsx
│   └── UserMsg.jsx
├── contexts/
│   └── AuthContext.jsx        # JWT authentication
├── customHooks/
│   └── useForm.js
├── pages/
│   ├── LoginSignup.jsx
│   ├── Onboarding.jsx
│   └── Dashboard.jsx
├── services/
│   ├── dashboard.service.js
│   ├── preferences.service.js
│   ├── user/
│   ├── http.service.js
│   ├── storage.service.js
│   └── event-bus.service.js
├── store/
│   ├── store.js
│   ├── user.reducer.js
│   └── user.actions.js
└── RootCmp.jsx
```

## API Integration

### Backend Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/user/preferences` - Get user preferences
- `POST /api/user/preferences` - Save user preferences
- `GET /api/dashboard` - Get personalized dashboard data

### Authentication

All protected endpoints require JWT token in `Authorization: Bearer {token}` header. Token is automatically added by `httpService`.

## User Flow

1. **Login/Signup** → User authenticates
2. **Onboarding** → User answers 3 questions about preferences
3. **Dashboard** → Personalized content based on preferences:
   - Coin prices for selected assets
   - News articles about preferred coins
   - AI insights tailored to investor type
   - Random memes matching interests

## Video Assets

Place video files in `public/videos/`:
- `login-bg.mp4` - Login page background (red/yellow trading theme)
- `onboarding-bg.mp4` - Onboarding page background

## Styling

- **Design System**: Professional, minimal, pixel-perfect
- **Colors**: Classic palette with primary blue accent
- **Typography**: System fonts for optimal performance
- **Responsive**: Mobile-first approach with breakpoints

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Build

```bash
npm run build
```

Output: `dist/` folder ready for static hosting

## Development Notes

- JWT tokens stored in localStorage via `storageService`
- Protected routes use `ProtectedRoute` component
- Onboarding status checked on login
- All API calls include automatic error handling
- Video backgrounds autoplay (muted, looped)

## Future Enhancements

- [ ] User feedback system (thumbs up/down on widgets)
- [ ] Widget customization (drag & drop dashboard)
- [ ] Real-time price updates (WebSocket)
- [ ] Advanced charting for coin prices
- [ ] User settings page

## License

Private project - Moveo AI Crypto Advisor
