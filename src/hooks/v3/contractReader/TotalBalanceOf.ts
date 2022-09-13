import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V3ContractName } from 'models/v3/contracts'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './V3ContractReader'

/** Returns combined ERC20 + unclaimed balance of user with `userAddress`. */
export default function useTotalBalanceOf(
  userAddress: string | undefined,
  projectId: BigNumberish | undefined,
) {
  return useContractReader<BigNumber>({
    contract: V3ContractName.JBTokenStore,
    functionName: 'balanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    // TODO: updateOn: useShouldUpdateTokens(projectId, terminalName, userAddress),
  })
}
