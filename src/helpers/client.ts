import env from '@/helpers/env'
import { NeynarAPIClient } from '@standard-crypto/farcaster-js'

export default new NeynarAPIClient(env.API_KEY)
