/**
 * JWT Authentication Test Script
 * 
 * Copy and paste this into your browser console (F12) after logging in
 * to quickly verify JWT authentication is working
 */

console.log('Starting JWT Authentication Test...\n')

// Test 1: Check token storage
console.log('Test 1: Token Storage')
const token = localStorage.getItem('authToken')
const user = JSON.parse(localStorage.getItem('authUser') || 'null')

if (token) {
  console.log('Token found:', token.substring(0, 20) + '...')
  console.log('   Length:', token.length)
  console.log('   Format:', token.startsWith('eyJ') ? 'Valid JWT format' : 'Invalid format')
} else {
  console.log('No token found in localStorage')
}

if (user) {
  console.log('User found:', user.email || user.firstName)
} else {
  console.log('No user found in localStorage')
}

// Test 2: Check AuthContext state
console.log('\nTest 2: AuthContext State')
// This would need to be run from a React component, but we can check storage
console.log('   Token in storage:', !!token)
console.log('   User in storage:', !!user)

// Test 3: Test API call with token
console.log('\nTest 3: API Request with Token')
if (token) {
  fetch('http://localhost:3030/api/user/preferences', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  .then(response => {
    console.log('   Status:', response.status)
    if (response.status === 200) {
      console.log('API request successful - token is valid!')
      return response.json()
    } else if (response.status === 401) {
      console.log('401 Unauthorized - token is invalid or expired')
      return null
    } else {
      console.log('Unexpected status:', response.status)
      return response.json().catch(() => null)
    }
  })
  .then(data => {
    if (data) {
      console.log('   Response:', data)
    }
  })
  .catch(error => {
    console.log('API Error:', error.message)
    console.log('   This might be normal if the endpoint doesn\'t exist yet')
  })
} else {
  console.log('Skipping API test - no token found')
}

// Test 4: Check axios interceptor (manual check)
console.log('\nTest 4: HTTP Service Configuration')
console.log('   Token will be added to requests via axios interceptor')
console.log('   Check Network tab in DevTools to verify Authorization header')

// Test 5: Protected routes
console.log('\nTest 5: Protected Routes')
const currentPath = window.location.pathname
const protectedRoutes = ['/dashboard', '/onboarding']
if (protectedRoutes.includes(currentPath)) {
  console.log('Currently on protected route:', currentPath)
  if (token) {
    console.log('   Has token - should be allowed')
  } else {
    console.log('   No token - should redirect to /login')
  }
} else {
  console.log('   Current route:', currentPath, '(not protected)')
}

// Summary
console.log('\nTest Summary:')
console.log('   Token exists:', !!token)
console.log('   User exists:', !!user)
console.log('   Token format valid:', token?.startsWith('eyJ'))

console.log('\nTest complete! Check the results above.')
console.log('Tip: Open Network tab and make a request to see Authorization header')

