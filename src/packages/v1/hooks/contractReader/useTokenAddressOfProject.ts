import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V1ContractName } from 'packages/v1/models/contracts'
import { useMemo } from 'react'

import useContractReader from './useContractReader'

/** Returns address of ERC20 token issued for project with `projectId`. */
export default function useTokenAddressOfProject(
  projectId: BigNumberish | undefined,
) {
  return useContractReader<string>({
    contract: V1ContractName.TicketBooth,
    functionName: 'ticketsOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    updateOn: useMemo(
      () => [
        {
          contract: V1ContractName.TicketBooth,
          eventName: 'Issue',
          topics: projectId
            ? [BigNumber.from(projectId).toHexString()]
            : undefined,
        },
      ],
      [projectId],
    ),
  })
}
