import { UserModel } from '@/models/User'
import provider from '@/helpers/provider'
import cost from '@/helpers/cost'
import { Wallet } from 'ethers'
import borodutch from './borodutch'

let checking = false
async function checkUsers() {
  if (checking) {
    return
  }
  checking = true
  console.log('Checking users...')
  try {
    const users = await UserModel.find({
      active: true,
      paidUntil: {
        $lt: new Date(),
      },
    })
    console.log(`Found ${users.length} users to check`)
    for (const user of users) {
      try {
        const balance = await provider.getBalance(user.paymentAddress)
        if (balance >= cost) {
          const wallet = new Wallet(user.paymentPrivateKey, provider)
          const gasPrice = (await provider.getFeeData()).gasPrice
          if (!gasPrice) {
            continue
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
            { _id: user._id },
            { paidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) }
          )
        } else {
          console.log(
            `User ${user.address} has insufficient balance, deactivating`
          )
          await UserModel.updateOne(
            {
              _id: user._id,
            },
            {
              active: false,
            }
          )
        }
      } catch (error) {
        console.log(`Error checking user ${user.address}`, error)
      }
    }
    console.log('Done checking users')
  } catch (e) {
    console.log('Error checking users', e)
  } finally {
    checking = false
  }
}

export default function () {
  void checkUsers()
  setInterval(checkUsers, 1000 * 10)
}
