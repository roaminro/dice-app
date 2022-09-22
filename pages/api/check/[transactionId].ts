import type { NextApiRequest, NextApiResponse } from 'next'
import { prove, proofToHash } from '@roamin/ecvrf'
import { Provider, Signer } from 'koilib'
import { ApiError } from 'next/dist/server/api-utils'
import { TransactionJson } from 'koilib/lib/interface'

// Koinos Private Key 
const { KOINOS_PK, KOINOS_RPC_URL } = process.env

const provider = new Provider([KOINOS_RPC_URL as string])
const signer = new Signer({ privateKey: KOINOS_PK as string, provider })

type Query = {
  transactionId: string
}

type Result = {
  proof: string
  proofHash: string
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

    let transactions: {
      transaction: TransactionJson;
      containing_blocks: string[];
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
    const { containing_blocks: containingBlocks } = transactions[0]

    const blockId = containingBlocks[containingBlocks.length - 1]
    const { block_items: blockItems } = await provider.getBlocksById([blockId])

    if (!blockItems.length) {
      throw new ApiError(404, `block with id "${blockId}" does not exist`)
    }

    const { block_height: blockHeight } = blockItems[0]

    // get last irreversible block info
    const headInfo = await provider.getHeadInfo()

    if (parseInt(headInfo.last_irreversible_block) < parseInt(blockHeight)) {
      throw new ApiError(400, `block "${blockId}" is not yet irreversible`)
    }

    // use the transaction id to calculate the proof
    const proof = prove(KOINOS_PK as string, transactionId.slice(2))
    const proofHash = proofToHash(proof)

    res.status(200).json({ proof, proofHash })
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
