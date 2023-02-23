import { Form } from 'antd'
import { AllocationSplit } from 'components/Allocation'
import { TreasurySelection } from 'models/treasurySelection'
import { useDebugValue, useEffect, useMemo } from 'react'
import { useAppDispatch } from 'redux/hooks/AppDispatch'
import { useAppSelector } from 'redux/hooks/AppSelector'
import { useEditingPayoutSplits } from 'redux/hooks/EditingPayoutSplits'
import { allocationToSplit, splitToAllocation } from 'utils/splitToAllocation'

type TreasurySetupFormProps = Partial<{
  selection: TreasurySelection
  payoutsList: AllocationSplit[]
}>

export const useTreasurySetupForm = () => {
  const [form] = Form.useForm<TreasurySetupFormProps>()
  const { treasurySelection } = useAppSelector(state => state.editingV2Project)
  const [splits, setSplits] = useEditingPayoutSplits()
  useDebugValue(form.getFieldsValue())

  const initialValues: TreasurySetupFormProps | undefined = useMemo(() => {
    const selection = treasurySelection ?? 'amount'
    if (!splits.length) {
      return { selection }
    }
    const payoutsList: AllocationSplit[] = splits.map(splitToAllocation)
    return { payoutsList, selection }
  }, [splits, treasurySelection])

  const dispatch = useAppDispatch()
  const payoutsList = Form.useWatch('payoutsList', form)
  const selection = Form.useWatch('selection', form)

  useEffect(() => {
    setSplits(payoutsList?.map(allocationToSplit) ?? [])
  }, [dispatch, payoutsList, selection, setSplits])

  return { initialValues, form }
}
