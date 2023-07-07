import { useEffect, useReducer } from "react"
import Cookies from "js-cookie"
import axios from "axios"
import { tesloApi } from "@/api"
import { AuthContext, AuthState, authReducer } from "./"
import { useRouter } from "next/router"
import { useSession, signOut } from 'next-auth/react';
import { IUser } from "@/interfaces"

interface AuthProviderProps {
    children: React.ReactNode
    authInitialState?: AuthState
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, authInitialState = AUTH_INITIAL_STATE }) => {

    const [ state, dispatch ] = useReducer(authReducer, AUTH_INITIAL_STATE);
    const router = useRouter();

    const { data, status } = useSession();

    useEffect(() => {
      if (status === 'authenticated') dispatch({
        type: '[AUTH] - Login',
        payload: data.user as IUser
      })
    }, [ data, status ])

    // useEffect(() => {
    //     checkToken();
    // }, [])

    const checkToken = async () => {

        if(!Cookies.get('token')) return;

        try {
            const resp = await tesloApi.get('/user/validate-token');

            Cookies.set('token', resp.data.token);

            dispatch({
                type: '[AUTH] - Login',
                payload: resp.data.user
            });

        } catch (error) {
            Cookies.remove('token');
        }
    }

    const loginUser = async (email: string, password: string) => {
        try {
            const response = await tesloApi.post('/user/login', { email, password });

            const { token, user } = response.data;

            Cookies.set('token', token);

            dispatch({
                type: '[AUTH] - Login',
                payload: user
            });

            return true;
        } catch (error) {
            return false;
        }
    }

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('cart');

        signOut();
    }

    const registerUser = async (registerData: { name: string, email: string, password: string }): Promise<{ hasError: boolean, message: string }> => {
        try {
            const response = await tesloApi.post('/user/register', registerData);

            const { token, user } = response.data;

            Cookies.set('token', token);

            dispatch({
                type: '[AUTH] - Login',
                payload: user
            });

            return {
                hasError: false,
                message: 'Not Error'
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'No se pudo crear el usuario'
            }
        }
    }

    return <AuthContext.Provider value={{
        ...state,

        // metodos
        loginUser,
        registerUser,
        logout
    }}>
        { children }
    </AuthContext.Provider>
}