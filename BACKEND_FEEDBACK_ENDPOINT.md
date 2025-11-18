# Backend Feedback Endpoint Implementation Guide

## Overview
The frontend now has a complete feedback system with thumbs up/down buttons on all dashboard sections. The backend needs to implement endpoints to store and retrieve user feedback.

---

## Required Endpoints

### 1. Submit Feedback
**Endpoint**: `POST /api/user/feedback`

**Authentication**: Required (JWT token in Authorization header)

**Request Body**:
```json
{
  "sectionType": "coinPrices",  // or "marketNews", "aiInsight", "meme"
  "vote": "up",                  // or "down"
  "metadata": {},                 // Optional: { coinId: "bitcoin", articleId: "news123" }
  "timestamp": "2025-01-16T20:00:00.000Z"
}
```

**Field Requirements**:
- `sectionType`: String, required, must be one of:
  - `"coinPrices"`
  - `"marketNews"`
  - `"aiInsight"`
  - `"meme"`
- `vote`: String, required, must be `"up"` or `"down"`
- `metadata`: Object, optional, can contain any additional context
- `timestamp`: String (ISO 8601), optional (frontend sends it)

**Success Response (200)**:
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

**Error Responses**:
- `400 Bad Request`: Invalid sectionType or vote value
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

---

### 2. Get Feedback History (Optional)
**Endpoint**: `GET /api/user/feedback`

**Authentication**: Required (JWT token)

**Query Parameters** (optional):
- `sectionType`: Filter by section type
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset

**Success Response (200)**:
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
    },
    {
      "id": "feedback456",
      "userId": "user123",
      "sectionType": "marketNews",
      "vote": "down",
      "metadata": {},
      "createdAt": "2025-01-16T19:00:00.000Z"
    }
  ],
  "count": 2
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found

---

## Database Schema

### Feedback Table
```sql
CREATE TABLE feedback (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  section_type VARCHAR(50) NOT NULL,
  vote VARCHAR(10) NOT NULL,  -- 'up' or 'down'
  metadata JSONB,            -- Optional metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_section_type (section_type),
  INDEX idx_created_at (created_at)
);
```

**MongoDB Schema** (if using MongoDB):
```javascript
{
  _id: ObjectId,
  userId: String,        // Reference to user
  sectionType: String,    // 'coinPrices', 'marketNews', 'aiInsight', 'meme'
  vote: String,          // 'up' or 'down'
  metadata: Object,      // Optional
  createdAt: Date
}
```

**Indexes**:
- `userId` (for quick user lookup)
- `sectionType` (for analytics)
- `createdAt` (for time-based queries)

---

## Implementation Example (Node.js/Express)

```javascript
// routes/user.routes.js or feedback.routes.js

router.post('/user/feedback', authenticateToken, async (req, res) => {
  try {
    const { sectionType, vote, metadata, timestamp } = req.body;
    const userId = req.user.id; // From JWT token

    // Validation
    const validSectionTypes = ['coinPrices', 'marketNews', 'aiInsight', 'meme'];
    if (!validSectionTypes.includes(sectionType)) {
      return res.status(400).json({
        message: `Invalid sectionType. Must be one of: ${validSectionTypes.join(', ')}`
      });
    }

    if (vote !== 'up' && vote !== 'down') {
      return res.status(400).json({
        message: 'Invalid vote. Must be "up" or "down"'
      });
    }

    // Save to database
    const feedback = {
      id: generateId(), // or use UUID
      userId,
      sectionType,
      vote,
      metadata: metadata || {},
      createdAt: timestamp ? new Date(timestamp) : new Date()
    };

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
```

---

## Frontend Integration

The frontend is already implemented and will call:
- `POST /api/user/feedback` when user clicks thumbs up/down
- `GET /api/user/feedback` (optional) to show previous votes

**Frontend Service**: `src/services/feedback.service.js`
**Frontend Component**: `src/cmps/FeedbackButtons.jsx`

---

## Testing Checklist

Before marking as complete, verify:

- [ ] POST `/api/user/feedback` accepts valid requests
- [ ] POST `/api/user/feedback` rejects invalid sectionType
- [ ] POST `/api/user/feedback` rejects invalid vote
- [ ] POST `/api/user/feedback` requires authentication (401 if no token)
- [ ] POST `/api/user/feedback` saves feedback to database
- [ ] GET `/api/user/feedback` returns user's feedback history
- [ ] GET `/api/user/feedback` filters by sectionType if provided
- [ ] Database indexes are created for performance
- [ ] Error handling works correctly

---

## Analytics Use Cases

Once feedback is stored, you can:

1. **Content Personalization**: 
   - Show more content types that users thumbs up
   - Reduce content types that users thumbs down

2. **A/B Testing**:
   - Test different AI models based on feedback
   - Test different news sources

3. **Recommendation Engine**:
   - Collaborative filtering: "Users who liked X also liked Y"
   - Preference learning: Adjust dashboard based on feedback patterns

4. **Quality Metrics**:
   - Track which sections get most positive feedback
   - Identify content that needs improvement

---

## Summary

**What's Needed**:
1. ✅ Database table/schema for feedback
2. ✅ POST `/api/user/feedback` endpoint
3. ✅ GET `/api/user/feedback` endpoint (optional but recommended)
4. ✅ Validation for sectionType and vote
5. ✅ JWT authentication on both endpoints

**Frontend Status**: ✅ **COMPLETE** - Ready to use once backend is implemented

**Time Estimate**: 1-2 hours for backend implementation

---

## Questions?

If you encounter any issues:
- Check that JWT token is being sent in Authorization header
- Verify request body matches the required format
- Ensure database schema is correct
- Test with Postman before frontend integration

Good luck! 🚀

