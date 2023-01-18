import axios from 'axios'
import { INFURA_IPFS_API_BASE_URL } from 'constants/ipfs'

const INFURA_IPFS_PROJECT_ID = process.env.INFURA_IPFS_PROJECT_ID
const INFURA_IPFS_API_SECRET = process.env.INFURA_IPFS_API_SECRET

const AUTH_HEADER = `Basic ${Buffer.from(
  `${INFURA_IPFS_PROJECT_ID}:${INFURA_IPFS_API_SECRET}`,
).toString('base64')}`

const DEV_ORIGIN = 'http://localhost:3000'
const MAINNET_ORIGIN = 'https://juicebox.money'

const origin =
  process.env.NODE_ENV === 'development' ? DEV_ORIGIN : MAINNET_ORIGIN

const infuraApi = axios.create({
  baseURL: INFURA_IPFS_API_BASE_URL,
  headers: {
    Authorization: AUTH_HEADER,
    origin,
  },
})

/**
 * Adds a file to ipfs and pins with Infura
 * https://docs.infura.io/infura/networks/ipfs/http-api-methods/add
 */
export function pin<D>(data: D) {
  return infuraApi.post<D, { Name: string; Hash: string; Size: string }>(
    '/api/ipfs/add',
    {
      data,
    },
  )
}
