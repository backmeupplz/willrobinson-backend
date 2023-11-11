import 'module-alias/register'
import 'source-map-support/register'

import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'
import runFarcasterLiker from '@/helpers/runFarcasterLiker'
import runUserChecker from './helpers/runUserChecker'

void (async () => {
  console.log('Starting mongo')
  await runMongo()
  console.log('Mongo connected')
  await runApp()
  console.log('App started')
  runFarcasterLiker()
  console.log('Farcaster liker started')
  runUserChecker()
  console.log('User checker started')
})()
