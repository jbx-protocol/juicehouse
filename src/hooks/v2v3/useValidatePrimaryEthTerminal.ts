import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { SUPPORTED_PAYMENT_TERMINALS } from 'models/v2v3/contracts'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'

/**
 * Check whether a project's primary terminal is one that we support.
 *
 * Currently we only support the ETH payment terminal.
 *
 * @dev For maximum safety, we assume that the only valid ETH terminal contracts are those published in the jbx-protocol npm package.
 * In the future, this may not be the case.
 * For example, if another new version of the ETH terminal is deployed, we'll need to support it.
 */
export function useValidatePrimaryEthTerminal() {
  const { primaryETHTerminal } = useContext(V2V3ProjectContext)
  const { contracts } = useContext(V2V3ContractsContext)

  return SUPPORTED_PAYMENT_TERMINALS.some(contractName => {
    return isEqualAddress(
      primaryETHTerminal,
      // from ethers v5 to v6 migration: https://github.com/ethers-io/ethers.js/discussions/4312#discussioncomment-8398867
      contracts?.[contractName]?.target as string,
    )
  })
}
