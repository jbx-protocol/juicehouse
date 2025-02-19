import * as constants from '@ethersproject/constants'

import { cidFromUrl, encodeIpfsUri, ipfsUri } from 'utils/ipfs'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { useDefaultTokenUriResolver } from 'hooks/DefaultTokenUriResolver/contracts/useDefaultTokenUriResolver'
import { TransactorInstance } from 'hooks/useTransactor'
import { JB721DelegateVersion } from 'models/JB721Delegate'
import { NftCollectionMetadata } from 'models/nftRewards'
import { JB721DelegateContractsContext } from 'packages/v2v3/contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { useContext } from 'react'
import { pinNftCollectionMetadata } from 'utils/nftRewards'
import { useV2ProjectTitle } from '../useProjectTitle'

function buildArgs(
  version: JB721DelegateVersion,
  {
    uri,
    tokenUriResolverAddress,
  }: {
    uri: string
    tokenUriResolverAddress: string
  },
) {
  const contractUri = ipfsUri(uri)
  const cid = cidFromUrl(uri) as string
  switch (version) {
    case JB721DelegateVersion.JB721DELEGATE_V3_3:
    case JB721DelegateVersion.JB721DELEGATE_V3_4:
      return ['', contractUri, tokenUriResolverAddress, '0', encodeIpfsUri(cid)]
    case JB721DelegateVersion.JB721DELEGATE_V3_2:
      return [undefined, contractUri, undefined, undefined, undefined]
    default: // v3, v3.1
      return [contractUri]
  }
}

export function useReconfigureNftCollectionMetadata(): TransactorInstance<NftCollectionMetadata> {
  const { transactor } = useContext(TransactionContext)
  const { projectMetadata } = useContext(ProjectMetadataContext)

  const {
    contracts: { JB721TieredDelegate },
    version,
  } = useContext(JB721DelegateContractsContext)

  const defaultTokenUriResolver = useDefaultTokenUriResolver()

  const projectTitle = useV2ProjectTitle()

  return async ({ name, description }, txOpts) => {
    if (!transactor || !JB721TieredDelegate || !name || !version) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const uri = await pinNftCollectionMetadata({
      collectionName: name,
      collectionDescription: description ?? '',
      collectionLogoUri: projectMetadata?.logoUri,
      collectionInfoUri: projectMetadata?.infoUri,
    })

    return transactor(
      JB721TieredDelegate,
      version === JB721DelegateVersion.JB721DELEGATE_V3 ||
        version === JB721DelegateVersion.JB721DELEGATE_V3_1
        ? 'setContractUri'
        : 'setMetadata',
      buildArgs(version, {
        uri,
        tokenUriResolverAddress:
          defaultTokenUriResolver?.address || constants.AddressZero,
      }),
      {
        ...txOpts,
        title: t`Update ${projectTitle}'s NFT collection details.`,
      },
    )
  }
}
