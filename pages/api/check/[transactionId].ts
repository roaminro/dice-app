import type { NextApiRequest, NextApiResponse } from 'next'
import { prove, proofToHash } from '@roamin/ecvrf'
import { Contract, Provider, Signer, utils } from 'koilib'
import { ApiError } from 'next/dist/server/api-utils'
import { TransactionJson } from 'koilib/lib/interface'

import diceAbi from '../../../contract/abi/dice_abi_js.json'

//env variables
const { KOINOS_WIF, KOINOS_RPC_URL, DICE_CONTRACT_ADDR } = process.env

// @ts-ignore koilib_types is needed when using koilib
diceAbi.koilib_types = diceAbi.types

const provider = new Provider([KOINOS_RPC_URL as string])
const signer = Signer.fromWif(KOINOS_WIF as string)
signer.provider = provider

const diceContract = new Contract({
  id: DICE_CONTRACT_ADDR,
  // @ts-ignore the abi provided is compatible
  abi: diceAbi,
  provider,
  signer,
})

const diceFunctions = diceContract.functions

type Query = {
  transactionId: string
}

type Result = {
  vrfProof: string
  vrfHash: string,
  roll: string,
}

type ResponseError = {
  statusCode: number
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result | ResponseError>
) {
  try {
    const { transactionId } = req.query as Query
    if (!transactionId) {
      throw new ApiError(400, 'transactionId is missing')
    }

    // check if dice has not been rolled already for that transaction
    const { result } = await diceFunctions.get_bet({
      tx_id: transactionId
    })

    // @ts-ignore bet.status is a valid object
    if (result?.bet?.status != undefined && result?.bet?.status != 0) {
      throw new ApiError(400, `dice has already been rolled for transaction with id "${transactionId}"`)
    }

    let transactions: {
      transaction: TransactionJson
      containing_blocks: string[]
    }[] = []

    // get transaction
    // use try&catch here as getTransactionsById will error out if the transaction does not exist 
    try {
      const result = await provider.getTransactionsById([transactionId])
      transactions = result.transactions
    } catch (error) {
      throw new ApiError(404, `transaction with id "${transactionId}" does not exist`)
    }

    if (!transactions.length) {
      throw new ApiError(404, `transaction with id "${transactionId}" does not exist`)
    }

    // get the last block that contains the transaction (should be least old block)
    // const { containing_blocks: containingBlocks } = transactions[0]

    // const blockId = containingBlocks[containingBlocks.length - 1]
    // const { block_items: blockItems } = await provider.getBlocksById([blockId])

    // if (!blockItems.length) {
    //   throw new ApiError(404, `block with id "${blockId}" does not exist`)
    // }

    // const { block_height: blockHeight } = blockItems[0]

    // get last irreversible block info
    // const headInfo = await provider.getHeadInfo()

    // if (parseInt(headInfo.last_irreversible_block) < parseInt(blockHeight)) {
    //   throw new ApiError(400, `block "${blockId}" is not yet irreversible`)
    // }

    // use the transaction id to calculate the proof
    let vrfProof = prove(signer.getPrivateKey(), transactionId.slice(2))
    let vrfHash = proofToHash(vrfProof)

    // calculate roll locally
    // vrfHash is a uint256, and the contract uses a uint128, so we need to cast it
    const random = BigInt('0x' + vrfHash.substring(0, 32))
    const roll = random % 6n + 1n

    console.log('roll', roll)

    // prepend 0x
    vrfProof = '0x' + vrfProof
    vrfHash = '0x' + utils.toHexString(utils.multihash(Buffer.from(vrfHash, 'hex')))

    const txInfo = await diceFunctions.roll({
      tx_id: transactionId,
      vrf_proof: vrfProof,
      vrf_hash: vrfHash,
    }, {
      sendTransaction: false
    })

    res.status(200).json({ vrfProof, vrfHash, roll: roll.toString() })
  } catch (error) {
    if (error instanceof ApiError) {
      const { statusCode, message } = error
      res.status(statusCode).json({ statusCode, message })
    } else {
      console.error(error)
      res.status(500).json({ statusCode: 500, message: 'unhandled error' })
    }
  }
}
