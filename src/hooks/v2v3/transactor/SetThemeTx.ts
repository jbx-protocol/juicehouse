import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { useDefaultTokenUriResolver } from 'hooks/DefaultTokenUriResolver/contracts/DefaultTokenUriResolver'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext } from 'react'
import { useV2ProjectTitle } from '../ProjectTitle'

export function useSetThemeTx(): TransactorInstance<{
  textColor: string
  bgColor: string
  altBgColor: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const DefaultTokenUriResolver = useDefaultTokenUriResolver()
  const projectTitle = useV2ProjectTitle()

  return ({ textColor, bgColor, altBgColor }, txOpts) => {
    if (!transactor || !projectId || !DefaultTokenUriResolver) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      DefaultTokenUriResolver,
      'setTheme',
      [projectId, textColor, bgColor, altBgColor],
      { ...txOpts, title: t`Set theme for ${projectTitle}\'s NFT` },
    )
  }
}
