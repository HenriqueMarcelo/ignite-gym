import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import { FlatList, VStack } from 'native-base'
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
    </VStack>
  )
}
