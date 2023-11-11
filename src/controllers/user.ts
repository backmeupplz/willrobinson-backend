import borodutch from '@/helpers/borodutch'
import cost from '@/helpers/cost'
import provider from '@/helpers/provider'
import authenticate from '@/middleware/authenticate'
import { User, UserModel } from '@/models/User'
import Activate from '@/validators/Activate'
import { DocumentType } from '@typegoose/typegoose'
import {
  Body,
  Context,
  Controller,
  Ctx,
  CurrentUser,
  Flow,
  Get,
  Post,
} from 'amala'
import { Wallet } from 'ethers'

@Controller('/user')
export default class UserController {
  @Get('/')
  @Flow(authenticate)
  async getUser(@CurrentUser() user: DocumentType<User>) {
    return {
      address: user.address,
      active: user.active,
      paidUntil: user.paidUntil,
      paymentAddress: user.paymentAddress,
    }
  }

  @Post('/activate')
  @Flow(authenticate)
  async activateUser(
    @Ctx() ctx: Context,
    @CurrentUser() user: DocumentType<User>,
    @Body({ required: true }) { activate }: Activate
  ) {
    // Check if user is overdue
    if (
      activate &&
      (!user.paidUntil || user.paidUntil.getTime() < Date.now())
    ) {
      // Check balance of payment address with ethers
      const balance = await provider.getBalance(user.paymentAddress)
      // If balance is too low
      if (balance < cost) {
        return ctx.throw(
          403,
          'You do not have enough USDC to activate your account.'
        )
      }
      // Transfer the moneys
      const wallet = new Wallet(user.paymentPrivateKey, provider)
      const gasPrice = (await provider.getFeeData()).gasPrice
      if (!gasPrice) {
        return ctx.throw(500, 'Could not get gas price.')
      }
      const estimatedGas = await wallet.estimateGas({
        to: borodutch,
        value: cost,
      })
      const tx = await wallet.sendTransaction({
        to: borodutch,
        value: cost - estimatedGas * (gasPrice * BigInt(3)),
        gasLimit: estimatedGas,
        maxFeePerGas: gasPrice * BigInt(3),
      })
      await tx.wait()
      // Paid until a month from now
      await UserModel.findOneAndUpdate(
        { address: user.address },
        { paidUntil: new Date(Date.now() + 86400 * 30 * 1000) }
      )
    }
    // Make a change
    await UserModel.findOneAndUpdate(
      { address: user.address },
      { active: activate }
    )
    // Return result
    return { active: activate }
  }
}
