import { Trans, t } from '@lingui/macro'
import { Modal } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'

import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { useContext } from 'react'
import { isZeroAddress } from 'utils/address'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { useQuery } from '@tanstack/react-query'
import {
  OrderDirection,
  ParticipantsQuery,
  QueryParticipantsArgs,
  Participant_OrderBy as V1V2V3Participant_OrderBy,
  ParticipantsDocument as V1V2V3ParticipantsDocument,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { paginateDepleteQuery } from 'lib/apollo/paginateDepleteQuery'
import TokenDistributionChart from 'packages/v2v3/components/V2V3Project/modals/ParticipantsModal/TokenDistributionChart'
import HoldersList from './HoldersList'

export default function ParticipantsModal({
  tokenSymbol,
  tokenAddress,
  totalTokenSupply,
  open,
  onCancel,
}: {
  tokenSymbol: string | undefined
  tokenAddress: string | undefined
  totalTokenSupply: BigNumber | undefined
  open: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  const { projectId, pv } = useContext(ProjectMetadataContext)

  const { data: allParticipants, isLoading } = useQuery({
    queryKey: [`token-holders-${projectId}-${pv}`],
    queryFn: () =>
      paginateDepleteQuery<ParticipantsQuery, QueryParticipantsArgs>({
        client,
        document: V1V2V3ParticipantsDocument,
        variables: {
          orderDirection: OrderDirection.desc,
          orderBy: V1V2V3Participant_OrderBy.balance,
          where: {
            projectId,
            pv,
            wallet_not: constants.AddressZero,
          },
        },
      }),
    staleTime: 5 * 60 * 1000, // 5 min
    enabled: Boolean(projectId && open),
  })

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onCancel}
      okText={t`Done`}
      cancelButtonProps={{ hidden: true }}
      destroyOnClose={true}
    >
      <div>
        <h4>
          <Trans>
            {tokenSymbolText({ tokenSymbol, capitalize: true })} holders
          </Trans>
        </h4>
        <div className="flex flex-col gap-4">
          <div>
            {tokenAddress && !isZeroAddress(tokenAddress) && (
              <div>
                <Trans>
                  Token address: <EthereumAddress address={tokenAddress} />
                </Trans>
              </div>
            )}
            <div>{allParticipants?.length} wallets</div>
          </div>

          <div className="flex items-center justify-center">
            <TokenDistributionChart
              participants={allParticipants}
              isLoading={isLoading}
              tokenSupply={totalTokenSupply}
            />
          </div>

          <HoldersList
            projectId={projectId}
            pv={pv}
            tokenSymbol={tokenSymbol}
            totalTokenSupply={totalTokenSupply}
          />
        </div>
      </div>
    </Modal>
  )
}
