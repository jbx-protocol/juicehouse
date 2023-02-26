import { RightCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { ADDRESS_ZERO } from '@uniswap/v3-sdk'
import { Col, Form, Row, Space } from 'antd'
import { Callout } from 'components/Callout'
import { useLockPageRulesWrapper } from 'components/Create/hooks/useLockPageRulesWrapper'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import PrefixedInput from 'components/PrefixedInput'
import { CREATE_FLOW } from 'constants/fathomEvents'
import { useWallet } from 'hooks/Wallet'
import { trackFathomGoal } from 'lib/fathom'
import Link from 'next/link'
import { useContext } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { inputMustBeEthAddressRule, inputMustExistRule } from 'utils/antdRules'
import { CreateCollapse } from '../../CreateCollapse'
import { OptionalHeader } from '../../OptionalHeader'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { useProjectDetailsForm } from './hooks/ProjectDetailsForm'

export const ProjectDetailsPage: React.FC = () => {
  useSetCreateFurthestPageReached('projectDetails')

  const { goToNextPage } = useContext(PageContext)
  const formProps = useProjectDetailsForm()
  const lockPageRulesWrapper = useLockPageRulesWrapper()
  const wallet = useWallet()

  const inputWalletAddress = Form.useWatch('inputProjectOwner', formProps.form)

  const projectOwnerDifferentThanWalletAddress =
    inputWalletAddress && wallet.userAddress !== inputWalletAddress

  return (
    <Form
      {...formProps}
      name="projectDetails"
      colon={false}
      layout="vertical"
      onFinish={() => {
        goToNextPage?.()
        trackFathomGoal(CREATE_FLOW.DETAILS_NEXT_CTA)
      }}
      scrollToFirstError
    >
      <Space className="w-full" direction="vertical" size="large">
        <Form.Item
          name="projectName"
          label={t`Project Name`}
          required
          rules={lockPageRulesWrapper([
            inputMustExistRule({ label: t`Project Name` }),
          ])}
        >
          <JuiceInput />
        </Form.Item>
        <Form.Item name="projectDescription" label={t`Project Description`}>
          <JuiceTextArea autoSize={{ minRows: 4, maxRows: 6 }} />
        </Form.Item>
        <Form.Item name="logo" label={t`Logo`}>
          <FormImageUploader text={t`Upload`} maxSizeKBs={10000} />
        </Form.Item>
        <CreateCollapse>
          <CreateCollapse.Panel
            key={0}
            header={<OptionalHeader header={t`Project Links`} />}
            hideDivider
          >
            {/* Adding paddingBottom is a bit of a hack, but horizontal gutters not working */}
            <Row className="pb-8 pt-5" gutter={32}>
              <Col span={12}>
                <Form.Item name="projectWebsite" label={t`Website`}>
                  {/* Set placeholder as url string origin without port */}
                  <JuiceInput prefix="https://" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="projectTwitter" label={t`Twitter`}>
                  <PrefixedInput prefix={'@'} />
                </Form.Item>
              </Col>
            </Row>
            <Row className="mb-6" gutter={32}>
              <Col span={12}>
                <Form.Item name="projectDiscord" label={t`Discord`}>
                  <JuiceInput prefix="https://" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="projectTelegram" label={t`Telegram`}>
                  <JuiceInput prefix="https://" />
                </Form.Item>
              </Col>
            </Row>
          </CreateCollapse.Panel>
          <CreateCollapse.Panel
            key={1}
            header={<OptionalHeader header={t`Project Owner`} />}
            hideDivider
          >
            <Form.Item
              className="pb-8 pt-5"
              name="inputProjectOwner"
              label={t`Input project owner address`}
              extra={t`Nominate an Ethereum wallet address to become the ‘owner’ of this project. If you intend to manage this project from the address that deployed it, leave this blank.`}
              rules={lockPageRulesWrapper([
                inputMustBeEthAddressRule({
                  label: t`Input project owner address`,
                }),
              ])}
            >
              <EthAddressInput placeholder={ADDRESS_ZERO} />
            </Form.Item>
            {projectOwnerDifferentThanWalletAddress && (
              <Callout.Warning collapsible={false}>
                <Trans>
                  Warning: once deployed, the nominated address will become the
                  owner of this project and you will not be able to make changes
                  unless you have access to the wallet address nominated.
                </Trans>
              </Callout.Warning>
            )}
          </CreateCollapse.Panel>
          <CreateCollapse.Panel
            key={2}
            header={<OptionalHeader header={t`Project page customizations`} />}
            hideDivider
          >
            <Form.Item
              name="coverImage"
              label={t`Cover image`}
              required={false}
              tooltip={t`Add a cover image to your project page. This will be displayed at the top of your project page.`}
              extra={t`1400px x 256px image size recommended.`}
            >
              <FormImageUploader text={t`Upload`} maxSizeKBs={10000} />
            </Form.Item>

            <Row className="pb-8 pt-5" gutter={32}>
              <Col span={12}>
                <Form.Item
                  name="payButtonText"
                  label={<Trans>Pay Button Text</Trans>}
                  tooltip={t`This is the button that contributors will click to pay your project`}
                >
                  <JuiceInput placeholder={t`Pay`} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="payDisclosure"
              label={<Trans>Pay Disclosure</Trans>}
              tooltip={t`Display a message or warning to contributors before they approve a payment to your project`}
            >
              <JuiceTextArea autoSize={{ minRows: 4, maxRows: 6 }} />
            </Form.Item>
          </CreateCollapse.Panel>
        </CreateCollapse>
      </Space>

      <Wizard.Page.ButtonControl />

      <div className="mt-12 text-center">
        <Link href="/contact">
          <a className="hover-text-decoration-underline cursor-pointer text-sm text-grey-500 dark:text-grey-300">
            <Trans>Need help?</Trans>
            <div>
              <Space size="small" className="text-haze-500 dark:text-haze-300">
                <Trans>Contact a contributor.</Trans>
                <RightCircleOutlined />
              </Space>
            </div>
          </a>
        </Link>
      </div>
    </Form>
  )
}
