import { t, Trans } from '@lingui/macro'
import { Descriptions, Form, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import ETHAmount from 'components/currency/ETHAmount'
import { MemoFormInput } from 'components/Project/PayProjectForm/MemoFormInput'
import TransactionModal from 'components/TransactionModal'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useNftAccountBalance } from 'hooks/JB721Delegate/contractReader/NftAccountBalance'
import { useETHReceivedFromTokens } from 'hooks/v2v3/contractReader/ETHReceivedFromTokens'
import { useRedeemTokensTx } from 'hooks/v2v3/transactor/RedeemTokensTx'
import { useWallet } from 'hooks/Wallet'
import { JB721DelegateToken } from 'models/subgraph-entities/v2/jb-721-delegate-tokens'
import { useContext, useState } from 'react'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'
import { V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { formatRedemptionRate } from 'utils/v2v3/math'

export function NftTierAccountHoldings({ nft }: { nft: JB721DelegateToken }) {
  return <div>{nft.tokenUri}</div>
}

export function RedeemNftsModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const {
    fundingCycle,
    primaryTerminalCurrentOverflow,
    totalTokenSupply,
    distributionLimitCurrency,
    fundingCycleMetadata,
  } = useContext(V2V3ProjectContext)

  const { userAddress } = useWallet()

  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [loading, setLoading] = useState<boolean>()
  const [memo, setMemo] = useState<string>('')
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const [form] = useForm<{
    redeemAmount: string
  }>()

  const { data: nfts, isLoading } = useNftAccountBalance({
    dataSourceAddress: fundingCycleMetadata?.dataSource,
    accountAddress: userAddress,
  })
  const totalBalance = '0'
  const nftBalanceFormatted = nfts?.length ?? 0
  const maxClaimable = useETHReceivedFromTokens({
    tokenAmount: fromWad(totalBalance),
  })
  const rewardAmount = useETHReceivedFromTokens({ tokenAmount: redeemAmount })
  const redeemTokensTx = useRedeemTokensTx()

  if (!fundingCycle || !fundingCycleMetadata || isLoading) return null

  // 0.5% slippage for USD-denominated projects
  const minReturnedTokens = distributionLimitCurrency?.eq(V2V3_CURRENCY_USD)
    ? rewardAmount?.mul(1000).div(1005)
    : // ? rewardAmount?.mul(100).div(101)
      rewardAmount

  let modalTitle: string

  const hasOverflow = primaryTerminalCurrentOverflow?.gt(0)
  const hasRedemptionRate = fundingCycleMetadata.redemptionRate.gt(0)

  const canRedeem = hasOverflow && hasRedemptionRate

  if (canRedeem) {
    modalTitle = t`Redeem NFTs for ETH`
  } else {
    modalTitle = t`Burn NFTs`
  }

  const executeRedeemTransaction = async () => {
    await form.validateFields()
    if (!minReturnedTokens) return

    setLoading(true)

    const txSuccess = await redeemTokensTx(
      {
        redeemAmount: parseWad(redeemAmount),
        minReturnedTokens,
        memo,
      },
      {
        // step 1
        onDone: () => {
          setTransactionPending(true)
          setRedeemAmount(undefined)
        },
        // step 2
        onConfirmed: () => {
          setTransactionPending(false)
          setLoading(false)
          onConfirmed?.()
        },
        onError: (e: Error) => {
          setTransactionPending(false)
          setLoading(false)
          emitErrorNotification(e.message)
        },
      },
    )

    if (!txSuccess) {
      setTransactionPending(false)
      setLoading(false)
    }
  }

  const totalSupplyExceeded =
    redeemAmount &&
    parseFloat(redeemAmount) > parseFloat(fromWad(totalTokenSupply))
  const personalBalanceExceeded =
    redeemAmount && parseFloat(redeemAmount) > parseFloat(fromWad(totalBalance))
  const inUSD = distributionLimitCurrency?.eq(V2V3_CURRENCY_USD)

  return (
    <TransactionModal
      transactionPending={transactionPending}
      title={modalTitle}
      open={open}
      confirmLoading={loading}
      onOk={() => {
        executeRedeemTransaction()
      }}
      onCancel={() => {
        setRedeemAmount(undefined)

        onCancel?.()
      }}
      okText={modalTitle}
      okButtonProps={{
        disabled: !redeemAmount || parseInt(redeemAmount) === 0,
      }}
      width={540}
      centered
    >
      <Space direction="vertical" className="w-full" size="large">
        <div>
          {canRedeem ? (
            <Space direction="vertical" size="middle">
              <Callout.Info>
                <Trans>NFTs are burned when they are redeemed.</Trans>
              </Callout.Info>
              <div>
                <Trans>
                  Redeem your NFTs for a portion of this project's overflow. The
                  current funding cycle's <strong>redemption rate</strong>{' '}
                  determines your redemption value.
                </Trans>
              </div>
            </Space>
          ) : (
            <Callout.Info>
              {!hasOverflow && (
                <Trans>
                  <strong>This project has no overflow</strong>. You won't
                  receive any ETH for burning your NFTs.
                </Trans>
              )}
              {!hasRedemptionRate && (
                <Trans>
                  <strong>This project has a 0% redemption rate</strong>. You
                  won't receive any ETH for burning your NFTs.
                </Trans>
              )}
            </Callout.Info>
          )}
        </div>

        <Descriptions
          column={1}
          contentStyle={{ display: 'block', textAlign: 'right' }}
        >
          <Descriptions.Item
            label={<Trans>Redemption rate</Trans>}
            className="pb-1"
          >
            {formatRedemptionRate(fundingCycleMetadata.redemptionRate)}%
          </Descriptions.Item>
          <Descriptions.Item label={<Trans>Your NFTs</Trans>} className="pb-1">
            {nftBalanceFormatted} NFTs
          </Descriptions.Item>
          <Descriptions.Item
            label={<Trans>Total redemption value</Trans>}
            className="pb-1"
          >
            <ETHAmount amount={maxClaimable} />
          </Descriptions.Item>
        </Descriptions>

        <div>
          <Form form={form} layout="vertical">
            {nfts?.map(nft => (
              <NftTierAccountHoldings key={nft.tokenId} nft={nft} />
            ))}

            <Form.Item label={t`Memo`}>
              <MemoFormInput value={memo} onChange={setMemo} />
            </Form.Item>
          </Form>

          {canRedeem && !totalSupplyExceeded && minReturnedTokens?.gt(0) ? (
            <div className="mt-5 font-medium">
              <>
                {/* If USD denominated, can only define the lower limit (not exact amount), hence 'at least' */}
                {/* Using 4 full sentences for translation purposes */}
                {!personalBalanceExceeded ? (
                  <>
                    {inUSD ? (
                      <Trans>
                        You will receive at least{' '}
                        <ETHAmount amount={minReturnedTokens} />
                      </Trans>
                    ) : (
                      <Trans>
                        You will receive{' '}
                        <ETHAmount amount={minReturnedTokens} />
                      </Trans>
                    )}
                  </>
                ) : (
                  <>
                    {inUSD ? (
                      <Trans>
                        You would receive at least{' '}
                        <ETHAmount amount={minReturnedTokens} />
                      </Trans>
                    ) : (
                      <Trans>
                        You would receive{' '}
                        <ETHAmount amount={minReturnedTokens} />
                      </Trans>
                    )}
                  </>
                )}
              </>
            </div>
          ) : null}
        </div>
      </Space>
    </TransactionModal>
  )
}
