import { HStack, Heading, Text, VStack } from 'native-base'
import { UserPhoto } from './UserPhoto'

export function HomeHeader() {
  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems={'center'}>
      <UserPhoto
        size={16}
        source={{ uri: 'https://github.com/HenriqueMarcelo.png' }}
        mr={4}
      />
      <VStack>
        <Text color="gray.100" fontSize={'md'}>
          Olá,
        </Text>

        <Heading color="gray.100" fontSize={'md'}>
          Marcelo Henrique
        </Heading>
      </VStack>
    </HStack>
  )
}
