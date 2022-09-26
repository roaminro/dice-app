import type { NextPage } from 'next'
import {
  Box,
  Button,
  Flex,
} from '@chakra-ui/react'
import { AppContext } from '../context/AppContext'
import Nav from '../components/Nav'
import { useContext } from 'react'

import Bets from '../components/Bets'
import Dice from '../components/Dice'
import { connect } from '../context/AppActions'

const Home: NextPage = () => {
  const { state, dispatch } = useContext(AppContext)
  const { connected, connecting } = state

  const connectClick = async () => {
    await connect(dispatch)
  }

  return (
    <Box>
      <Nav />
      {
        !connected ?
          <Flex alignItems='center' justifyContent='center' height='100vh'>
            <Button onClick={connectClick} variant='outline' isLoading={connecting}>
              Connect with Kondor
            </Button>
          </Flex>

          :
          <Flex alignItems='center' justifyContent='center' flexDirection='column'>
            <Box width='50vw'>
              <Dice />
            </Box>
            <Box width='95vw'>
              <Bets />
            </Box>
          </Flex>
      }

    </Box>
  )
}

export default Home
