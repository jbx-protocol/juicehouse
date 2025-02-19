import { Contract } from '@ethersproject/contracts'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { getLogger } from 'lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { loadJBProjectHandlesContract } from 'packages/v2v3/hooks/JBProjectHandles/contracts/loadJBProjectHandles'

const logger = getLogger('api/juicebox/projectHandle/[projectId]')

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'method not supported' })
  }

  try {
    const { projectId } = req.query

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' })
    }

    const JBProjectHandlesJson = await loadJBProjectHandlesContract(
      readNetwork.name,
    )
    const JBProjectHandles = new Contract(
      JBProjectHandlesJson.address,
      JBProjectHandlesJson.abi,
      readProvider,
    )

    const handle = await JBProjectHandles.handleOf(projectId)

    // cache for a day if project handle found
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
    logger.info({ data: { handle, projectId } })
    return res.status(200).json({ handle, projectId })
  } catch (err) {
    logger.error({ error: err })
    return res.status(500).json({ error: 'failed to resolve project handle' })
  }
}

export default handler
