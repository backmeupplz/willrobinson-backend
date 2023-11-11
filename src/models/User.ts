import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import SignerUUIDStatus from '@/models/SignerUUIDStatus'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class User {
  @prop({ index: true, required: true })
  address!: string
  // UUID
  @prop({ index: true, required: true })
  signerUUID!: string
  // Setup
  @prop({ index: true, default: false, required: true })
  active!: boolean
  // Payment
  @prop({ index: true })
  paidUntil?: Date
  @prop({ index: true, required: true })
  paymentAddress!: string
  @prop({ required: true })
  paymentPrivateKey!: string
}

export const UserModel = getModelForClass(User)
