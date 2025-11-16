import { httpService } from '../http.service'
import { storageService } from '../storage.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
	login,
	logout,
	signup,
	getUsers,
	getById,
	remove,
	update,
    getLoggedinUser,
}

function getUsers() {
	return httpService.get(`user`)
}

async function getById(userId) {
	const user = await httpService.get(`user/${userId}`)
	return user
}

function remove(userId) {
	return httpService.delete(`user/${userId}`)
}

async function update({ _id, score }) {
	const user = await httpService.put(`user/${_id}`, { _id, score })

	const loggedinUser = getLoggedinUser()
    if (loggedinUser._id === user._id) _saveLocalUser(user)

	return user
}

async function login(userCred) {
    // Send in backend format: {email, password}
    // Backend returns: { token, user }
	const response = await httpService.post('auth/login', {
        email: userCred.email,
        password: userCred.password
    })
    // Return both token and user for AuthContext
    return {
        token: response.token,
        user: response.user
    }
}

async function signup(userCred) {
    // Send in backend format: {email, firstName, lastName, profileImg, password, role}
    // Backend returns: { token, user }
    const response = await httpService.post('auth/signup', {
        email: userCred.email,
        firstName: userCred.firstName,
        lastName: userCred.lastName,
        profileImg: userCred.profileImg || '',
        password: userCred.password,
        role: userCred.role || 'user'
    })
    // Return both token and user for AuthContext
    return {
        token: response.token,
        user: response.user
    }
}

async function logout() {
	storageService.removeSession(STORAGE_KEY_LOGGEDIN_USER)
	storageService.remove('authToken')
	storageService.remove('authUser')
	return await httpService.post('auth/logout')
}

function getLoggedinUser() {
    return storageService.loadSession(STORAGE_KEY_LOGGEDIN_USER)
}

function _saveLocalUser(user) {
    // Store user exactly as backend sends it, but ensure compatibility
	const userToStore = { 
        _id: user._id, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullname: `${user.firstName} ${user.lastName}`, // Add fullname for compatibility
        account: user.account,
        profileImg: user.profileImg,
        imgUrl: user.profileImg, // Add imgUrl for compatibility
        score: user.score || 10000, 
        isAdmin: user.isAdmin,
        role: user.role
    }
    
	storageService.saveSession(STORAGE_KEY_LOGGEDIN_USER, userToStore)
	return userToStore
}