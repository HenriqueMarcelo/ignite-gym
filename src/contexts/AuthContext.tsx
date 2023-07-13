import { UserDTO } from '@dtos/userDTO'
import { api } from '@services/api'
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@storage/storageUser'
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react'

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>
  isLoadingUserStorageData: boolean
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
  // Criando um estados
  const [user, setUser] = useState({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  // Criando uma funções para ser compartilhada no contexto
  function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    setUser(userData)
  }

  async function storageUserAndtokenSave(userData: UserDTO, token: string) {
    try {
      setIsLoadingUserStorageData(true)

      await storageUserSave(userData)
      await storageAuthTokenSave(token)
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function signIn(email: string, password: string) {
    const { data } = await api.post('/sessions', { email, password })

    if (data.user && data.token) {
      try {
        setIsLoadingUserStorageData(true)

        await storageUserAndtokenSave(data.user, data.token)
        setIsLoadingUserStorageData(true)

        userAndTokenUpdate(data.user, data.token)
      } finally {
        setIsLoadingUserStorageData(false)
      }
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true)

      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    setUser(userUpdated)
    await storageUserSave(userUpdated)
  }

  const loadUserData = useCallback(async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true)

      const userLogged = await storageUserGet()
      const authToken = await storageAuthTokenGet()

      if (userLogged && authToken) {
        userAndTokenUpdate(userLogged, authToken)
      }
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }, [])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        isLoadingUserStorageData,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
