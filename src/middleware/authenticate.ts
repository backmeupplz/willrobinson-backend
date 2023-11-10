import { Context, Next } from 'koa'
import { ethers } from 'ethers'
import getVerificationMessage from '@/helpers/getVerificationMessage'
import { UserModel } from '@/models/User'

export default async function (ctx: Context, next: Next) {
  try {
    const { signature, address } = ctx.headers as {
      signature?: string
      address?: string
    }
    if (!signature || !address) {
      return ctx.throw(
        403,
        'What the hell are you doing here without a signature or address? GO AWAY!'
      )
    }
    // Get address from signature
    ethers.verifyMessage(getVerificationMessage(address), signature)
    // Get user
    const user = await UserModel.findOne({ address })
    ctx.state.user = user
  } catch (err) {
    return ctx.throw(
      403,
      'Ugh oh! Something went wrong with authentication. Nowhere to report though, no one will hear you shouting into the void.'
    )
  }
  await next()
}
