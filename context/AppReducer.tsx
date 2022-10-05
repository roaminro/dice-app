import { Contract, Provider } from 'koilib'
import { AppActions, ActionType } from './AppActions'

import diceAbi from '../contract/abi/dice_abi_js.json'

// @ts-ignore koilib_types is needed when using koilib
diceAbi.koilib_types = diceAbi.types

export interface AppState {
  account: string
  connecting: boolean
  connected: boolean
  error: boolean
  diceContract: Contract
  koinContract: Contract | undefined
}

export const initialAppState: AppState = {
  account: '',
  connecting: false,
  connected: false,
  error: false,
  diceContract: new Contract({
    id: process.env.NEXT_PUBLIC_DICE_CONTRACT_ADDR,
    // @ts-ignore the abi provided is compatible
    abi: diceAbi,
    // @ts-ignore the provider provided is compatible
    provider: new Provider(process.env.NEXT_PUBLIC_KOINOS_RPC_URL),
  }),
  koinContract: undefined,
}

export const AppReducer = (
  state: AppState,
  action: AppActions
): AppState => {
  switch (action.type) {
    case ActionType.Connecting:
      return { ...state, connecting: true }
    case ActionType.Connected:
      return {
        ...state,
        connecting: false, 
        connected: true,
        account: action.payload.account,
        diceContract: action.payload.diceContract,
        koinContract: action.payload.koinContract
      }
    case ActionType.Error:
      return { ...state, error: true, connecting: false }
    default:
      return state
  }
}

