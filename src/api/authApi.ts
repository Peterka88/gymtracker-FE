import {client, TOKEN_KEY} from "./client.ts";
import type {AuthenticationRequest, AuthenticationResponse} from "../types/auth.ts";
import {decodeJwtPayload} from "../utils/jwt.ts";

export const authApi = {
    login: (username: string, password: string) => {
        const body: AuthenticationRequest = {username, password}
        return client.post<AuthenticationResponse>('/auth/authenticate', body)
            .then((res) => {
                localStorage.setItem(TOKEN_KEY, res.data.token)
                const { name } = decodeJwtPayload<{ name: string }>(res.data.token)
                localStorage.setItem('name', name)
                return res.data.token
            })
    },
    logout: () => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem("name")
    },
}