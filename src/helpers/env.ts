import * as dotenv from 'dotenv'
import { cleanEnv, num, str } from 'envalid'
import { cwd } from 'process'
import { resolve } from 'path'

dotenv.config({ path: resolve(cwd(), '.env') })

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  FARCASTER_MNEMONIC: str(),
  FID: num(),
  API_KEY: str(),
  MONGO: str(),
  PORT: num({ default: 1337 }),
  ALCHEMY_KEY: str(),
})
