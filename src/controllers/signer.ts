import { Controller, CurrentUser, Flow, Get } from 'amala'
import authenticate from '@/middleware/authenticate'
import { User } from '@/models/User'
import getSigner from '@/helpers/getSigner'
import { DocumentType } from '@typegoose/typegoose'

@Controller('/signer')
export default class UUIDController {
  @Get('/')
  @Flow(authenticate)
  async getSignerRequest(@CurrentUser() user: DocumentType<User>) {
    return { ...(await getSigner(user.signerUUID)), signerUUID: undefined }
  }
}
