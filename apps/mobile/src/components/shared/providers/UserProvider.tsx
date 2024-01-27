import * as SecureStore from 'expo-secure-store'
import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'

interface UserContext {
  isUserAccessKeyLoaded: boolean
  userAccessKey: string | null
  setUserAccessKey: (value: string) => Promise<void>
}

const UserContext = createContext<UserContext | undefined>(undefined)
const STORE_KEY = 'userAccessKey'

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [isUserAccessKeyLoaded, setIsUserAccessKeyLoaded] = useState(false)
  const [userAccessKey, setUserAccessKey] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const accessKey = await SecureStore.getItemAsync(STORE_KEY)
      setUserAccessKey(accessKey)
      setIsUserAccessKeyLoaded(true)
    })()
  }, [])

  const handleSetUserAccessKey = useCallback(async (value: string) => {
    await SecureStore.setItemAsync(STORE_KEY, value)
    setUserAccessKey(value)
  }, [])

  const value = useMemo(
    () => ({
      isUserAccessKeyLoaded,
      userAccessKey,
      setUserAccessKey: handleSetUserAccessKey
    }),
    [isUserAccessKeyLoaded, userAccessKey, handleSetUserAccessKey]
  )

  if (!isUserAccessKeyLoaded) {
    return null
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }

  return context
}
