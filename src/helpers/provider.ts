import { AlchemyProvider } from 'ethers'
import env from '@/helpers/env'

export default new AlchemyProvider('mainnet', env.ALCHEMY_KEY)
