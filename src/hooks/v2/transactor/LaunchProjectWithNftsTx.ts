import { NetworkContext } from 'contexts/networkContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { getAddress } from '@ethersproject/address'
import * as constants from '@ethersproject/constants'
import { useContext } from 'react'
import {
  V2FundAccessConstraint,
  V2FundingCycleData,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'

import { GroupedSplits, SplitGroup } from 'models/v2/splits'
import { ContractNftRewardTier, NftRewardTier } from 'models/v2/nftRewardTier'

import { parseEther } from '@ethersproject/units'
import { isValidMustStartAtOrAfter } from 'utils/v2/fundingCycle'
import { BigNumber } from '@ethersproject/bignumber'
import { generateEncodedIPFSUri } from 'utils/ipfs'

import { TransactorInstance } from '../../Transactor'
import { JUICEBOX_MONEY_METADATA_DOMAIN } from 'constants/v2/metadataDomain'
import { MaxUint48 } from 'constants/numbers'
import { IJBTiered721DelegateStore } from 'constants/contracts/rinkeby/IJBTiered721DelegateStore'

const DEFAULT_MUST_START_AT_OR_AFTER = '1' // start immediately
const DEFAULT_MEMO = ''

// Maps cid to contributionFloor
export type TxNftArg = { [cid: string]: NftRewardTier }

function getJBDeployTiered721DelegateData({
  collectionName,
  collectionSymbol,
  nftRewards,
  ownerAddress,
  directory,
}: {
  collectionName: string
  collectionSymbol: string
  nftRewards: TxNftArg
  ownerAddress: string
  directory: string
}) {
  const tiersArg: ContractNftRewardTier[] = Object.keys(nftRewards).map(cid => {
    const contributionFloorWei = parseEther(
      nftRewards[cid].contributionFloor.toString(),
    )
    const maxSupply = nftRewards[cid].maxSupply
    const initialQuantity = maxSupply ?? MaxUint48

    const encodedIPFSUri = generateEncodedIPFSUri(cid)

    return {
      contributionFloor: contributionFloorWei,
      lockedUntil: BigNumber.from(0),
      initialQuantity,
      votingUnits: 0,
      reservedRate: 0,
      reservedTokenBeneficiary: constants.AddressZero,
      encodedIPFSUri,
      shouldUseBeneficiaryAsDefault: false,
    }
  })

  return {
    directory,
    name: collectionName,
    symbol: collectionSymbol,
    tokenUriResolver: constants.AddressZero,
    contractUri: 'ipfs://null',
    owner: ownerAddress,
    tiers: tiersArg,
    reservedTokenBeneficiary: constants.AddressZero,
    store: IJBTiered721DelegateStore,
    lockReservedTokenChanges: false,
    lockVotingUnitChanges: false,
  }
}

export function useLaunchProjectWithNftsTx(): TransactorInstance<{
  collectionName: string
  collectionSymbol: string
  projectMetadataCID: string
  fundingCycleData: V2FundingCycleData
  fundingCycleMetadata: V2FundingCycleMetadata
  fundAccessConstraints: V2FundAccessConstraint[]
  groupedSplits?: GroupedSplits<SplitGroup>[]
  mustStartAtOrAfter?: string // epoch seconds. anything less than "now" will start immediately.
  nftRewards: TxNftArg
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { userAddress } = useContext(NetworkContext)

  return (
    {
      collectionName,
      collectionSymbol,
      projectMetadataCID,
      fundingCycleData,
      fundingCycleMetadata,
      fundAccessConstraints,
      groupedSplits = [],
      mustStartAtOrAfter = DEFAULT_MUST_START_AT_OR_AFTER,
      nftRewards,
    },
    txOpts,
  ) => {
    if (
      !transactor ||
      !userAddress ||
      !contracts?.JBController ||
      !contracts.JBETHPaymentTerminal ||
      !isValidMustStartAtOrAfter(mustStartAtOrAfter, fundingCycleData.duration)
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const args = [
      userAddress, // _owner
      getJBDeployTiered721DelegateData({
        collectionName,
        collectionSymbol,
        nftRewards,
        ownerAddress: userAddress,
        directory: getAddress(contracts.JBDirectory.address),
      }), // _deployTieredNFTRewardDataSourceData
      {
        projectMetadata: {
          domain: JUICEBOX_MONEY_METADATA_DOMAIN,
          content: projectMetadataCID,
        },
        data: fundingCycleData,
        metadata: fundingCycleMetadata,
        mustStartAtOrAfter,
        groupedSplits,
        fundAccessConstraints,
        terminals: [contracts.JBETHPaymentTerminal.address], //  _terminals (contract address of the JBETHPaymentTerminal),
        memo: DEFAULT_MEMO,
      }, // _launchProjectData
    ]

    return transactor(
      contracts.JBTiered721DelegateProjectDeployer,
      'launchProjectFor',
      args,
      txOpts,
    )
  }
}
