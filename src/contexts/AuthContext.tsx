import { UserDTO } from '@dtos/userDTO'
import { api } from '@services/api'
import { storageUserGet, storageUserSave } from '@storage/storageUser'
import { ReactNode, createContext, useEffect, useState } from 'react'

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
}

type AuthContextProviderProps = {
  children: ReactNode
}

// Criando um contexto
export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

// Criando o context Provider
export function AuthContextProvider({ children }: AuthContextProviderProps) {
  // Criando um estado
  const [user, setUser] = useState({} as UserDTO)

  // Criando uma função para ser compartilhada no contexto
  async function signIn(email: string, password: string) {
    const { data } = await api.post('/sessions', { email, password })

    if (data.user) {
      setUser(data.user)
      storageUserSave(data.user)
    }
  }

  async function loadUserData() {
    const userLogged = await storageUserGet()

    if (userLogged) {
      setUser(userLogged)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider value={{ user, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}
