import { Contract } from '@ethersproject/contracts'
import {
  ControllerVersion,
  PaymentTerminalVersion,
} from 'packages/v2v3/models/contracts'
import { createContext } from 'react'

export interface V2V3ProjectContracts {
  JBController?: Contract
  JBETHPaymentTerminal?: Contract
  JBETHPaymentTerminalStore?: Contract
  JBFundAccessConstraintsStore?: Contract
}

export const V2V3ProjectContractsContext: React.Context<{
  contracts: V2V3ProjectContracts
  loading: {
    cvsLoading?: boolean
    projectContractsLoading?: {
      JBControllerLoading: boolean
      JBETHPaymentTerminalLoading: boolean
      JBETHPaymentTerminalStoreLoading: boolean
      JBFundAccessConstraintsStoreLoading: boolean
    }
  }
  versions: {
    JBControllerVersion?: ControllerVersion
    JBETHPaymentTerminalVersion?: PaymentTerminalVersion
  }
}> = createContext({
  contracts: {},
  loading: {},
  versions: {},
})
