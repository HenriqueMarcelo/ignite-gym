import { Text, View } from 'react-native'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { StatusBar } from 'expo-status-bar'

export default function App() {
  const [frontsLoaded] = useFonts([Roboto_400Regular, Roboto_700Bold])

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#202024',
      }}
    >
      {frontsLoaded ? <Text>Hello World!</Text> : <View />}
      <StatusBar style="light" />
    </View>
  )
}
