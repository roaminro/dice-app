import type { NextPage } from 'next'
import {
  Box,
  Flex,
} from '@chakra-ui/react'
import { AppContext } from '../context/AppContext'
import Nav from '../components/Nav'
import { useContext } from 'react'

import Bets from '../components/Bets'
import Dice from '../components/Dice'

const Home: NextPage = () => {
  const { state: { account, diceContract } } = useContext(AppContext)

  return (
    <Box>
      <Nav />
      <Flex alignItems='center' justifyContent='center' flexDirection='column'>
        <Box width='50vw'>
          <Dice />
        </Box>
        <Box width='95vw'>
          <Bets title='Your last 10 bets' account={account} showAddressColumn={false} />
        </Box>
        <Box width='95vw'>
          <Bets title='Last 20 global bets' account={process.env.NEXT_PUBLIC_DICE_CONTRACT_ADDR!} />
        </Box>
      </Flex>
    </Box>
  )
}

export default Home
