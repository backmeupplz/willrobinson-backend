import client from '@/helpers/client'
import { UserModel } from '@/models/User'
import exceptions from './exceptions'

let lastCastHash = ''
export default async function () {
  try {
    console.log('Fetching the last cast...')
    const recentCastsAsyncGenerator = await client.v1.fetchRecentCasts({
      pageSize: 10,
    })
    const lastCast = await recentCastsAsyncGenerator.next()
    if (!lastCast.value) {
      console.log('No cast found')
      return
    }
    if (lastCast.value.hash === lastCastHash) {
      console.log('Already saw this cast')
      return
    }
    lastCastHash = lastCast.value.hash
    console.log(
      `Last cast: "${lastCast.value.text}", author: "${lastCast.value.author.fid}"`
    )
    if (exceptions.includes(Number(lastCast.value.author.fid))) {
      console.log(
        `Skipping "${lastCast.value.text}" by ${lastCast.value.author.fid}...`
      )
      return
    }
    const author = await client.v1.lookupUserByFid(+lastCast.value.author.fid)
    if (!author) {
      console.log('Author not found')
      return
    }
    const eligibleUsers = await UserModel.find({
      active: true,
    })
    // Random number between 15 and 150
    console.log(
      `Setting the timeouts to like cast for ${eligibleUsers.length} users...`
    )
    for (const user of eligibleUsers) {
      const timeout = Math.floor(Math.random() * 135) + 15
      setTimeout(async () => {
        if (!lastCast.value) {
          console.log('No cast found')
          return
        }
        console.log(
          `Liking "${lastCast.value.text}" by ${lastCast.value.author.fid} for ${user.address}...`
        )
        try {
          await client.v2.reactToCast(
            user.signerUUID,
            'like' as any,
            lastCast.value.hash
          )
          console.log('Liked!')
        } catch (error) {
          console.log('Error while liking the latest cast:', error)
        }
      }, timeout * 1000)
    }
    console.log('Set all timeouts!')
  } catch (error) {
    console.log('Error while liking the latest cast:', error)
  }
}
