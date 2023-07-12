import { LogBox } from 'react-native'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { StatusBar } from 'expo-status-bar'
import { NativeBaseProvider } from 'native-base'
import { Loading } from '@components/Loading'
import { THEME } from './src/theme'
import { Routes } from '@routes/index'
import { AuthContextProvider } from '@contexts/AuthContext'

LogBox.ignoreLogs([
  'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
])

export default function App() {
  const [frontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar style="light" />
      <AuthContextProvider>
        {frontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  )
}
