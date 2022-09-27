import { useContext } from 'react'
import { Box, Link, Spinner, Text } from '@chakra-ui/react'
import useSWR from 'swr'
import { AppContext } from '../context/AppContext'
import { Contract, utils } from 'koilib'

export async function getBalance(
  key: string,
  owner: string,
  koinContract: Contract
): Promise<string | undefined> {
  if (koinContract) {
    const { result: balanceOfResult } = await koinContract!.functions.balanceOf<{ value: string }>({
      owner
    })

    return utils.formatUnits(balanceOfResult?.value!, 8)
  }

  return undefined
}

interface BalanceProps {
  handleClick: (balance: string) => void;
}

export default function Balance({ handleClick }: BalanceProps) {
  const { state } = useContext(AppContext)

  const { account, koinContract } = state

  const { data: balance } = useSWR(
    ['userBalance', account, koinContract],
    getBalance, 
    { refreshInterval: 10000 }
  )

  return (
    <Box marginTop='4'>
      {
      !balance ?
        <Spinner />
      :
        <Link onClick={() => handleClick(balance)}>
          Koin balance: {balance}
        </Link>
      }
    </Box>
  )
}