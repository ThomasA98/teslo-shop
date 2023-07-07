import { IUser } from "@/interfaces"

export interface AuthState {
    isLoggedIn: boolean
    user?: IUser
}

type ActionType
    = { type: '[AUTH] - Login', payload: IUser }
    | { type: '[AUTH] - Logout' }

export const authReducer = (state: AuthState, action: ActionType): AuthState => {

    switch (action.type) {
        case '[AUTH] - Login':
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload
            }
        case '[AUTH] - Logout':
            return {
                ...state,
                isLoggedIn: false,
                user: undefined
            }
        default:
            return state
    }

}