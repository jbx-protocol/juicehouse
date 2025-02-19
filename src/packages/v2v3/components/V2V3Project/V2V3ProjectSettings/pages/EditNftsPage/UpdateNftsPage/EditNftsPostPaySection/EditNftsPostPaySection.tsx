import { Trans } from '@lingui/macro'
import { Button, Form } from 'antd'
import { NftPaymentSuccessFormItems } from 'components/NftRewards/AddNftCollectionForm/NftPaymentSuccessFormItems'
import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { revalidateProject } from 'lib/api/nextjs'
import { useEditProjectDetailsTx } from 'packages/v2v3/hooks/transactor/useEditProjectDetailsTx'
import { useCallback, useContext, useState } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { emitInfoNotification } from 'utils/notifications'
import {
  EditNftsPostPayFormFields,
  useEditNftsPostPayForm,
} from './useEditNftsPostPayForm'

export function EditNftsPostPaySection() {
  const [loading, setLoading] = useState<boolean>()
  const { projectMetadata, refetchProjectMetadata, projectId } = useContext(
    ProjectMetadataContext,
  )
  const { form, initialValues } = useEditNftsPostPayForm()

  const postPayModalData = useAppSelector(
    state => state.editingV2Project.nftRewards.postPayModal,
  )

  const editProjectDetailsTx = useEditProjectDetailsTx()

  const onProjectFormSaved = useCallback(async () => {
    setLoading(true)

    const fields: EditNftsPostPayFormFields = form.getFieldsValue(true)
    const uploadedMetadata = await uploadProjectMetadata({
      ...projectMetadata,
      nftPaymentSuccessModal: {
        ctaText: fields.postPayButtonText,
        ctaLink: fields.postPayButtonLink,
        content: fields.postPayMessage,
      },
    })

    if (!uploadedMetadata.Hash) {
      setLoading(false)
      return
    }

    const txSuccess = await editProjectDetailsTx(
      {
        cid: uploadedMetadata.Hash,
      },
      {
        onConfirmed: async () => {
          setLoading(false)

          emitInfoNotification('NFT post-pay data changed', {
            description: 'Your new NFT post-pay has been saved.',
          })

          if (projectId) {
            await revalidateProject({
              pv: PV_V2,
              projectId: String(projectId),
            })
          }
          refetchProjectMetadata()
        },
        onError: () => {
          setLoading(false)
        },
        onCancelled: () => {
          setLoading(false)
        },
      },
    )

    if (!txSuccess) {
      setLoading(false)
    }
  }, [
    editProjectDetailsTx,
    form,
    projectMetadata,
    projectId,
    refetchProjectMetadata,
  ])

  return (
    <Form form={form} initialValues={initialValues}>
      <NftPaymentSuccessFormItems
        hidePreview
        postPayModalData={postPayModalData}
      />
      <Button type="primary" onClick={onProjectFormSaved} loading={loading}>
        <Trans>Save post-pay popup</Trans>
      </Button>
    </Form>
  )
}
