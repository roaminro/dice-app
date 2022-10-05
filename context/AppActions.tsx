import React from 'react'

import * as kondor from 'kondor-js'
import { Contract, utils } from 'koilib'

import diceAbi from '../contract/abi/dice_abi_js.json'

// @ts-ignore koilib_types is needed when using koilib
diceAbi.koilib_types = diceAbi.types

export type AppActions =
  | Connecting
  | Connected
  | Error;

export enum ActionType {
  Connecting,
  Connected,
  Error,
}

type Connecting = {
  type: ActionType.Connecting
};

type Connected = {
  type: ActionType.Connected
  payload: {
    account: string
    diceContract: Contract
    koinContract: Contract
  }
};

type Error = { type: ActionType.Error };

export const connecting = (): Connecting => ({
  type: ActionType.Connecting
})

export const connected = (account: string, diceContract: Contract, koinContract: Contract): Connected => ({
  type: ActionType.Connected,
  payload: {
    account,
    diceContract,
    koinContract
  }
})

export const error = (): Error => ({
  type: ActionType.Error,
})

export const connect = async (
  dispatch: React.Dispatch<AppActions>
): Promise<void> => {
  dispatch(connecting())

  try {
    const [account] = await kondor.getAccounts()

    const diceContract = new Contract({
      id: process.env.NEXT_PUBLIC_DICE_CONTRACT_ADDR,
      // @ts-ignore the abi provided is compatible
      abi: diceAbi,
      // @ts-ignore the provider provided is compatible
      provider: kondor.provider,
      // @ts-ignore the signer provided is compatible
      signer: kondor.getSigner(account.address),
    })

    const koinContract = new Contract({
      id: process.env.NEXT_PUBLIC_KOIN_CONTRACT_ADDR,
      abi: utils.tokenAbi,
      // @ts-ignore the provider provided is compatible
      provider: kondor.provider
    })

    // @ts-ignore getAccounts returns objects, not strings
    dispatch(connected(account.address, diceContract, koinContract))
  } catch (e) {
    console.error(e)
    dispatch(error())
  }
}