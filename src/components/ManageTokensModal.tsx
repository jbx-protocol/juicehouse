import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Modal, Space, Tooltip } from 'antd'
import RichButton from 'components/RichButton'
import { PropsWithChildren, useState } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { reloadWindow } from 'utils/windowUtils'

type RedeemDisabledReason = 'redemptionRateZero' | 'overflowZero'

const RedeemButtonTooltip = ({
  buttonDisabled,
  redeemDisabledReason,
  children,
}: PropsWithChildren<{
  redeemDisabledReason?: RedeemDisabledReason
  buttonDisabled?: boolean
}>) => {
  if (!buttonDisabled) return <>{children}</>

  return (
    <Tooltip
      title={
        redeemDisabledReason === 'overflowZero' ? (
          <Trans>
            You cannot redeem your tokens for ETH because this project has no
            overflow.
          </Trans>
        ) : (
          <Trans>
            You cannot redeem your tokens for ETH because this project's
            redemption rate is zero.
          </Trans>
        )
      }
      placement="right"
    >
      {children}
    </Tooltip>
  )
}

type ModalProps = {
  visible?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}

export default function ManageTokensModal({
  onCancel,
  visible,
  projectAllowsMint,
  userHasMintPermission,
  hasOverflow,
  redeemDisabled,
  tokenSymbol,
  tokenAddress,

  children,
  RedeemModal,
  ClaimTokensModal,
  MintModal,
  TransferUnclaimedModal,
}: PropsWithChildren<{
  userHasMintPermission: boolean
  projectAllowsMint: boolean
  onCancel?: VoidFunction
  visible?: boolean
  hasOverflow: boolean | undefined
  redeemDisabled: boolean | undefined
  tokenSymbol: string | undefined
  tokenAddress: string | undefined

  RedeemModal: (props: ModalProps) => JSX.Element | null
  ClaimTokensModal: (props: ModalProps) => JSX.Element | null
  MintModal: (props: ModalProps) => JSX.Element | null
  TransferUnclaimedModal: (props: ModalProps) => JSX.Element | null
}>) {
  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)
  const [unstakeModalVisible, setUnstakeModalVisible] = useState<boolean>()
  const [mintModalVisible, setMintModalVisible] = useState<boolean>()
  const [transferTokensModalVisible, setTransferTokensModalVisible] =
    useState<boolean>()

  const tokensLabel = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const redeemDisabledReason = !hasOverflow
    ? 'overflowZero'
    : 'redemptionRateZero'
  const hasIssuedTokens = tokenAddress && tokenAddress !== constants.AddressZero

  return (
    <>
      <Modal
        title={t`Manage your ${tokenSymbolText({
          tokenSymbol,
          capitalize: false,
          plural: true,
          includeTokenWord: true,
        })}`}
        visible={visible}
        onCancel={onCancel}
        okButtonProps={{ hidden: true }}
        centered
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <RedeemButtonTooltip
            buttonDisabled={redeemDisabled}
            redeemDisabledReason={redeemDisabledReason}
          >
            <div>
              <RichButton
                heading={<Trans>Redeem {tokensLabel} for ETH</Trans>}
                description={
                  <Trans>
                    Redeem your {tokensLabel} for a portion of the project's
                    overflow. Any {tokensLabel} you redeem will be burned.
                  </Trans>
                }
                onClick={() => setRedeemModalVisible(true)}
                disabled={redeemDisabled}
              />
            </div>
          </RedeemButtonTooltip>

          {redeemDisabled && (
            <RichButton
              heading={<Trans>Burn {tokensLabel}</Trans>}
              description={
                <>
                  {redeemDisabledReason === 'overflowZero' ? (
                    <Trans>
                      Burn your {tokensLabel}. You won't receive ETH in return
                      because this project has no overflow.
                    </Trans>
                  ) : (
                    <Trans>
                      Burn your {tokensLabel}. You won't receive ETH in return
                      because this project's redemption rate is zero.
                    </Trans>
                  )}
                </>
              }
              onClick={() => setRedeemModalVisible(true)}
            />
          )}

          {hasIssuedTokens && (
            <RichButton
              heading={<Trans>Claim {tokensLabel} as ERC-20</Trans>}
              description={
                <Trans>
                  Move your {tokensLabel} from the Juicebox contract to your
                  wallet.
                </Trans>
              }
              onClick={() => setUnstakeModalVisible(true)}
            />
          )}

          {userHasMintPermission && projectAllowsMint && (
            <Tooltip
              title={
                <Trans>
                  Token minting is only available for V1.1 projects. Token
                  minting can be enabled or disabled by reconfiguring the
                  project's funding cycle.
                </Trans>
              }
              placement="right"
            >
              <div>
                <RichButton
                  heading={<Trans>Mint {tokensLabel}</Trans>}
                  description={
                    <Trans>
                      Mint new {tokensLabel} into an account. Only a project's
                      owner, a designated operator, or one of its terminal's
                      delegates can mint its tokens.
                    </Trans>
                  }
                  onClick={() => setMintModalVisible(true)}
                  disabled={!projectAllowsMint}
                />
              </div>
            </Tooltip>
          )}
          <div>
            <RichButton
              heading={<Trans>Transfer unclaimed {tokensLabel}</Trans>}
              description={
                <Trans>
                  {' '}
                  Move your unclaimed {tokensLabel} from your wallet to another
                  wallet.
                </Trans>
              }
              onClick={() => setTransferTokensModalVisible(true)}
            />
          </div>

          {children}
        </Space>
      </Modal>

      <RedeemModal
        visible={redeemModalVisible}
        onCancel={() => setRedeemModalVisible(false)}
        onConfirmed={reloadWindow}
      />
      <ClaimTokensModal
        visible={unstakeModalVisible}
        onCancel={() => setUnstakeModalVisible(false)}
        onConfirmed={reloadWindow}
      />
      <MintModal
        visible={mintModalVisible}
        onCancel={() => setMintModalVisible(false)}
        onConfirmed={reloadWindow}
      />
      <TransferUnclaimedModal
        visible={transferTokensModalVisible}
        onCancel={() => setTransferTokensModalVisible(false)}
        onConfirmed={reloadWindow}
      />
    </>
  )
}
