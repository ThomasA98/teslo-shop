import { createContext } from "react";
import { AuthState } from "./";

interface AuthContextExposes extends AuthState {
    loginUser: (email: string, password: string) => Promise<boolean>
    registerUser: (registerData: { name: string; email: string; password: string;}) => Promise<{ hasError: boolean; message: string;}>
    logout: () => void
}

export const AuthContext = createContext( {} as AuthContextExposes );