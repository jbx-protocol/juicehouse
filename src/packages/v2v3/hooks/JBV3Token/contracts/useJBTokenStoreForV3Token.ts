import { Contract } from '@ethersproject/contracts'
import { useContractReadValue } from 'hooks/ContractReader'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { useJBV3Token } from '../contracts/useJBV3Token'

export function useJBTokenStoreForV3Token(): Contract | undefined {
  const { tokenAddress } = useContext(V2V3ProjectContext)
  const { contracts } = useContext(V2V3ContractsContext)

  const JBV3TokenContract = useJBV3Token({ tokenAddress })

  const { value: v2TokenStoreAddress } = useContractReadValue<string, string>({
    contract: JBV3TokenContract,
    functionName: 'v2TokenStore',
    args: [],
  })
  const JBTokenStore = useLoadContractFromAddress({
    address: v2TokenStoreAddress,
    abi: contracts?.JBTokenStore.interface,
  })

  return JBTokenStore
}
