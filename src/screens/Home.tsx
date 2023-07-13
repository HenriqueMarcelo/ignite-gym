import { ExerciseCard } from '@components/ExerciseCard'
import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { FlatList, HStack, Heading, Text, VStack, useToast } from 'native-base'
import { useCallback, useEffect, useState } from 'react'

export function Home() {
  const [groupSelected, setGroupSelected] = useState('costa')
  const [groups, setGroups] = useState<string[]>([])
  const [exercises, _setExercises] = useState([
    'Puxada frontal',
    'Remada curvada',
    'Remada Unilateral',
    'Levantamento terra',
  ])

  const toast = useToast()
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails() {
    navigation.navigate('Exercise')
  }

  const fetchGroups = useCallback(
    async function fetchGroups() {
      try {
        const response = await api.get('/groups')
        setGroups(response.data)
      } catch (error) {
        const isAppError = error instanceof AppError
        const title = isAppError
          ? error.message
          : 'Não foi possível carregar os grupos músculares.'

        toast.show({
          title,
          placement: 'top',
          color: 'red.500',
        })
      }
    },
    [toast],
  )

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toUpperCase() === item.toUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{
          px: 8,
        }}
        my={10}
        maxH={10}
        minH={10}
      />

      <VStack px={8} flex={1}>
        <HStack justifyContent={'space-between'} mb={5}>
          <Heading color="gray.200" fontSize={'md'} fontFamily="heading">
            Exercícios
          </Heading>
          <Text color="gray.200" fontSize={'sm'}>
            {exercises.length}
          </Text>
        </HStack>
        <FlatList
          data={exercises}
          keyExtractor={(item) => item}
          renderItem={() => (
            <ExerciseCard onPress={handleOpenExerciseDetails} />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            pb: 20,
          }}
        />
      </VStack>
    </VStack>
  )
}
