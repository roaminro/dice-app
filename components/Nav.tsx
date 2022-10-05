import { useContext } from 'react'
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  Heading,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { AppContext } from '../context/AppContext'
import { connect } from '../context/AppActions'

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { state: { account, connecting, connected }, dispatch } = useContext(AppContext)

  const connectClick = async () => {
    await connect(dispatch)
  }

  return (
    <>
      <Box bg={useColorModeValue('gray.300', 'gray.700')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Heading as='h3' size='md'>
            The Dice
          </Heading>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={connectClick} variant='outline' isLoading={connecting}>
                {connected ? `Connected as ${account}` : 'Connect with Kondor'}
              </Button>

              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}