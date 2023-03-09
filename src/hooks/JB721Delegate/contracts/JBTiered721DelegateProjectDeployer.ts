import { JB721_DELEGATE_V1 } from 'constants/delegateVersions'
import { readNetwork } from 'constants/networks'
import { loadJB721DelegateJson } from 'hooks/JB721Delegate/contracts/JB721DelegateAbi'
import { ContractJson, ForgeDeploy } from 'models/contracts'
import { JB721DelegateVersion } from 'models/nftRewards'
import { V2V3ContractName } from 'models/v2v3/contracts'

const DEFAULT_JB_721_DELEGATE_VERSION: JB721DelegateVersion = JB721_DELEGATE_V1 // TODO eventually bump to 1.1

async function loadDefaultJB721DelegateDeployment() {
  const latestNftContractDeployments = await loadJB721DelegateJson<ForgeDeploy>(
    `broadcast/Deploy.s.sol/${readNetwork.chainId}/run-latest`,
    DEFAULT_JB_721_DELEGATE_VERSION,
  )

  return latestNftContractDeployments
}

async function findJBTiered721DelegateProjectDeployerAddress() {
  const latestNftContractDeployments =
    await loadDefaultJB721DelegateDeployment()
  return latestNftContractDeployments?.transactions.find(
    tx =>
      tx.contractName === V2V3ContractName.JBTiered721DelegateProjectDeployer,
  )?.contractAddress
}

/**
 * Load the contract that will launch a project with NFTs.
 */
export const loadJBTiered721DelegateProjectDeployerContract = async () => {
  const JBTiered721DelegateProjectDeployerContractAddress =
    await findJBTiered721DelegateProjectDeployerAddress()
  if (!JBTiered721DelegateProjectDeployerContractAddress) return

  const nftDeployerContractJson = {
    address: JBTiered721DelegateProjectDeployerContractAddress,
    abi: (
      await loadJB721DelegateJson<ContractJson>(
        'out/IJBTiered721DelegateProjectDeployer.sol/IJBTiered721DelegateProjectDeployer',
        DEFAULT_JB_721_DELEGATE_VERSION,
      )
    )?.abi,
  }

  return nftDeployerContractJson
}

/**
 * Load the address that should be used when a project launches with NFTs, or launches new NFTS.
 */
export async function findDefaultJBTiered721DelegateStoreAddress() {
  const latestNftContractDeployments =
    await loadDefaultJB721DelegateDeployment()
  return latestNftContractDeployments?.transactions.find(
    tx => tx.contractName === 'JBTiered721DelegateStore',
  )?.contractAddress
}
