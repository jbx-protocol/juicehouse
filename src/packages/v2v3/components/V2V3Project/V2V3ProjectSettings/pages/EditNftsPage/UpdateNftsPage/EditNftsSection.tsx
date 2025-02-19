import { Button, Empty } from 'antd'
import { Trans, t } from '@lingui/macro'
import { useCallback, useState } from 'react'

import { Callout } from 'components/Callout/Callout'
import Loading from 'components/Loading'
import { RewardsList } from 'components/NftRewards/RewardsList/RewardsList'
import TransactionModal from 'components/modals/TransactionModal'
import { TransactionSuccessModal } from '../../../TransactionSuccessModal'
import { V2V3_CURRENCY_USD } from 'packages/v2v3/utils/currency'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useEditingFundingCycleConfig } from '../../../hooks/useEditingFundingCycleConfig'
import { useEditingNfts } from '../hooks/useEditingNfts'
import { useHasNftRewards } from 'packages/v2v3/hooks/JB721Delegate/useHasNftRewards'
import { useReconfigureFundingCycle } from '../../../hooks/useReconfigureFundingCycle'
import { useUpdateCurrentCollection } from 'packages/v2v3/components/V2V3Project/V2V3ProjectSettings/pages/EditNftsPage/hooks/useUpdateCurrentCollection'

export function EditNftsSection() {
  const nftRewardsData = useAppSelector(
    state => state.editingV2Project.nftRewards,
  )
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false)

  const { rewardTiers, setRewardTiers, editedRewardTierIds, loading } =
    useEditingNfts()
  const { value: hasNftRewards } = useHasNftRewards()
  const { updateExistingCollection, txLoading } = useUpdateCurrentCollection({
    editedRewardTierIds,
    rewardTiers,
    onConfirmed: () => setSuccessModalOpen(true),
  })

  const showNftRewards = hasNftRewards

  const onNftFormSaved = useCallback(async () => {
    if (!rewardTiers) return

    setSubmitLoading(true)
    await updateExistingCollection()
    setSubmitLoading(false)
  }, [rewardTiers, updateExistingCollection])

  const editingFundingCycleConfig = useEditingFundingCycleConfig()
  const {
    reconfigureLoading: removeDatasourceLoading,
    reconfigureFundingCycle,
  } = useReconfigureFundingCycle({
    editingFundingCycleConfig,
    memo: 'Detach NFT collection',
    removeDatasource: true,
    onComplete: () => setSuccessModalOpen(true),
  })

  const removeDatasource = () => {
    reconfigureFundingCycle()
  }

  if (loading) return <Loading className="mt-20" />

  const allNftsRemoved = showNftRewards && rewardTiers?.length === 0

  const hasDataSourceButNoNfts = hasNftRewards && !rewardTiers

  const nftCurrency = nftRewardsData?.pricing.currency

  return (
    <>
      <Callout.Info className="text-primary mb-5 bg-smoke-100 dark:bg-slate-500">
        <Trans>Changes to NFTs will take effect immediately.</Trans>
      </Callout.Info>

      <div className="mb-8">
        <RewardsList
          priceCurrencySymbol={nftCurrency === V2V3_CURRENCY_USD ? 'USD' : 'ETH'}
          nftRewardsData={nftRewardsData}
          value={rewardTiers}
          onChange={setRewardTiers}
          allowCreate
          withEditWarning
        />

        {rewardTiers?.length === 0 && (
          <Empty
            className="mb-0"
            description={t`No NFTs`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>

      {allNftsRemoved && (
        <Callout.Warning className="mb-5 bg-smoke-100 dark:bg-slate-500">
          <Trans>
            <p>
              You're about to delete all NFTs from your collection. This will
              take effect immediately, and you can add NFTs back to the
              collection at any time.
            </p>
            <p>
              If you want to COMPLETELY detach NFTs from your project, you can
              do so in the <strong>Danger Zone</strong> section below.
            </p>
          </Trans>
        </Callout.Warning>
      )}

      <Button
        onClick={onNftFormSaved}
        htmlType="submit"
        type="primary"
        loading={submitLoading}
      >
        <span>
          <Trans>Edit NFTs</Trans>
        </span>
      </Button>

      {hasDataSourceButNoNfts && (
        <Callout.Warning className="mt-5 bg-smoke-100 dark:bg-slate-500">
          <div>
            <strong className="text-lg">Danger Zone</strong>
          </div>
          <p>
            This will remove the NFT <strong>Extension Contract</strong> from
            your project's next funding cycle. You can relaunch a new NFT
            collection for later cycles.
          </p>
          <Button
            onClick={removeDatasource}
            htmlType="submit"
            type="default"
            loading={removeDatasourceLoading}
          >
            <span>
              <Trans>Detach NFTs</Trans>
            </span>
          </Button>
        </Callout.Warning>
      )}

      <TransactionModal transactionPending open={txLoading} />
      <TransactionSuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        content={
          <>
            <div className="w-80 pt-1 text-2xl font-medium">
              <Trans>Your NFTs have been edited successfully</Trans>
            </div>
            <div className="text-secondary pb-6">
              <Trans>
                New NFTs will available on your project page shortly.
              </Trans>
            </div>
          </>
        }
      />
    </>
  )
}
