# Frontend Verification Checklist - API Integration

## Purpose
Verify that the frontend is correctly configured to communicate with the deployed backend API.

---

## ✅ Pre-Verification: Environment Variables

### Check Vercel Environment Variables

1. **Go to Vercel Dashboard** → Your project → **Settings** → **Environment Variables**

2. **Verify `VITE_API_URL` exists**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://cryptoadvisor-backend.onrender.com/api`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development (all checked)

3. **If missing or wrong**:
   - Click "Add" or "Edit"
   - Set Key: `VITE_API_URL`
   - Set Value: `https://cryptoadvisor-backend.onrender.com/api`
   - Check all environments
   - **Save** → Vercel will auto-redeploy

---

## ✅ Step 1: Verify Frontend Code Configuration

### Check API Base URL in Code

**Location**: `src/services/http.service.js`

**Current Configuration** (✅ CORRECT):
```javascript
// Uses environment variable with fallback to localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030/api/'
```

**Verification**:
- [x] ✅ Code uses `import.meta.env.VITE_API_URL`
- [x] ✅ Has fallback to localhost for development
- [x] ✅ Not using hardcoded production URL
- [x] ✅ Not using relative path `/api/`

**Action Required**: ✅ **Already configured correctly!**

---

## ✅ Step 2: Test API Connection

### Test 1: Health Check

**In Browser Console** (F12):
```javascript
fetch('https://cryptoadvisor-backend.onrender.com/api/health')
  .then(res => res.json())
  .then(data => console.log('✅ Backend is working:', data))
  .catch(err => console.error('❌ Backend error:', err));
```

**Expected Result**:
```json
{ "status": "ok", "message": "Backend is running" }
```

**If Error**: Backend might be sleeping (Render free tier). Wait 30 seconds and try again.

---

### Test 2: Check Environment Variable in Browser

**In Browser Console** (on your deployed Vercel site):
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

**Expected Result**:
```
API URL: https://cryptoadvisor-backend.onrender.com/api
```

**If shows `undefined`**:
- Environment variable not set in Vercel
- Or variable name is wrong (must be `VITE_API_URL`)
- Or frontend not redeployed after adding variable

---

### Test 3: Network Tab Verification

1. **Open your deployed Vercel site**
2. **Open Browser DevTools** (F12)
3. **Go to Network tab**
4. **Try to signup or login**
5. **Check the API request**:

**✅ CORRECT** - Request goes to Render:
```
Request URL: https://cryptoadvisor-backend.onrender.com/api/auth/login
Status: 200 (or 400/401 for invalid credentials)
```

**❌ WRONG** - Request goes to Vercel:
```
Request URL: https://crypto-advisor-three.vercel.app/api/auth/login
Status: 404 (Not Found)
```

**If wrong**: Frontend is using relative path `/api/...` instead of environment variable.

---

## ✅ Step 3: Test Full User Flow

### Test Signup

1. **Go to signup page**
2. **Fill in form**:
   - Email: `test@example.com`
   - Password: `test123`
   - First Name: `Test`
   - Last Name: `User`
3. **Submit**
4. **Check Browser Console** (F12):
   - ✅ Should see successful API call to Render backend
   - ✅ Should receive token and user object
   - ✅ Should redirect to onboarding

**If Error**:
- Check Network tab for failed request
- Verify request URL is Render backend, not Vercel
- Check error message in console

---

### Test Login

1. **Go to login page**
2. **Use credentials from signup**
3. **Submit**
4. **Check Browser Console**:
   - ✅ API call to Render backend
   - ✅ Token received
   - ✅ User object received
   - ✅ Redirects to dashboard

---

### Test Onboarding

1. **After login/signup, complete onboarding**
2. **Fill preferences form**
3. **Submit**
4. **Check Browser Console**:
   - ✅ POST request to `https://cryptoadvisor-backend.onrender.com/api/user/preferences`
   - ✅ Status 200
   - ✅ Preferences saved successfully

---

### Test Dashboard

1. **After onboarding, view dashboard**
2. **Check Browser Console**:
   - ✅ GET request to `https://cryptoadvisor-backend.onrender.com/api/dashboard`
   - ✅ Status 200
   - ✅ Response includes:
     - `coinPrices` (array of coins)
     - `marketNews` (array of news articles)
     - `aiInsight` (insight text)
     - `meme` (meme URL and info)

**If sections are empty**:
- Check Network tab for API response
- Verify data structure matches frontend expectations
- Check for JavaScript errors in console

---

## ✅ Step 4: Verify CORS Configuration

### Check for CORS Errors

**In Browser Console**, look for errors like:
```
Access to fetch at 'https://cryptoadvisor-backend.onrender.com/api/...' 
from origin 'https://crypto-advisor-three.vercel.app' has been blocked by CORS policy
```

**If CORS Error**:
1. **Go to Render Dashboard** → Backend service
2. **Environment tab**
3. **Check `FRONTEND_URL`**:
   ```
   FRONTEND_URL=https://crypto-advisor-three.vercel.app
   ```
4. **Must match your Vercel URL exactly** (no trailing slash)
5. **Save** → Render will redeploy

---

## ✅ Step 5: Production Build Test

### Test Production Build Locally

1. **Build frontend**:
   ```bash
   npm run build
   ```

2. **Preview production build**:
   ```bash
   npm run preview
   ```

3. **Test in browser**:
   - Open `http://localhost:4173` (or port shown)
   - Try signup/login
   - Check Network tab - should call Render backend
   - Verify all features work

**If issues**:
- Check build output for errors
- Verify environment variable is used in built code
- Check for hardcoded URLs

---

## ✅ Step 6: Final Verification Checklist

### Environment Variables
- [ ] `VITE_API_URL` set in Vercel
- [ ] Value: `https://cryptoadvisor-backend.onrender.com/api`
- [ ] Enabled for Production, Preview, Development
- [ ] Frontend redeployed after adding variable

### Frontend Code
- [x] ✅ API base URL uses `import.meta.env.VITE_API_URL`
- [x] ✅ Not using relative paths like `/api/...`
- [x] ✅ Not hardcoded to `localhost:3030`
- [x] ✅ Fallback to localhost for development

### Backend Configuration
- [ ] `FRONTEND_URL` in Render matches Vercel URL
- [ ] Backend is deployed and running
- [ ] Health endpoint works: `https://cryptoadvisor-backend.onrender.com/api/health`

### Functionality
- [ ] Signup works
- [ ] Login works
- [ ] Onboarding saves preferences
- [ ] Dashboard loads all 4 sections
- [ ] No CORS errors
- [ ] No 404 errors
- [ ] No console errors (except browser extensions)

---

## 🔧 Common Issues & Fixes

### Issue 1: API calls go to Vercel instead of Render

**Symptom**: Network tab shows requests to `crypto-advisor-three.vercel.app/api/...`

**Fix**:
1. Check `VITE_API_URL` in Vercel environment variables
2. Verify frontend code uses `import.meta.env.VITE_API_URL` ✅ (Already fixed)
3. Redeploy frontend

---

### Issue 2: Environment variable is `undefined`

**Symptom**: `console.log(import.meta.env.VITE_API_URL)` shows `undefined`

**Fix**:
1. Variable name must be `VITE_API_URL` (Vite requires `VITE_` prefix)
2. Must be set in Vercel environment variables
3. Must redeploy after adding variable
4. Check variable is enabled for correct environment (Production/Preview)

---

### Issue 3: CORS errors

**Symptom**: Browser console shows CORS policy errors

**Fix**:
1. Update `FRONTEND_URL` in Render to match Vercel URL exactly
2. No trailing slash: `https://crypto-advisor-three.vercel.app` ✅
3. Not: `https://crypto-advisor-three.vercel.app/` ❌
4. Wait for Render to redeploy

---

### Issue 4: 404 errors on API calls

**Symptom**: API calls return 404 Not Found

**Possible Causes**:
1. **Wrong URL**: Check Network tab - should be Render backend
2. **Backend sleeping**: Render free tier spins down after 15 min inactivity
   - First request takes ~30 seconds (cold start)
   - Wait and try again
3. **Wrong endpoint path**: Should be `/api/auth/login`, not `/auth/login`

---

### Issue 5: Backend returns 401 Unauthorized

**Symptom**: Dashboard or protected routes return 401

**Fix**:
1. Check JWT token is being sent in Authorization header ✅ (Already configured)
2. Verify token format: `Authorization: Bearer <token>` ✅ (Already configured)
3. Check token is stored after login/signup
4. Verify token is included in all authenticated requests ✅ (Axios interceptor handles this)

---

## 📋 Quick Verification Script

**Run this in Browser Console** (on your deployed Vercel site):

```javascript
// Test 1: Check environment variable
console.log('1. API URL:', import.meta.env.VITE_API_URL);

// Test 2: Test backend health
fetch('https://cryptoadvisor-backend.onrender.com/api/health')
  .then(res => res.json())
  .then(data => {
    console.log('2. Backend Health:', data);
    console.log('✅ Backend is accessible');
  })
  .catch(err => {
    console.error('❌ Backend not accessible:', err);
  });

// Test 3: Check if API calls are going to correct URL
// (Run this, then try to signup/login and check Network tab)
console.log('3. Make a signup/login request and check Network tab');
console.log('   Expected URL: https://cryptoadvisor-backend.onrender.com/api/auth/login');
```

---

## ✅ Success Criteria

Your frontend is correctly configured when:

1. ✅ `VITE_API_URL` is set in Vercel
2. ✅ Frontend code uses `import.meta.env.VITE_API_URL` ✅ (Fixed)
3. ✅ Network tab shows API calls to Render backend
4. ✅ Signup works
5. ✅ Login works
6. ✅ Onboarding saves preferences
7. ✅ Dashboard loads all sections
8. ✅ No CORS errors
9. ✅ No 404 errors
10. ✅ No console errors

---

## 🚀 Next Steps After Verification

Once everything works:

1. **Test on mobile device** (responsive design)
2. **Test all user flows** (signup → onboarding → dashboard → logout)
3. **Check error handling** (invalid credentials, network errors)
4. **Verify feedback system** (if implemented)
5. **Test with slow network** (throttle in DevTools)

---

**If you encounter any issues not covered here, check the Network tab in DevTools for detailed error messages and request/response data.**

