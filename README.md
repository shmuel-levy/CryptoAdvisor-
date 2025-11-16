## Moveo AI Crypto Advisor – Frontend

Minimal React + Vite frontend for a personalized crypto investor dashboard.

### Scripts

- **npm run dev**: Start the dev server
- **npm run build**: Build for production
- **npm run preview**: Preview the production build

### Environment variables

Copy `.env.sample` to `.env.local` (or `.env`) and fill in:

- **VITE_API_BASE_URL**: Backend base URL (auth, preferences, feedback)
- **VITE_OPENROUTER_API_KEY** / **VITE_HF_API_KEY**: AI provider key (if used from frontend)
- **VITE_CG_BASE** / **VITE_CRYPTOPANIC_BASE**: Optional overrides for CoinGecko / CryptoPanic


