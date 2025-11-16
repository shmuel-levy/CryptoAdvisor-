import { userService } from '../services/user'
import { store } from '../store/store'

import { SET_USER } from './user.reducer'

export async function login(credentials) {
    const user = await userService.login(credentials)
    store.dispatch({
        type: SET_USER,
        user
    })
    return user
}

export async function signup(credentials) {
    const user = await userService.signup(credentials)
    store.dispatch({
        type: SET_USER,
        user
    })
    return user
}

export async function logout() {
    await userService.logout()
    store.dispatch({
        type: SET_USER,
        user: null
    })
}
