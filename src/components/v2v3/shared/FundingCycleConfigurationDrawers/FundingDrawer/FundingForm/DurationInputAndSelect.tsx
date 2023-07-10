import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import { durationOptions } from 'components/inputs/DurationInput'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { JuiceListbox } from 'components/inputs/JuiceListbox'

export default function DurationInputAndSelect({
  hideTitle,
  disabled,
}: {
  hideTitle?: boolean
  disabled?: boolean
}) {
  return (
    <div className="flex">
      <Form.Item
        name="duration"
        label={hideTitle ? null : <Trans>Funding cycle duration</Trans>}
        className="w-full"
        required
      >
        <FormattedNumberInput
          className="h-10 pr-4"
          placeholder="30"
          min={1}
          disabled={disabled}
        />
      </Form.Item>
      <Form.Item name="durationUnit" label={hideTitle ? null : <span></span>}>
        <JuiceListbox
          className="h-8 min-w-[125px]"
          buttonClassName="py-2"
          options={durationOptions()}
          disabled={disabled}
        />
      </Form.Item>
    </div>
  )
}
