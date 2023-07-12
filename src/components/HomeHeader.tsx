import { HStack, Heading, Text, VStack, Icon } from 'native-base'
import { UserPhoto } from './UserPhoto'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { useAuth } from '@hooks/useAuth'
import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

export function HomeHeader() {
  const { user, signOut } = useAuth()

  function handleSignOut() {
    signOut()
  }

  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems={'center'}>
      <UserPhoto
        size={16}
        source={user.avatar ? { uri: user.avatar } : defaultUserPhotoImg}
        mr={4}
      />
      <VStack flex={1}>
        <Text color="gray.100" fontSize={'md'}>
          Olá,
        </Text>

        <Heading color="gray.100" fontSize={'md'} fontFamily="heading">
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity onPress={handleSignOut}>
        <Icon as={MaterialIcons} name="logout" color="gray.200" size={7} />
      </TouchableOpacity>
    </HStack>
  )
}
