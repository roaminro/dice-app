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

interface BetsProps {
  title: string
  account: string
  showAddressColumn?: boolean
}

const truncate = (input: string) => input && input !== '0x' ? `${input.substring(0, 11)}...${input.substring(input.length - 5, input.length)}` : ''

export async function getBets(
  key: string,
  account: string,
  diceContract: Contract
): Promise<Bet[]> {
  const bets: Bet[] = []

  // get history
  const { result: getHistoryResult } = await diceContract!.functions.get_history<{ bets: Bet[] }>({
    account
  })

  for (const bet of getHistoryResult!.bets) {
    // if not rolled yet, call api to roll dice
    if (!bet.status || bet.status == BetStatus.NOT_ROLLED) {
      const checkResult = await fetch(`api/check/${bet.tx_id}`)
      const data = await checkResult.json()
      if (!data.statusCode) {
        // update bet
        bet.roll = parseInt(data.roll)
        bet.roll_tx_id = data.rollTransactionId
        bet.status = bet.value === bet.roll ? BetStatus.WON : BetStatus.LOST
      }
    }

    // update amount, show negative if lost, 2x amount if won
    if (bet.status == BetStatus.WON) {
      bet.gainLossAmount = utils.formatUnits(`${parseInt(bet.amount) * 2}`, 8)
    } else if (bet.status == BetStatus.LOST) {
      bet.gainLossAmount = utils.formatUnits(`-${bet.amount}`, 8)
    }

    bet.amount = utils.formatUnits(bet.amount, 8)

    bets.push(bet)
  }

  return bets
}

export default function Bets({ title, account, showAddressColumn = true }: BetsProps) {
  const { state: { diceContract } } = useContext(AppContext)

  const { data } = useSWR(['bets', account, diceContract], getBets, { refreshInterval: 10000 })

  return (
    <Box borderWidth='thin' borderColor='gray.300' borderRadius='lg' padding='4' margin='4'>
      <Heading as='h3' size='md'>
        {title}
      </Heading>

      {
        !account ?
          <></>
          :
          !data ?
            <Spinner />
            :
            <TableContainer>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>Timestamp</Th>
                    {
                      showAddressColumn && <Th>Account</Th>
                    }
                    <Th>Transaction ID</Th>
                    <Th>Status</Th>
                    <Th>Bet Amount</Th>
                    <Th>Gain/Loss</Th>
                    <Th># picked</Th>
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
                          {
                            showAddressColumn &&
                            <Td>
                              <Link href={`${process.env.NEXT_PUBLIC_EXPLORER_ACCOUNT_URL}${bet.account}`} isExternal>
                                {bet.account} <ExternalLinkIcon mx='2px' />
                              </Link>
                            </Td>
                          }
                          <Td>
                            <Link href={`${process.env.NEXT_PUBLIC_EXPLORER_TX_URL}${bet.tx_id}`} isExternal>
                              {truncate(bet.tx_id)} <ExternalLinkIcon mx='2px' />
                            </Link>
                          </Td>
                          <Td>{status || <Spinner />}</Td>
                          <Td>{bet.amount}</Td>
                          <Td>{bet.gainLossAmount}</Td>
                          <Td>{bet.value}</Td>
                          <Td>{bet.roll}</Td>
                          <Td>
                            <Link href={`${process.env.NEXT_PUBLIC_EXPLORER_TX_URL}${bet.roll_tx_id}`} isExternal>
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