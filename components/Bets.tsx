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
  Spinner,
} from '@chakra-ui/react'
import useSWR from 'swr'
import { AppContext } from '../context/AppContext'
import { Bet, BetStatus } from '../types/Bet'
import { Contract, utils } from 'koilib'
import { ExternalLinkIcon } from '@chakra-ui/icons'

//env variables
const { NEXT_PUBLIC_EXPLORER_TX_URL } = process.env

const truncate = (input: string) => input && input !== '0x' ? `${input.substring(0, 11)}...${input.substring(input.length - 5, input.length)}` : ''

export async function getBets(
  key: string,
  account: string,
  diceContract: Contract
): Promise<Bet[]> {
  const bets: Bet[] = []

  if (diceContract) {
    const { result: getHistoryResult } = await diceContract!.functions.get_history<{ bets: Bet[] }>({
      account
    })

    for (const bet of getHistoryResult!.bets) {
      if (!bet.status || bet.status == BetStatus.NOT_ROLLED) {
        const checkResult = await fetch(`api/check/${bet.tx_id}`)
        const data = await checkResult.json()
        if (!data.statusCode) {
          bet.roll = parseInt(data.roll)
          bet.roll_tx_id = data.rollTransactionId
          bet.status = bet.value === bet.roll ? BetStatus.WON : BetStatus.LOST
        }
      }

      bet.amount = utils.formatUnits(bet.amount, 8)

      bets.push(bet)
    }
  }

  return bets
}

export default function Bets() {
  const { state } = useContext(AppContext)

  const { account, diceContract } = state

  const { data } = useSWR(['userBets', account, diceContract], getBets, { refreshInterval: 10000 })

  return (
    <Box borderWidth='thin' borderColor='gray.300' borderRadius='lg' padding='4' margin='4'>
      <Heading as='h3' size='md'>
        Your last 10 bets
      </Heading>

      {!data ?
        <Spinner />
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
                    case BetStatus.WON:
                      status = 'won'
                      break
                    case BetStatus.LOST:
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
                          {
                            bet.roll_tx_id ?
                              <>
                                {truncate(bet.roll_tx_id)} <ExternalLinkIcon mx='2px' />
                              </>
                              : ''
                          }
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