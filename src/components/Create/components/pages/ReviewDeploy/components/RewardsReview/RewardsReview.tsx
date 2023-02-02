import { t } from '@lingui/macro'
import { Row } from 'antd'
import { Reward, RewardsList } from 'components/Create/components/RewardsList'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useMemo } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { formatEnabled } from 'utils/format/formatBoolean'
import { v4 } from 'uuid'
import { PREVENT_OVERSPENDING_FIELD_VISIBLE } from '../../../NftRewards'
import { DescriptionCol } from '../DescriptionCol'

export const RewardsReview = () => {
  const {
    nftRewards: { rewardTiers, flags },
    fundingCycleMetadata,
  } = useAppSelector(state => state.editingV2Project)

  const dispatch = useAppDispatch()

  const rewards = useMemo(() => {
    return (
      rewardTiers?.map(t => ({
        id: v4(),
        title: t.name,
        minimumContribution: t.contributionFloor,
        description: t.description,
        maximumSupply: t.maxSupply,
        url: t.externalLink,
        imgUrl: t.imageUrl,
        beneficiary: t.beneficiary,
        reservedRate: t.reservedRate,
        votingWeight: t.votingWeight,
      })) ?? []
    )
  }, [rewardTiers])

  const setRewards = useCallback(
    (rewards: Reward[]) => {
      dispatch(
        editingV2ProjectActions.setNftRewardTiers(
          rewards.map(reward => ({
            contributionFloor: reward.minimumContribution,
            maxSupply: reward.maximumSupply,
            remainingSupply: reward.maximumSupply,
            imageUrl: reward.imgUrl,
            name: reward.title,
            externalLink: reward.url,
            description: reward.description,
            beneficiary: reward.beneficiary,
            reservedRate: reward.reservedRate,
            votingWeight: reward.votingWeight,
          })),
        ),
      )
    },
    [dispatch],
  )

  const shouldUseDataSourceForRedeem = useMemo(() => {
    return formatEnabled(fundingCycleMetadata.useDataSourceForRedeem)
  }, [fundingCycleMetadata.useDataSourceForRedeem])

  const preventOverspending = useMemo(() => {
    return formatEnabled(flags.preventOverspending)
  }, [flags.preventOverspending])

  return (
    <>
      <RewardsList value={rewards} onChange={setRewards} />
      <Row gutter={20} className="mt-4">
        <DescriptionCol
          span={6}
          title={t`Redeemable NFTs`}
          desc={
            <div className="text-base font-medium">
              {shouldUseDataSourceForRedeem}
            </div>
          }
        />
        {PREVENT_OVERSPENDING_FIELD_VISIBLE ? (
          <DescriptionCol
            span={6}
            title={t`Prevent NFT overspending`}
            desc={
              <div className="text-base font-medium">{preventOverspending}</div>
            }
          />
        ) : null}
      </Row>
    </>
  )
}
