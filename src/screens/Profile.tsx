import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { VStack, Text, ScrollView, Center, Skeleton } from 'native-base'
import { useState } from 'react'

const PHOTO_SIZE = 33

export function Profile() {
  const [photoIsLoadinng, setPhotoIsLoading] = useState(true)

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView>
        <Center mt={6}>
          {photoIsLoadinng ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={{ uri: 'https://github.com/HenriqueMarcelo.png' }}
              alt=""
              size={PHOTO_SIZE}
            />
          )}
        </Center>
      </ScrollView>
    </VStack>
  )
}
