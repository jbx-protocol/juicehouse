import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { ethers } from 'ethers'
import { useContractReader } from 'hooks/ContractReader'
import { V1ContractName } from 'models/v1/contracts'
import { useContext } from 'react'
import { normalizeHandle } from 'utils/format/formatHandle'

/** Returns ID of project with `handle`. */
export default function useProjectIdForHandle(handle: string | undefined) {
  const { contracts } = useContext(V1UserContext)
  return useContractReader<V1ContractName.Projects, bigint>({
    contracts,
    contract: V1ContractName.Projects,
    functionName: 'projectFor',
    args: handle ? [ethers.encodeBytes32String(normalizeHandle(handle))] : null,
  })
}
