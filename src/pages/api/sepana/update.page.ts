import { BigNumber } from '@ethersproject/bignumber'
import { readProvider } from 'constants/readProvider'
import { ipfsGetWithFallback } from 'lib/api/ipfs'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { SepanaProject } from 'models/sepana'
import { Project } from 'models/subgraph-entities/vX/project'
import { NextApiHandler } from 'next'
import { querySubgraphExhaustive } from 'utils/graph'

import { queryAllSepanaProjects, writeSepanaDocs } from './utils'

const projectKeys: (keyof Project)[] = [
  'id',
  'projectId',
  'pv',
  'handle',
  'metadataUri',
  'currentBalance',
  'totalPaid',
  'createdAt',
  'trendingScore',
  'deployer',
]

// Synchronizes the Sepana engine with the latest Juicebox Subgraph/IPFS data
const handler: NextApiHandler = async (_, res) => {
  const sepanaProjects = (await queryAllSepanaProjects()).data.hits.hits

  const changedSubgraphProjects = (
    await querySubgraphExhaustive({
      entity: 'project',
      keys: projectKeys,
    })
  )
    // Upserting data in Sepana requires the `_id` param to be included, so we include it here
    // https://docs.sepana.io/sepana-search-api/web3-search-cloud/search-api#request-example-2
    .map(p => ({ ...p, _id: p.id }))
    .map(p =>
      Object.entries(p).reduce(
        (acc, [k, v]) => ({
          ...acc,
          [k]: BigNumber.isBigNumber(v) ? v.toString() : v, // Store BigNumbers as strings
        }),
        {} as SepanaProject,
      ),
    )
    .filter(subgraphProject => {
      const sepanaProject = sepanaProjects.find(
        p => subgraphProject.id === p._source.id,
      )

      // Deep compare subgraph project with sepana project to find which projects have changed or not yet been stored on sepana
      return (
        !sepanaProject ||
        projectKeys.some(k => subgraphProject[k] !== sepanaProject._source[k])
      )
    })

  const latestBlock = await readProvider.getBlockNumber()
  const updatedSepanaProjects: Promise<SepanaProject>[] = []

  for (let i = 0; i < changedSubgraphProjects.length; i++) {
    // Update metadata & `lastUpdated` for each sepana project

    const p = changedSubgraphProjects[i]

    if (i && i % 100 === 0) {
      // Arbitrary delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 750))
    }

    try {
      updatedSepanaProjects.push(
        ipfsGetWithFallback<ProjectMetadataV5>(p.metadataUri).then(
          ({ data: { logoUri, name, description } }) => ({
            ...p,
            name,
            description,
            logoUri,
            lastUpdated: latestBlock,
          }),
        ),
      )
    } catch (error) {
      res.status(500).send({
        message: `Error fetching ${p.metadataUri} from IPFS`,
        error,
      })
    }
  }

  // Write updated projects
  await writeSepanaDocs(await Promise.all(updatedSepanaProjects))

  res.status(200).send(`Updated ${updatedSepanaProjects.length} projects`)
}

export default handler
