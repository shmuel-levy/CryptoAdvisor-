# Backend Remaining Tasks - Final Implementation Guide

## Overview

The frontend is **100% complete** and ready for production. This document outlines the remaining backend tasks needed to complete the full-stack application.

---

## ✅ What's Already Working

### Completed Backend Features:
1. ✅ **Authentication** (`POST /api/auth/login`, `POST /api/auth/signup`)
   - JWT token generation
   - User registration and login
   - Password hashing

2. ✅ **User Preferences** (`GET /api/user/preferences`, `POST /api/user/preferences`)
   - Save onboarding preferences
   - Get user preferences
   - Check onboarding completion status

3. ✅ **Dashboard Data** (`GET /api/dashboard`)
   - Coin prices from CoinGecko API
   - Market news from CryptoPanic API
   - AI insights (OpenRouter/Hugging Face)
   - Memes (random selection)

4. ✅ **Database Schema**
   - Users table
   - Preferences table

---

## ⚠️ What's Missing

### 1. Feedback Endpoint (REQUIRED)

**Status**: Frontend is ready, backend needs implementation

**Endpoint**: `POST /api/user/feedback`

**Purpose**: Store user feedback (thumbs up/down) for each dashboard section

#### Request Format

**URL**: `POST /api/user/feedback`

**Headers**:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "sectionType": "coinPrices",  // Required: "coinPrices" | "marketNews" | "aiInsight" | "meme"
  "vote": "up",                  // Required: "up" | "down"
  "metadata": {},                 // Optional: Additional context (e.g., { coinId: "bitcoin" })
  "timestamp": "2025-01-16T20:00:00.000Z"  // Optional: ISO timestamp
}
```

#### Validation Rules

1. **sectionType**: 
   - Required
   - Must be one of: `"coinPrices"`, `"marketNews"`, `"aiInsight"`, `"meme"`
   - Return `400 Bad Request` if invalid

2. **vote**:
   - Required
   - Must be `"up"` or `"down"`
   - Return `400 Bad Request` if invalid

3. **Authentication**:
   - JWT token required in Authorization header
   - Return `401 Unauthorized` if missing or invalid

#### Success Response (200)

```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "feedback": {
    "id": "feedback123",
    "userId": "user123",
    "sectionType": "coinPrices",
    "vote": "up",
    "metadata": {},
    "createdAt": "2025-01-16T20:00:00.000Z"
  }
}
```

#### Error Responses

**400 Bad Request** (Invalid input):
```json
{
  "message": "Validation error: sectionType must be one of: coinPrices, marketNews, aiInsight, meme"
}
```

**401 Unauthorized** (Missing/invalid token):
```json
{
  "message": "Unauthorized. Please login."
}
```

**404 Not Found** (User not found):
```json
{
  "message": "User not found"
}
```

**500 Internal Server Error**:
```json
{
  "message": "Internal server error"
}
```

---

### 2. Database Schema for Feedback

#### PostgreSQL Schema

```sql
CREATE TABLE feedback (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  section_type VARCHAR(50) NOT NULL,
  vote VARCHAR(10) NOT NULL CHECK (vote IN ('up', 'down')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_section_type ON feedback(section_type);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);
CREATE INDEX idx_feedback_user_section ON feedback(user_id, section_type);
```

#### MongoDB Schema

```javascript
{
  _id: ObjectId,
  userId: String,        // Reference to user
  sectionType: String,    // 'coinPrices', 'marketNews', 'aiInsight', 'meme'
  vote: String,          // 'up' or 'down'
  metadata: Object,      // Optional additional context
  createdAt: Date
}

// Indexes
db.feedback.createIndex({ userId: 1 });
db.feedback.createIndex({ sectionType: 1 });
db.feedback.createIndex({ createdAt: -1 });
db.feedback.createIndex({ userId: 1, sectionType: 1 });
```

---

### 3. Implementation Example (Node.js/Express)

```javascript
// routes/user.routes.js or feedback.routes.js

const router = require('express').Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../db'); // Your database connection

// POST /api/user/feedback
router.post('/user/feedback', authenticateToken, async (req, res) => {
  try {
    const { sectionType, vote, metadata, timestamp } = req.body;
    const userId = req.user.id; // From JWT token

    // Validation
    const validSectionTypes = ['coinPrices', 'marketNews', 'aiInsight', 'meme'];
    if (!sectionType || !validSectionTypes.includes(sectionType)) {
      return res.status(400).json({
        message: `Invalid sectionType. Must be one of: ${validSectionTypes.join(', ')}`
      });
    }

    if (!vote || (vote !== 'up' && vote !== 'down')) {
      return res.status(400).json({
        message: 'Invalid vote. Must be "up" or "down"'
      });
    }

    // Create feedback object
    const feedback = {
      id: generateId(), // UUID or similar
      userId,
      sectionType,
      vote,
      metadata: metadata || {},
      createdAt: timestamp ? new Date(timestamp) : new Date()
    };

    // Save to database
    await db.feedback.insert(feedback);

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Optional: GET /api/user/feedback (for feedback history)
router.get('/user/feedback', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sectionType, limit = 50, offset = 0 } = req.query;

    const query = { userId };
    if (sectionType) {
      query.sectionType = sectionType;
    }

    const feedback = await db.feedback
      .find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const count = await db.feedback.count(query);

    res.status(200).json({
      feedback,
      count
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

module.exports = router;
```

---

### 4. Optional: Get Feedback History Endpoint

**Endpoint**: `GET /api/user/feedback`

**Purpose**: Retrieve user's feedback history (optional but recommended)

**Query Parameters**:
- `sectionType` (optional): Filter by section type
- `limit` (optional, default: 50): Number of results
- `offset` (optional, default: 0): Pagination offset

**Response**:
```json
{
  "feedback": [
    {
      "id": "feedback123",
      "userId": "user123",
      "sectionType": "coinPrices",
      "vote": "up",
      "metadata": {},
      "createdAt": "2025-01-16T20:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## Testing Checklist

Before marking as complete, verify:

- [ ] `POST /api/user/feedback` accepts valid requests
- [ ] `POST /api/user/feedback` rejects invalid `sectionType` (400)
- [ ] `POST /api/user/feedback` rejects invalid `vote` (400)
- [ ] `POST /api/user/feedback` requires authentication (401 if no token)
- [ ] `POST /api/user/feedback` saves feedback to database
- [ ] Database indexes are created for performance
- [ ] Error handling works correctly
- [ ] `GET /api/user/feedback` returns user's feedback history (optional)

---

## Frontend Integration Status

✅ **Frontend is 100% ready**:
- Feedback buttons implemented on all 4 dashboard sections
- Service layer ready (`src/services/feedback.service.js`)
- Error handling implemented
- Success/error toasts configured
- Visual feedback (active states) working

**What happens when backend is ready**:
- Frontend will automatically start sending feedback to backend
- Success toast will show: "Thank you for your feedback!"
- Buttons will highlight when active
- Errors will be displayed if backend returns errors

---

## API Endpoint Summary

### Required Endpoint

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| POST | `/api/user/feedback` | ✅ Required | ⚠️ **NEEDS IMPLEMENTATION** |

### Optional Endpoint

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | `/api/user/feedback` | ✅ Required | ⚠️ Optional but recommended |

---

## Quick Start Implementation

1. **Create database table/indexes** (see schema above)
2. **Add route handler** (see implementation example)
3. **Add validation** (sectionType and vote)
4. **Test with Postman** before frontend integration
5. **Deploy and test** with frontend

**Estimated Time**: 1-2 hours

---

## Questions?

If you encounter any issues:
- Check that JWT token is being sent in Authorization header
- Verify request body matches the required format
- Ensure database schema is correct
- Test with Postman before frontend integration
- See `BACKEND_FEEDBACK_ENDPOINT.md` for detailed documentation

---

## Summary

**What's Left**: 
- ✅ Implement `POST /api/user/feedback` endpoint
- ✅ Create feedback table in database
- ⚠️ Optional: Implement `GET /api/user/feedback` for history

**Frontend Status**: ✅ **100% COMPLETE** - Ready to use once backend is implemented

**Priority**: High - This is the only missing feature for full functionality

Good luck! 🚀

