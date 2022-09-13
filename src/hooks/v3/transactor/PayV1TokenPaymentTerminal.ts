import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'

import * as constants from '@ethersproject/constants'
import { V3ProjectContext } from 'contexts/v3/projectContext'
import { V3UserContext } from 'contexts/v3/userContext'

import { TransactorInstance } from 'hooks/Transactor'

const DEFAULT_DELEGATE_METADATA = 0
const DEFAULT_MIN_RETURNED_TOKENS = 0

type PayV2ProjectTx = TransactorInstance<{
  memo: string
  preferClaimedTokens: boolean
  beneficiary?: string
  value: BigNumber
}>

export function usePayV1TokenPaymentTerminal(): PayV2ProjectTx {
  const { transactor, contracts } = useContext(V3UserContext)
  const { projectId } = useContext(V3ProjectContext)

  return ({ memo, preferClaimedTokens, beneficiary, value }, txOpts) => {
    if (
      !transactor ||
      !projectId ||
      !beneficiary ||
      !contracts?.JBV1TokenPaymentTerminal
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBV1TokenPaymentTerminal,
      'pay',
      [
        projectId,
        value,
        constants.AddressZero,
        beneficiary,
        DEFAULT_MIN_RETURNED_TOKENS,
        preferClaimedTokens,
        memo || '',
        DEFAULT_DELEGATE_METADATA, //delegateMetadata
      ],
      {
        ...txOpts,
      },
    )
  }
}
