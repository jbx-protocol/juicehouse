import { waitForTransactionReceipt } from '@wagmi/core'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { FormikHelpers } from 'formik'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { DEFAULT_METADATA, NATIVE_TOKEN } from 'juice-sdk-core'
import {
  useJBContractContext,
  useJBRulesetContext,
  usePreparePayMetadata,
  useWriteJbMultiTerminalPay,
} from 'juice-sdk-react'
import { useProjectSelector } from 'packages/v4/components/ProjectDashboard/redux/hooks'
import { useV4NftRewards } from 'packages/v4/contexts/V4NftRewards/V4NftRewardsProvider'
import { useProjectHasErc20Token } from 'packages/v4/hooks/useProjectHasErc20Token'
import { V4_CURRENCY_ETH } from 'packages/v4/utils/currency'
import { ProjectPayReceipt } from 'packages/v4/views/V4ProjectDashboard/hooks/useProjectPageQueries'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { useCallback, useContext, useMemo } from 'react'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { Address, Hash, parseEther } from 'viem'
import { useProjectPaymentTokens } from '../useProjectPaymentTokens'
import { PayProjectModalFormValues } from './usePayProjectModal'

export const usePayProjectTx = ({
  onTransactionPending: onTransactionPendingCallback,
  onTransactionConfirmed: onTransactionConfirmedCallback,
  onTransactionError: onTransactionErrorCallback,
}: {
  onTransactionPending: (
    formikHelpers: FormikHelpers<PayProjectModalFormValues>,
  ) => void
  onTransactionConfirmed: (
    payReceipt: ProjectPayReceipt,
    formikHelpers: FormikHelpers<PayProjectModalFormValues>,
  ) => void
  onTransactionError: (
    error: Error,
    formikHelpers: FormikHelpers<PayProjectModalFormValues>,
  ) => void
}) => {
  const { userAddress } = useWallet()
  const { payAmount, chosenNftRewards } = useProjectSelector(
    state => state.projectCart,
  )
  const {
    nftRewards: { rewardTiers },
  } = useV4NftRewards()
  const converter = useCurrencyConverter()
  const { receivedTickets } = useProjectPaymentTokens()
  // TODO: is this needed for preferClaimedTokens?
  const projectHasErc20 = useProjectHasErc20Token()

  const buildPayReceipt = useCallback(
    (txHash: Hash): ProjectPayReceipt => {
      return {
        totalAmount: payAmount ?? {
          amount: 0,
          currency: V4_CURRENCY_ETH,
        },
        nfts: chosenNftRewards ?? [],
        timestamp: new Date(),
        transactionHash: txHash,
        fromAddress: userAddress ?? '',
        tokensReceived: receivedTickets ?? '',
      }
    },
    [chosenNftRewards, payAmount, receivedTickets, userAddress],
  )

  const weiAmount = useMemo(() => {
    if (!payAmount) {
      return 0n
    } else if (payAmount.currency === V4_CURRENCY_ETH) {
      return parseEther(payAmount.amount.toString())
    } else {
      return converter.usdToWei(payAmount.amount).toBigInt()
    }
  }, [payAmount, converter])

  const {
    rulesetMetadata: { data: rulesetMetadata },
  } = useJBRulesetContext()
  const metadata = usePreparePayMetadata(
    rulesetMetadata?.dataHook
      ? {
          jb721Hook: {
            dataHookAddress: rulesetMetadata.dataHook,
            tierIdsToMint: chosenNftRewards
              .map(({ id, quantity }) => Array(quantity).fill(BigInt(id)))
              .flat(),
          },
        }
      : undefined,
  )

  const { writeContractAsync: writePay } = useWriteJbMultiTerminalPay()
  const { contracts, projectId } = useJBContractContext()
  const { addTransaction } = useContext(TxHistoryContext)

  return useCallback(
    async (
      values: PayProjectModalFormValues,
      formikHelpers: FormikHelpers<PayProjectModalFormValues>,
    ) => {
      if (
        !weiAmount ||
        !contracts.primaryNativeTerminal.data ||
        !userAddress ||
        !values.userAcceptsTerms
      ) {
        return
      }

      const { messageString, attachedUrl } = values.message
      const memo = buildPaymentMemo({
        text: messageString,
        imageUrl: attachedUrl,
        nftUrls: chosenNftRewards
          .map(
            ({ id }) =>
              (rewardTiers ?? []).find(({ id: tierId }) => tierId === id)
                ?.fileUrl,
          )
          .filter((url): url is string => !!url),
      })
      const beneficiary = (values.beneficiaryAddress ?? userAddress) as Address
      const args = [
        projectId,
        NATIVE_TOKEN,
        weiAmount,
        beneficiary,
        0n,
        memo,
        metadata ?? DEFAULT_METADATA,
      ] as const

      // SIMULATE TRANSACTION:
      // const encodedData = encodeFunctionData({
      //   abi: jbMultiTerminalAbi, // ABI of the contract
      //   functionName: 'pay',
      //   args,
      // })
      try {
        const hash = await writePay({
          address: contracts.primaryNativeTerminal.data,
          args,
          value: weiAmount,
        })

        onTransactionPendingCallback(formikHelpers)
        addTransaction?.('Pay', { hash })
        const transactionReceipt = await waitForTransactionReceipt(
          wagmiConfig,
          {
            hash,
          },
        )

        onTransactionConfirmedCallback(buildPayReceipt(hash), formikHelpers)
      } catch (e) {
        onTransactionErrorCallback(
          (e as Error) ?? new Error('Transaction failed'),
          formikHelpers,
        )
      }
    },
    [
      weiAmount,
      contracts.primaryNativeTerminal.data,
      userAddress,
      chosenNftRewards,
      projectId,
      metadata,
      rewardTiers,
      writePay,
      onTransactionPendingCallback,
      addTransaction,
      onTransactionConfirmedCallback,
      buildPayReceipt,
      onTransactionErrorCallback,
    ],
  )
}
