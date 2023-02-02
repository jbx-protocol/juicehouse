import { t } from '@lingui/macro'
import { Row } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import useMobile from 'hooks/Mobile'
import { DescriptionCol } from '../DescriptionCol'
import { useRulesReview } from './hooks/RulesReview'
import { MobileRulesReview } from './MobileRulesReview'

export const RulesReview = () => {
  const isMobile = useMobile()
  const {
    customAddress,
    pausePayments,
    strategy,
    terminalConfiguration,
    controllerConfiguration,
    terminalMigration,
    controllerMigration,
    holdFees,
  } = useRulesReview()

  return (
    <div className="flex flex-col gap-10 pt-5 pb-8">
      {isMobile ? (
        <MobileRulesReview />
      ) : (
        <>
          <Row gutter={20}>
            <DescriptionCol
              span={5}
              title={t`Reconfiguration`}
              desc={
                <div className="text-base font-medium">
                  {strategy ? (
                    strategy
                  ) : customAddress ? (
                    <FormattedAddress address={customAddress} />
                  ) : (
                    '??'
                  )}
                </div>
              }
            />
            <DescriptionCol
              span={5}
              title={t`Payments`}
              desc={
                <div className="text-base font-medium">{pausePayments}</div>
              }
            />
            <DescriptionCol
              span={5}
              title={t`Hold fees`}
              desc={<div className="text-base font-medium">{holdFees}</div>}
            />
          </Row>
          <Row gutter={20}>
            <DescriptionCol
              span={5}
              title={t`Terminal configuration`}
              desc={
                <div className="text-base font-medium">
                  {terminalConfiguration}
                </div>
              }
            />
            <DescriptionCol
              span={5}
              title={t`Controller configuration`}
              desc={
                <div className="text-base font-medium">
                  {controllerConfiguration}
                </div>
              }
            />
            <DescriptionCol
              span={5}
              title={t`Terminal migration`}
              desc={
                <div className="text-base font-medium">{terminalMigration}</div>
              }
            />
            <DescriptionCol
              span={5}
              title={t`Controller migration`}
              desc={
                <div className="text-base font-medium">
                  {controllerMigration}
                </div>
              }
            />
          </Row>
        </>
      )}
    </div>
  )
}
