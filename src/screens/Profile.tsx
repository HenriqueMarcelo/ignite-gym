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
import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'

import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

type FormDataProps = {
  name: string
  email: string | null | undefined
  old_password: string | null | undefined
  password: string | null | undefined
  password_confirm: string | null | undefined
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().nullable(),
  old_password: yup.string().nullable(),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => value || null),
  password_confirm: yup
    .string()
    .nullable()
    .transform((value) => value || null)
    .oneOf([yup.ref('password')], 'As senhas devem ser iguais.')
    .when('password', {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required('Informe a confirmação da senha.')
          .transform((value) => value || null),
    }),
})

const PHOTO_SIZE = 33
const MAX_PHOTO_SIZE = 5

export function Profile() {
  const [isLoading, setIsLoading] = useState(false)
  const [photoIsLoadinng, setPhotoIsLoading] = useState(false)

  const toast = useToast()
  const { user, updateUserProfile } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  })

  async function handleProfileUpdate({
    name,
    old_password,
    password,
  }: FormDataProps) {
    try {
      setIsLoading(true)

      const userUpdated = user
      userUpdated.name = name

      await api.put('/users', {
        name,
        password,
        old_password,
      })

      await updateUserProfile(userUpdated)

      toast.show({
        title: 'Perfil, atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar os dados. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
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

        const fileExtension = photoSelected.assets[0].uri.split('.').pop()
        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLocaleLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdatedResponse = await api.patch(
          '/users/avatar',
          userPhotoUploadForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar
        updateUserProfile(userUpdated)

        toast.show({
          title: 'Foto atualizada!',
          placement: 'top',
          bgColor: 'green.500',
        })
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
            <UserPhoto
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : defaultUserPhotoImg
              }
              alt=""
              size={PHOTO_SIZE}
            />
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

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                bg="gray.600"
                isDisabled
                errorMessage={errors.email?.message}
                onChangeText={onChange}
                value={value as string | undefined}
              />
            )}
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
                value={value as string | undefined}
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
                value={value as string | undefined}
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
                value={value as string | undefined}
                onSubmitEditing={handleSubmit(handleProfileUpdate)}
                returnKeyType="send"
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={5}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isLoading}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}
