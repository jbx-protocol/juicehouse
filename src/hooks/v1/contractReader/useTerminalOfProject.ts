import { V1ContractName } from 'models/v1/contracts'
import { BigintIsh, toHexString } from 'utils/bigNumbers'
import useContractReader from './useContractReader'

/** Returns address of terminal contract used by project. */
export default function useTerminalOfProject(projectId: BigintIsh | undefined) {
  return useContractReader<string>({
    contract: V1ContractName.TerminalDirectory,
    functionName: 'terminalOf',
    args: projectId !== undefined ? [toHexString(BigInt(projectId))] : null,
  })
}
