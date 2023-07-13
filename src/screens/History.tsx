import { HistoryCard } from '@components/HistoryCard'
import { Loading } from '@components/Loading'
import { ScreenHeader } from '@components/ScreenHeader'
import { HistoryByDayDTO } from '@dtos/historyByDayDTO'
import { useFocusEffect } from '@react-navigation/native'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { Heading, SectionList, Text, VStack, useToast } from 'native-base'
import { useCallback, useState } from 'react'

export function History() {
  const [isLoading, setIsLoading] = useState(true)
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

  const toast = useToast()

  async function fetchHistory() {
    try {
      setIsLoading(true)
      const response = await api.get('/history')

      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar o histórico.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  )

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios" />

      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={exercises}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section }) => (
            <Heading
              color={'gray.200'}
              fontSize={'md'}
              fontFamily="heading"
              mt={10}
              mb={3}
            >
              {section.title}
            </Heading>
          )}
          contentContainerStyle={
            !exercises.length && {
              flex: 1,
              justifyContent: 'center',
            }
          }
          ListEmptyComponent={() => (
            <Text color="gray.100" textAlign={'center'}>
              Não há exercícios registrados ainda. {'\n'}
              Vamos fazer exercicios hoje?
            </Text>
          )}
          px={8}
        />
      )}
    </VStack>
  )
}
