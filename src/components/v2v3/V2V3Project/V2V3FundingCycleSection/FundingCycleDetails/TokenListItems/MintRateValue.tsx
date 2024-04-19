import { Trans } from '@lingui/macro'
import { formattedNum } from 'utils/format/formatNumber'
import { WEIGHT_UNCHANGED } from 'utils/v2v3/fundingCycle'
import { formatIssuanceRate } from 'utils/v2v3/math'

export function MintRateValue({
  value,
  tokenSymbol,
  zeroAsUnchanged,
}: {
  value: bigint
  tokenSymbol: string
  zeroAsUnchanged?: boolean
}) {
  if (zeroAsUnchanged && value === WEIGHT_UNCHANGED) {
    return <Trans>Unchanged</Trans>
  }

  return (
    <Trans>
      {formattedNum(formatIssuanceRate(value.toString()))} {tokenSymbol}/ETH
    </Trans>
  )
}
