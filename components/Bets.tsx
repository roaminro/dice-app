import { useContext } from 'react'
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Heading,
  Link,
} from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import useSWR from 'swr'
import { AppContext } from '../context/AppContext'
import { Bet } from '../types/Bet'
import { Contract, utils } from 'koilib'
import { ExternalLinkIcon } from '@chakra-ui/icons'

//env variables
const { NEXT_PUBLIC_EXPLORER_TX_URL } = process.env

const truncate = (input: string) => `${input.substring(0, 11)}...${input.substring(input.length - 5, input.length)}`

export async function getBets(
  key: string,
  account: string,
  contract: Contract
): Promise<Bet[]> {
  const bets: Bet[] = []

  if (contract) {
    const { result: getHistoryResult } = await contract!.functions.get_history<{ history: { tx_ids: string[] } }>({
      account
    })

    for (const tx_id of getHistoryResult!.history.tx_ids) {
      const { result: getBetResult } = await contract!.functions.get_bet<{ bet: Bet }>({
        tx_id
      })

      if (getBetResult) {
        if (!getBetResult.bet.status || getBetResult.bet.status == 0) {
          const checkResult = await fetch(`api/check/${tx_id}`)
          console.log(await checkResult.json())

        }

        getBetResult.bet.amount = utils.formatUnits(getBetResult.bet.amount, 8)

        bets.push(getBetResult.bet)
      }
    }
  }

  return bets
}

export default function Bets() {
  const { state } = useContext(AppContext)

  const { account, contract } = state

  const { data, error } = useSWR(['userBets', account, contract], getBets, { refreshInterval: 1000 })

  console.log(data, error)


  return (
    <Box borderWidth='thin' borderColor='gray.300' borderRadius='lg' padding='4' margin='4'>
      <Heading as='h3' size='md'>
        Your bets
      </Heading>

      {!data ?
        'loading'
        :
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Timestamp</Th>
                <Th>Transaction ID</Th>
                <Th>Status</Th>
                <Th>Amount</Th>
                <Th>Value</Th>
                <Th>Roll</Th>
                <Th>Roll Transaction ID</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                data?.map((bet) => {
                  let status: string
                  switch (bet.status) {
                    case 1:
                      status = 'won'
                      break
                    case 2:
                      status = 'lost'
                      break
                    default:
                      status = ''
                      break
                  }

                  let timestamp: string = bet.timestamp
                  if (timestamp) {
                    timestamp = new Date(parseInt(timestamp)).toLocaleString()
                  }

                  return (
                    <Tr key={bet.tx_id}>
                      <Td>{timestamp}</Td>
                      <Td>
                        <Link href={`${NEXT_PUBLIC_EXPLORER_TX_URL}${bet.tx_id}`} isExternal>
                          {truncate(bet.tx_id)} <ExternalLinkIcon mx='2px' />
                        </Link>
                      </Td>
                      <Td>{status || <Spinner />}</Td>
                      <Td>{bet.amount}</Td>
                      <Td>{bet.value}</Td>
                      <Td>{bet.roll}</Td>
                      <Td>
                        <Link href={`${NEXT_PUBLIC_EXPLORER_TX_URL}${bet.roll_tx_id}`} isExternal>
                          {truncate(bet.roll_tx_id)} <ExternalLinkIcon mx='2px' />
                        </Link>
                      </Td>
                    </Tr>
                  )
                })
              }
            </Tbody>
          </Table>
        </TableContainer>
      }
    </Box>
  )
}