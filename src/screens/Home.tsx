import { ExerciseCard } from '@components/ExerciseCard'
import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import { FlatList, HStack, Heading, Text, VStack } from 'native-base'
import { useState } from 'react'

export function Home() {
  const [groupSelected, setGroupSelected] = useState('costa')
  const [groups, _setGroups] = useState([
    'costa',
    'ombro',
    'bíceps',
    'Tríceps',
    'perna',
  ])

  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected === item}
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
      />

      <VStack px={8} flex={1}>
        <HStack justifyContent={'space-between'} mb={5}>
          <Heading color="gray.200" fontSize={'md'}>
            Exercícios
          </Heading>
          <Text color="gray.200" fontSize={'sm'}>
            4
          </Text>
        </HStack>
        <ExerciseCard />
        <ExerciseCard />
        <ExerciseCard />
      </VStack>
    </VStack>
  )
}
