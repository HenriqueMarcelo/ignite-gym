import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import {
  VStack,
  Text,
  ScrollView,
  Center,
  Skeleton,
  Heading,
  useToast,
} from 'native-base'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

const PHOTO_SIZE = 33
const MAX_PHOTO_SIZE = 2

export function Profile() {
  const [photoIsLoadinng, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState(
    'https://github.com/HenriqueMarcelo.png',
  )

  const toast = useToast()

  async function handleUserPhotoSelect() {
    try {
      setPhotoIsLoading(true)
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
        )

        if (photoInfo.exists && photoInfo.size / 1024 / 1024 > MAX_PHOTO_SIZE) {
          return toast.show({
            title: `Essa imagem é muito grande. Escolha uma de até ${MAX_PHOTO_SIZE}MB`,
            placement: 'top',
            bgColor: 'red.500',
          })
        }
        setUserPhoto(photoSelected.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {photoIsLoadinng ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto source={{ uri: userPhoto }} alt="" size={PHOTO_SIZE} />
          )}
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="green.600"
              fontWeight={'bold'}
              fontSize={'md'}
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Input placeholder="Nome" bg="gray.600" />
          <Input
            placeholder="E-mail"
            value="mhmsn@hotmail.com"
            bg="gray.600"
            isDisabled
          />

          <Heading
            color="gray.200"
            fontSize="md"
            mb={2}
            mt={12}
            alignSelf={'flex-start'}
          >
            Alterar senha
          </Heading>
          <Input placeholder="Senha antiga" secureTextEntry bg="gray.500" />
          <Input placeholder="Nova senha" secureTextEntry bg="gray.500" />
          <Input
            placeholder="Confirme a nova senha"
            secureTextEntry
            bg="gray.500"
          />

          <Button title="Atualizar" mt={5} />
        </Center>
      </ScrollView>
    </VStack>
  )
}
