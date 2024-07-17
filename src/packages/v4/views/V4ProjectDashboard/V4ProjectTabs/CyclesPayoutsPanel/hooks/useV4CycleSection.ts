import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useJBRuleset } from 'juice-sdk-react'
import { useJBUpcomingRuleset } from 'packages/v4/hooks/useJBUpcomingRuleset'
import { usePayoutLimits } from 'packages/v4/hooks/usePayoutLimits'
import { useUpcomingPayoutLimits } from 'packages/v4/hooks/useQueuedPayoutLimits'
import { useV4FormatConfigurationCycleSection } from './useV4FormatConfigurationCycleSection'

export const useV4CycleSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { data: ruleset } = useJBRuleset()
  
  const { ruleset: upcomingRuleset, isLoading: upcomingRulesetLoading } = useJBUpcomingRuleset()

  const { data: payoutLimits } = usePayoutLimits()
  const payoutLimitAmount = payoutLimits?.amount
  const payoutLimitCurrency = payoutLimits?.currency

  const { data: upcomingPayoutLimits, isLoading: upcomingPayoutLimitLoading } = useUpcomingPayoutLimits()
  const upcomingPayoutLimitAmount = upcomingPayoutLimits?.amount
  const upcomingPayoutLimitCurrency = upcomingPayoutLimits?.currency
  
  return useV4FormatConfigurationCycleSection({
    ruleset,
    payoutLimitAmountCurrency: {
      amount: payoutLimitAmount,
      currency: payoutLimitCurrency,
    },
    upcomingRulesetLoading,
    upcomingPayoutLimitLoading,
    upcomingRuleset,
    upcomingPayoutLimitAmountCurrency: {
      amount: upcomingPayoutLimitAmount,
      currency: upcomingPayoutLimitCurrency,
    },

    // Hide upcoming info from current section.
    ...(type === 'current' && {
      upcomingRuleset: null,
      upcomingPayoutLimitAmountCurrency: null,
    }),
  })
}
