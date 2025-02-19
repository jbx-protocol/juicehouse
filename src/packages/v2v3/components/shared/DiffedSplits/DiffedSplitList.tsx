import { BigNumber } from '@ethersproject/bignumber'
import round from 'lodash/round'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { Split } from 'packages/v2v3/models/splits'
import { formatSplitPercent } from 'packages/v2v3/utils/math'
import {
  getProjectOwnerRemainderSplit,
  processUniqueSplits,
} from 'packages/v2v3/utils/v2v3Splits'
import { useMemo } from 'react'
import { SplitProps } from '../SplitItem'
import { DiffedSplitItem } from './DiffedSplitItem'

const JB_PERCENT_PRECISION = 2

type DiffedSplitListProps = {
  splits: Split[]
  diffSplits?: Split[]
  currency?: BigNumber
  oldCurrency?: BigNumber
  totalValue: BigNumber | undefined
  oldTotalValue?: BigNumber
  previousTotalValue?: BigNumber
  showFees?: boolean
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  reservedRate?: number
  showDiffs?: boolean
}

export default function DiffedSplitList({
  splits,
  diffSplits,
  showFees = false,
  currency,
  oldCurrency,
  totalValue,
  previousTotalValue,
  valueSuffix,
  valueFormatProps,
  reservedRate,
  showDiffs,
}: DiffedSplitListProps) {
  const { projectOwnerAddress } = useProjectContext()
  const ownerSplit = useMemo(() => {
    if (!projectOwnerAddress) return
    return getProjectOwnerRemainderSplit(projectOwnerAddress, splits)
  }, [projectOwnerAddress, splits])

  const diffOwnerSplit = useMemo(() => {
    if (!diffSplits || !projectOwnerAddress || !showDiffs) return
    return getProjectOwnerRemainderSplit(projectOwnerAddress, diffSplits)
  }, [projectOwnerAddress, diffSplits, showDiffs])

  const ownerSplitIsRemoved =
    !ownerSplit?.percent && diffOwnerSplit?.percent === 0

  const roundedDiffOwnerSplitPercent = round(
    parseFloat(
      formatSplitPercent(BigNumber.from(diffOwnerSplit?.percent || 0)),
    ),
    JB_PERCENT_PRECISION,
  )
  const diffOwnerSplitHasPercent =
    diffOwnerSplit && roundedDiffOwnerSplitPercent !== 0

  const ownerSplitIsNew = ownerSplit?.percent && !diffOwnerSplitHasPercent

  const currencyHasDiff = Boolean(
    oldCurrency && currency && !oldCurrency.eq(currency),
  )
  const uniqueSplits = processUniqueSplits({
    oldTotalValue: previousTotalValue,
    newTotalValue: totalValue,
    allSplitsChanged: currencyHasDiff,
    oldSplits: showDiffs ? diffSplits : undefined,
    newSplits: splits,
  })

  const splitProps: Omit<SplitProps, 'split'> = {
    currency,
    oldCurrency,
    totalValue,
    projectOwnerAddress,
    valueSuffix,
    valueFormatProps,
    reservedRate,
    showFee: showFees,
  }
  return (
    <div className="flex flex-col gap-1.5">
      {uniqueSplits.map(split => {
        const splitIsRemoved = split.oldSplit === true
        return (
          <DiffedSplitItem
            props={{
              split,
              ...splitProps,
              totalValue: splitIsRemoved ? previousTotalValue : totalValue,
            }}
            key={`${split.beneficiary}-${split.projectId}-${split.percent}`}
          />
        )
      })}
      {ownerSplit?.percent ? (
        <DiffedSplitItem
          props={{
            split: {
              ...ownerSplit,
              oldSplit: ownerSplitIsRemoved
                ? true
                : ownerSplitIsNew
                ? false
                : diffOwnerSplit,
            },
            ...splitProps,
          }}
        />
      ) : null}
    </div>
  )
}
