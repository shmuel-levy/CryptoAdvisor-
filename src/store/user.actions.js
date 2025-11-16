import { userService } from '../services/user'
import { store } from '../store/store'

import { SET_USER } from './user.reducer'

// These actions now return { token, user } for AuthContext
// Redux store is kept for backward compatibility but AuthContext is the source of truth
export async function login(credentials) {
    const { token, user } = await userService.login(credentials)
    store.dispatch({
        type: SET_USER,
        user
    })
    return { token, user }
}

export async function signup(credentials) {
    const { token, user } = await userService.signup(credentials)
    store.dispatch({
        type: SET_USER,
        user
    })
    return { token, user }
}

export async function logout() {
    await userService.logout()
    store.dispatch({
        type: SET_USER,
        user: null
    })
}
