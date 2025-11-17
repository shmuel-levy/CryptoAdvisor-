# Backend Verification Checklist - Moveo AI Crypto Advisor

## Overview
This document verifies that all backend endpoints and features are correctly implemented to work with the frontend. Please check each item and confirm completion.

---

## ✅ Authentication Endpoints

### 1. POST /api/auth/login
**Status**: ⬜ Check Required

**Expected Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

**Error Responses**:
- 400: Invalid credentials → `{ "message": "Invalid email or password" }`
- 401: Unauthorized → `{ "message": "Authentication failed" }`

**Verification**:
- [ ] Endpoint exists and is accessible
- [ ] Returns token and user object
- [ ] Token is valid JWT format
- [ ] User object contains required fields (id, email, firstName, lastName)
- [ ] Error messages are user-friendly

---

### 2. POST /api/auth/signup
**Status**: ⬜ Check Required

**Expected Request**:
```json
{
  "email": "newuser@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "password": "securePassword123",
  "profileImg": "",
  "role": "user"
}
```

**Expected Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "xyz789",
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "user"
  }
}
```

**Error Responses**:
- 400: Validation error → `{ "message": "Email already exists" }`
- 400: Missing fields → `{ "message": "Email and password are required" }`

**Verification**:
- [ ] Endpoint exists and is accessible
- [ ] Validates email format
- [ ] Checks for duplicate emails
- [ ] Hashes password before storing
- [ ] Returns token and user object
- [ ] Creates user in database

---

### 3. POST /api/auth/logout
**Status**: ⬜ Check Required

**Expected Request**: 
- Headers: `Authorization: Bearer {token}`

**Expected Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

**Verification**:
- [ ] Endpoint exists
- [ ] Requires authentication (JWT token)
- [ ] Returns success message
- [ ] Optionally invalidates token (if using token blacklist)

---

## ✅ User Preferences Endpoints

### 4. GET /api/user/preferences
**Status**: ⬜ Check Required

**Expected Request**:
- Headers: `Authorization: Bearer {token}`

**Expected Response** (200 OK) - User has preferences:
```json
{
  "preferences": {
    "interestedAssets": ["BTC", "ETH", "SOL"],
    "investorType": "HODLer",
    "contentTypes": ["Market News", "Charts", "Social"],
    "completedOnboarding": true,
    "updatedAt": "2025-01-16T20:00:00.000Z"
  }
}
```

**Expected Response** (200 OK) - User has no preferences:
```json
{
  "preferences": null,
  "completedOnboarding": false
}
```

**Error Responses**:
- 401: Missing/invalid token → `{ "message": "Unauthorized" }`
- 404: User not found → `{ "message": "User not found" }`

**Verification**:
- [ ] Endpoint exists and requires authentication
- [ ] Returns preferences if they exist
- [ ] Returns `{ preferences: null, completedOnboarding: false }` if no preferences
- [ ] Handles missing user gracefully

---

### 5. POST /api/user/preferences
**Status**: ⬜ Check Required

**Expected Request**:
- Headers: `Authorization: Bearer {token}`
- Body:
```json
{
  "interestedAssets": ["BTC", "ETH", "SOL"],
  "investorType": "HODLer",
  "contentTypes": ["Market News", "Charts", "Social", "Fun"]
}
```

**Validation Rules**:
- `interestedAssets`: Array, required, min 1 item, max 10 items
- `investorType`: String, required, must be one of: "HODLer", "Day Trader", "NFT Collector", "DeFi Enthusiast", "Swing Trader"
- `contentTypes`: Array, required, min 1 item, max 6 items, valid options: "Market News", "Charts", "Social", "Fun", "Technical Analysis", "Memes"

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Preferences saved successfully",
  "preferences": {
    "interestedAssets": ["BTC", "ETH", "SOL"],
    "investorType": "HODLer",
    "contentTypes": ["Market News", "Charts", "Social", "Fun"],
    "completedOnboarding": true,
    "updatedAt": "2025-01-16T20:00:00.000Z"
  }
}
```

**Error Responses**:
- 400: Validation error → `{ "message": "Validation error: interestedAssets is required, investorType must be one of: ..." }`
- 401: Missing/invalid token → `{ "message": "Unauthorized" }`
- 404: User not found → `{ "message": "User not found" }`

**Verification**:
- [ ] Endpoint exists and requires authentication
- [ ] Validates all fields according to rules above
- [ ] Sets `completedOnboarding: true` when saving
- [ ] Saves preferences to database
- [ ] Returns saved preferences with updated timestamp
- [ ] Returns clear validation error messages

---

### 6. PUT /api/user/preferences
**Status**: ⬜ Check Required

**Expected Request**: Same as POST

**Expected Response**: Same as POST

**Verification**:
- [ ] Endpoint exists and requires authentication
- [ ] Updates existing preferences
- [ ] Same validation as POST endpoint

---

## ✅ Dashboard Endpoint

### 7. GET /api/dashboard
**Status**: ⬜ Check Required

**Expected Request**:
- Headers: `Authorization: Bearer {token}`

**Expected Response** (200 OK):
```json
{
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "coinPrices": {
    "coins": [
      {
        "id": "bitcoin",
        "symbol": "BTC",
        "price": 43250.50,
        "change24h": 2.5,
        "change7d": -1.2
      },
      {
        "id": "ethereum",
        "symbol": "ETH",
        "price": 2650.75,
        "change24h": 1.8,
        "change7d": 3.4
      }
    ],
    "updatedAt": "2025-01-16T20:30:00.000Z"
  },
  "marketNews": {
    "news": [
      {
        "id": "news1",
        "title": "Bitcoin Reaches New High",
        "url": "https://example.com/news/bitcoin-high",
        "source": "CoinDesk",
        "publishedAt": "2025-01-16T19:00:00.000Z",
        "votes": 42,
        "currencies": ["BTC"]
      }
    ],
    "count": 3,
    "updatedAt": "2025-01-16T20:30:00.000Z"
  },
  "aiInsight": {
    "insight": "Based on your HODLer profile, the current market shows strong fundamentals for long-term holding...",
    "generatedAt": "2025-01-16T20:00:00.000Z",
    "model": "gpt-4" // or "fallback" if AI service unavailable
  },
  "meme": {
    "url": "https://example.com/meme.jpg",
    "title": "HODL Strong",
    "description": "Diamond hands never fold",
    "source": "CryptoAdvisor",
    "fetchedAt": "2025-01-16T20:00:00.000Z"
  }
}
```

**Personalization Requirements**:
- **Coin Prices**: Only include coins from user's `interestedAssets` preferences
- **Market News**: Filter news articles related to user's preferred coins
- **AI Insight**: Tailor insight text based on user's `investorType`
- **Meme**: Random selection (can be static or from API)

**Error Responses**:
- 401: Missing/invalid token → `{ "message": "Unauthorized" }`
- 404: User not found → `{ "message": "User not found" }`
- 500: Server error → `{ "message": "Failed to load dashboard data" }`

**Verification**:
- [ ] Endpoint exists and requires authentication
- [ ] Returns all 4 sections (coinPrices, marketNews, aiInsight, meme)
- [ ] Personalizes content based on user preferences
- [ ] Handles missing preferences gracefully (defaults to BTC/ETH)
- [ ] Coin prices are real-time from CoinGecko API
- [ ] News articles are from CryptoPanic API
- [ ] AI insights are personalized to investor type
- [ ] All timestamps are in ISO format
- [ ] Handles API failures gracefully (fallback content)

---

## ✅ JWT Token Implementation

### Token Structure
**Status**: ⬜ Check Required

**Verification**:
- [ ] Tokens are valid JWT format (starts with "eyJ")
- [ ] Tokens contain user ID in payload
- [ ] Tokens have expiration time (recommended: 24 hours)
- [ ] Tokens are signed with secure secret key
- [ ] Token validation middleware checks signature and expiration

### Token in Requests
**Status**: ⬜ Check Required

**Verification**:
- [ ] All protected endpoints check for `Authorization: Bearer {token}` header
- [ ] Missing token returns 401 Unauthorized
- [ ] Invalid/expired token returns 401 Unauthorized
- [ ] Token is extracted from header correctly

---

## ✅ Error Handling

### Standard Error Format
**Status**: ⬜ Check Required

**Expected Error Response Format**:
```json
{
  "message": "User-friendly error message"
}
```

**Verification**:
- [ ] All errors return consistent format
- [ ] Error messages are user-friendly (not technical)
- [ ] 400 errors include validation details
- [ ] 401 errors clear and actionable
- [ ] 500 errors don't expose internal details

---

## ✅ CORS Configuration

**Status**: ⬜ Check Required

**Verification**:
- [ ] CORS is enabled for frontend origin (`http://localhost:5173` for dev)
- [ ] CORS allows credentials (`withCredentials: true` in frontend)
- [ ] CORS allows necessary headers (Authorization, Content-Type)
- [ ] Production CORS configured for production frontend URL

---

## ✅ Database Schema

### User Model
**Status**: ⬜ Check Required

**Required Fields**:
- `id` (or `_id`)
- `email` (unique, required)
- `firstName` (required)
- `lastName` (required)
- `password` (hashed, required)
- `role` (default: "user")
- `createdAt`
- `updatedAt`

**Verification**:
- [ ] User model exists with all required fields
- [ ] Email is unique and indexed
- [ ] Password is hashed (bcrypt/argon2)
- [ ] Timestamps are automatically managed

### Preferences Model
**Status**: ⬜ Check Required

**Required Fields**:
- `userId` (reference to User)
- `interestedAssets` (array of strings)
- `investorType` (string)
- `contentTypes` (array of strings)
- `completedOnboarding` (boolean, default: false)
- `createdAt`
- `updatedAt`

**Verification**:
- [ ] Preferences model exists
- [ ] Linked to User model (one-to-one relationship)
- [ ] Arrays are stored correctly
- [ ] `completedOnboarding` defaults to false

---

## ✅ API Integration

### CoinGecko API
**Status**: ⬜ Check Required

**Verification**:
- [ ] CoinGecko API is integrated for coin prices
- [ ] Handles rate limits gracefully
- [ ] Caches responses appropriately
- [ ] Maps coin symbols to CoinGecko IDs correctly
- [ ] Calculates 24h and 7d changes correctly

### CryptoPanic API
**Status**: ⬜ Check Required

**Verification**:
- [ ] CryptoPanic API is integrated for news
- [ ] Filters news by user's preferred coins
- [ ] Handles API failures gracefully
- [ ] Limits number of articles returned (3-5 recommended)

### AI Service (OpenRouter/HuggingFace)
**Status**: ⬜ Check Required

**Verification**:
- [ ] AI service is integrated for insights
- [ ] Personalizes prompts based on investor type
- [ ] Has fallback content if AI service fails
- [ ] API keys are stored securely (environment variables)
- [ ] Handles rate limits and errors gracefully

---

## ✅ Security Checklist

**Status**: ⬜ Check Required

**Verification**:
- [ ] Passwords are hashed (never stored in plain text)
- [ ] JWT secret is stored in environment variables
- [ ] API keys are stored in environment variables
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitize user input)
- [ ] Rate limiting on authentication endpoints
- [ ] HTTPS in production

---

## ✅ Testing Checklist

**Status**: ⬜ Check Required

**Recommended Tests**:
- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials
- [ ] Test signup with new email
- [ ] Test signup with duplicate email
- [ ] Test preferences save/update
- [ ] Test dashboard with preferences
- [ ] Test dashboard without preferences
- [ ] Test protected routes with valid token
- [ ] Test protected routes with invalid token
- [ ] Test protected routes without token
- [ ] Test error handling for all endpoints

---

## ✅ Environment Variables

**Required Environment Variables**:
```env
# Server
PORT=3030
NODE_ENV=production

# Database
DATABASE_URL=mongodb://localhost:27017/cryptoadvisor
# OR for other databases:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=cryptoadvisor
# DB_USER=username
# DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=http://localhost:5173

# API Keys (Optional - if calling from backend)
COINGECKO_API_KEY=your-key-here
CRYPTOPANIC_API_KEY=your-key-here
OPENROUTER_API_KEY=your-key-here
HUGGINGFACE_API_KEY=your-key-here
```

**Verification**:
- [ ] All required environment variables are set
- [ ] JWT_SECRET is strong and secure
- [ ] Database connection string is correct
- [ ] CORS origin matches frontend URL
- [ ] API keys are set if using external APIs

---

## ✅ Performance Considerations

**Status**: ⬜ Check Required

**Verification**:
- [ ] Database queries are optimized (indexes on email, userId)
- [ ] API responses are cached where appropriate
- [ ] External API calls are rate-limited
- [ ] Dashboard endpoint response time < 2 seconds
- [ ] Database connection pooling configured

---

## Summary

After completing this checklist, please confirm:

- [ ] All endpoints are implemented and working
- [ ] All endpoints return expected response formats
- [ ] Error handling is consistent and user-friendly
- [ ] Security measures are in place
- [ ] Database schema is correct
- [ ] API integrations are working
- [ ] Environment variables are configured
- [ ] CORS is properly configured
- [ ] Testing has been completed

---

## Questions or Issues?

If any endpoint is missing or not working as expected, please note it here:

1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

---

**Once all items are checked, the backend is ready for frontend integration!** ✅

