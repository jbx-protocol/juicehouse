import { useForm } from 'antd/lib/form/Form'
import { useAppSelector } from 'hooks/AppSelector'
import { useMemo } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { useFormDispatchWatch } from '../../hooks'

type ProjectDetailsFormProps = Partial<{
  projectName: string
  projectDescription: string
  logo: string
  projectWebsite: string
  projectTwitter: string
  projectTelegram: string
  projectDiscord: string
  payButtonText: string
  payDisclosure: string
  inputProjectOwner: string
}>

export const useProjectDetailsForm = () => {
  const [form] = useForm<ProjectDetailsFormProps>()
  const { projectMetadata, inputProjectOwner } = useAppSelector(
    state => state.editingV2Project,
  )

  const initialValues: ProjectDetailsFormProps = useMemo(
    () => ({
      projectName: projectMetadata.name,
      projectDescription: projectMetadata.description,
      logo: projectMetadata.logoUri,
      projectWebsite: projectMetadata.infoUri,
      projectTwitter: projectMetadata.twitter,
      projectTelegram: projectMetadata.telegram,
      projectDiscord: projectMetadata.discord,
      payButtonText: projectMetadata.payButton,
      payDisclosure: projectMetadata.payDisclosure,
      inputProjectOwner,
    }),
    [
      inputProjectOwner,
      projectMetadata.description,
      projectMetadata.discord,
      projectMetadata.infoUri,
      projectMetadata.logoUri,
      projectMetadata.name,
      projectMetadata.payButton,
      projectMetadata.payDisclosure,
      projectMetadata.twitter,
      projectMetadata.telegram,
    ],
  )

  useFormDispatchWatch({
    form,
    fieldName: 'projectName',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setName,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectDescription',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setDescription,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'logo',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setLogoUri,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectWebsite',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setInfoUri,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectTwitter',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setTwitter,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectDiscord',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setDiscord,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectTelegram',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setTelegram,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'inputProjectOwner',
    ignoreUndefined: false,
    dispatchFunction: editingV2ProjectActions.setInputProjectOwner,
    formatter: v => v,
  })
  useFormDispatchWatch({
    form,
    fieldName: 'payButtonText',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setPayButton,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'payDisclosure',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setPayDisclosure,
    formatter: v => v ?? '',
  })

  return { form, initialValues }
}
