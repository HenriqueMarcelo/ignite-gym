import { UserDTO } from '@dtos/userDTO'
import { ReactNode, createContext, useState } from 'react'

export type AuthContextDataProps = {
  user: UserDTO
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
  const [user, setUser] = useState({
    id: '1',
    name: 'Marcelo',
    email: 'email@email.com',
    avatar: 'marcelo.png',
  })
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}
