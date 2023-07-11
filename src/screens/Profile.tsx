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

import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

type FormDataProps = {
  name: string
  // email: string
  old_password: string
  password: string
  password_confirm: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  // email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
  old_password: yup.string().required('Informe a antiga senha.'),
  password: yup
    .string()
    .required('Informe a senha.')
    .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password_confirm: yup
    .string()
    .required('Confirme a senha.')
    .oneOf([yup.ref('password')], 'A confirmação da senha não confere.'),
})

const PHOTO_SIZE = 33
const MAX_PHOTO_SIZE = 2

export function Profile() {
  const [photoIsLoadinng, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState(
    'https://github.com/HenriqueMarcelo.png',
  )

  const toast = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  })

  function handleSignUp({
    name,
    // email,
    password,
    password_confirm,
  }: FormDataProps) {
    console.log(name, password, password_confirm)
  }

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

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                bg="gray.600"
                errorMessage={errors.name?.message}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Input
            placeholder="E-mail"
            value="mhmsn@hotmail.com"
            bg="gray.600"
            isDisabled
          />

          <Heading
            color="gray.200"
            fontSize="md"
            fontFamily="heading"
            mb={2}
            mt={12}
            alignSelf={'flex-start'}
          >
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha antiga"
                bg="gray.500"
                secureTextEntry
                autoCapitalize="none"
                errorMessage={errors.old_password?.message}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                bg="gray.500"
                secureTextEntry
                autoCapitalize="none"
                errorMessage={errors.password?.message}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirme a Senha"
                bg="gray.500"
                secureTextEntry
                autoCapitalize="none"
                errorMessage={errors.password_confirm?.message}
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={5}
            onPress={handleSubmit(handleSignUp)}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}
