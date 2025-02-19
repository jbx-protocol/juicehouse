import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V1ContractName } from 'packages/v1/models/contracts'
import useContractReader from './useContractReader'

/** Returns address of terminal contract used by project. */
export default function useTerminalOfProject(
  projectId: BigNumberish | undefined,
) {
  return useContractReader<string>({
    contract: V1ContractName.TerminalDirectory,
    functionName: 'terminalOf',
    args:
      projectId !== undefined
        ? [BigNumber.from(projectId).toHexString()]
        : null,
  })
}
