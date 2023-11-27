import axios from 'axios'
import { useProjectMetadata } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectMetadata'
import { ProjectOFACContext } from 'contexts/shared/ProjectOFACContext'
import { useWallet } from 'hooks/Wallet'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

const OFAC_API = 'https://api.wewantjusticedao.org/donation/validate'

export default function V2V3ProjectOFACProvider({
  children,
}: {
  children?: ReactNode
}) {
  const { userAddress, isConnected } = useWallet()
  const { projectMetadata } = useProjectMetadata()

  const [isAddressListedInOFAC, setIsListed] = useState<boolean | undefined>()

  const shouldCheckOfac = useMemo(() => {
    return projectMetadata?.projectRequiredOFACCheck && isConnected
  }, [projectMetadata?.projectRequiredOFACCheck, isConnected])

  const checkIsAddressListedInOFAC = useCallback(async (address: string) => {
    try {
      const { data } = await axios.get<{ isGoodAddress: boolean }>(
        `${OFAC_API}?address=${address}`,
      )
      setIsListed(!data.isGoodAddress)
    } catch (err) {
      setIsListed(true)
    }
  }, [])

  useEffect(() => {
    if (shouldCheckOfac && userAddress) {
      checkIsAddressListedInOFAC(userAddress)
    }
  }, [shouldCheckOfac, userAddress, checkIsAddressListedInOFAC])

  return (
    <ProjectOFACContext.Provider value={{ isAddressListedInOFAC }}>
      {children}
    </ProjectOFACContext.Provider>
  )
}
