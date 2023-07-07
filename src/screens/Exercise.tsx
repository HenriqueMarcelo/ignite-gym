import { HStack, Heading, Icon, Text, VStack } from 'native-base'
import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import BodySvg from '@assets/body.svg'

export function Exercise() {
  const navigation = useNavigation()
  function handleGoBack() {
    navigation.goBack()
  }
  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
        </TouchableOpacity>

        <HStack
          mt={4}
          mb={8}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Heading color="gray.100" font-size={'lg'} flexShrink={1}>
            Puxada frontal
          </Heading>
          <HStack alignItems={'center'}>
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform={'capitalize'}>
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </VStack>
  )
}
