import { IInputProps, Input as NativeBaseInput, FormControl } from 'native-base'

type Props = IInputProps & {
  errorMessage?: string
}

export function Input({ errorMessage, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid
  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseInput
        bg="gray.700"
        borderColor="gray.700"
        h={14}
        px={4}
        fontSize="md"
        color="white"
        fontFamily="body"
        placeholderTextColor="gray.300"
        isInvalid={invalid}
        _invalid={{
          borderColor: 'red.500',
        }}
        _focus={{
          bg: 'gray.700',
          borderWidth: 1,
          borderColor: 'green.500',
        }}
        {...rest}
      />
      <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
