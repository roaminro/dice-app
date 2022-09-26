import { Contract } from 'koilib'
import { AppActions, ActionType } from './AppActions'

export interface AppState {
  account: string
  connecting: boolean
  connected: boolean
  error: boolean
  contract: Contract | undefined
}

export const initialAppState: AppState = {
  account: '',
  connecting: false,
  connected: false,
  error: false,
  contract: undefined,
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
        contract: action.payload.contract
      }
    case ActionType.Error:
      return { ...state, error: true, connecting: false }
    default:
      return state
  }
}

