import { UserModel } from '@/models/User'

let checking = false
async function checkUsers() {
  if (checking) {
    return
  }
  checking = true
  console.log('Checking users...')
  try {
    const users = await UserModel.updateMany(
      {
        active: true,
        paidUntil: {
          $lt: new Date(),
        },
      },
      {
        active: false,
      }
    )
    console.log(
      `Users checked, matched: ${users.matchedCount}, modified: ${users.modifiedCount}`
    )
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
