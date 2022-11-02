import { FormEvent, useContext, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  useColorModeValue,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useToast,
  Heading,
} from '@chakra-ui/react'
import { useSWRConfig } from 'swr'

import { AppContext } from '../context/AppContext'
import { connect } from '../context/AppActions'
import { Bet } from '../types/Bet'
import { utils, Provider } from 'koilib'
import Balance from './Balance'

//env variables
const { NEXT_PUBLIC_KOINOS_RPC_URL } = process.env
const provider = new Provider(NEXT_PUBLIC_KOINOS_RPC_URL as string)

export default function Dice() {
  const toast = useToast()
  const { state: { account, diceContract, koinContract, connected, connecting }, dispatch } = useContext(AppContext)
  const { mutate } = useSWRConfig()

  const [state, setState] = useState({
    loading: false,
    value: 1,
    amount: '0.00000000'
  })

  const onSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()

      setState({ ...state, loading: true })

      // generate and sign transatcion
      let { transaction, receipt: test } = await diceContract!.functions.bet({
        account,
        amount: utils.parseUnits(state.amount, 8),
        value: state.value
      }, {
        // the send transaction will not decode the args in Kondor
        sendTransaction: false,
        rcLimit: '1000000000',
        payer: '1Bf5W4LZ2FTmzPcA6d8QeLgAYmCKdZp2nN',
      })

      // send transaction with local provider instance
      const { receipt } = await provider.sendTransaction(transaction!)
      
      console.log(receipt)

      toast({
        title: 'Placing bet',
        description: 'The transaction containing your bet is being processed, this may take some time',
        status: 'info',
        duration: 5000,
        isClosable: true,
      })

      // temporary fix: do not use Kondor's provider as it will error out
      await provider.wait(transaction!.id!, 'byBlock', 60000)

      // update bets cache with the new transaction
      mutate(['bets', account, diceContract], (bets: Bet[]) => {
        return [{
          tx_id: transaction!.id,
          account,
          status: 0,
          amount: state.amount,
          value: state.value
        }, ...bets]
      }, { revalidate: true })

      mutate(['userBalance', account, koinContract])

      toast({
        title: 'Bet placed',
        description: 'Your bet was successfully placed!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

    } catch (error) {
      console.error(error)
      toast({
        title: 'Bet failed',
        description: `Your bet could not be placed: ${error}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setState({ ...state, loading: false })
    }
  }

  const connectClick = async () => {
    await connect(dispatch)
  }

  const onBalanceClick = (amount: string) => {
    setState({ ...state, amount })
  }

  return (
    <Box borderWidth='thin' borderColor='gray.300' borderRadius='lg' padding='4' margin='4'>
      <Heading as='h3' size='md'>Guess the correct dice roll and double your bet!</Heading>
      <br />
      <form onSubmit={onSubmitForm}>
        <FormControl key='value'>
          <FormLabel htmlFor='value'>Pick a number between 1 and 6</FormLabel>
          <Slider
            id='value'
            name='value'
            min={1}
            max={6}
            value={state.value}
            onChange={(val) => setState({
              ...state, value: val
            })}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb fontSize='sm' boxSize='32px' textColor={useColorModeValue('black', 'black')}>{state.value}</SliderThumb>
          </Slider>
        </FormControl>
        <FormControl key='amount'>
          <FormLabel htmlFor='amount'>Choose the amount of Koin to bet</FormLabel>
          <NumberInput
            precision={8}
            min={0.00000001}
            step={0.00000001}
            id='amount'
            name='amount'
            isRequired={true}
            value={state.amount}
            onChange={(valueAsString: string, valueAsNumber: number) => {
              setState({
                ...state, amount: valueAsString
              })
            }}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Balance handleClick={onBalanceClick} />
        {
          connected
            ?
            <Button type='submit' isLoading={state.loading} marginTop='4' width='100%'>Place Bet</Button>
            :
            <Button onClick={connectClick} isLoading={connecting} marginTop='4' width='100%'>Connect with Kondor</Button>
        }
      </form>
    </Box>
  )
}