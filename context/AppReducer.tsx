import { Contract } from 'koilib'
import { AppActions, ActionType } from './AppActions'

export interface AppState {
  account: string
  connecting: boolean
  connected: boolean
  error: boolean
  diceContract: Contract | undefined
  koinContract: Contract | undefined
}

export const initialAppState: AppState = {
  account: '',
  connecting: false,
  connected: false,
  error: false,
  diceContract: undefined,
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

