import getVerificationMessage from '@/helpers/getVerificationMessage'
import Verification from '@/validators/Verification'
import { Controller, Get, Params } from 'amala'

@Controller('/verification')
export default class VerificationController {
  @Get('/:address')
  async verificationMessage(@Params() { address }: Verification) {
    return {
      verificationMessage: getVerificationMessage(address),
    }
  }
}
