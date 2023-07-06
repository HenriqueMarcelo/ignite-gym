import { IButtonProps, Text, Button as ButtonNativeBase } from 'native-base'

type Props = IButtonProps & {
  title: string
}

export function Button({ title, ...rest }: Props) {
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      bg="green.700"
      {...rest}
      rounded="sm"
      _pressed={{
        bg: 'green.500',
      }}
    >
      <Text color="white" fontFamily="heading" fontSize="sm">
        {title}
      </Text>
    </ButtonNativeBase>
  )
}
