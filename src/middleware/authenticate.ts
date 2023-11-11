import { Context, Next } from 'koa'
import { Wallet, ethers } from 'ethers'
import getVerificationMessage from '@/helpers/getVerificationMessage'
import { UserModel } from '@/models/User'
import getSigner from '@/helpers/getSigner'

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
    let user = await UserModel.findOne({ address })
    if (!user) {
      const signer = await getSigner()
      const wallet = Wallet.createRandom()
      console.log({
        address,
        signerUUID: signer.signerUUID,
        paymentAddress: wallet.address,
        paymentPrivateKey: wallet.privateKey,
      })
      user = await UserModel.create({
        address,
        signerUUID: signer.signerUUID,
        paymentAddress: wallet.address,
        paymentPrivateKey: wallet.privateKey,
      })
    }
    ctx.state.user = user
  } catch (err) {
    return ctx.throw(
      403,
      'Ugh oh! Something went wrong with authentication. Nowhere to report though, no one will hear you shouting into the void.'
    )
  }
  return next()
}
