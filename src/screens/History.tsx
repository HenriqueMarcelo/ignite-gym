import { HistoryCard } from '@components/HistoryCard'
import { ScreenHeader } from '@components/ScreenHeader'
import { Heading, SectionList, VStack } from 'native-base'

const sections = [
  {
    title: '26.06.12',
    data: ['Pizza', 'Burger', 'Risotto'],
  },
  {
    title: '26.06.13',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: '26.08.14',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: '14.12.23',
    data: ['Cheese Cake', 'Ice Cream'],
  },
]

export function History() {
  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios" />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item}
        renderItem={() => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading color={'gray.200'} fontSize={'md'} mt={10} mb={3}>
            {section.title}
          </Heading>
        )}
        px={8}
      />
    </VStack>
  )
}
