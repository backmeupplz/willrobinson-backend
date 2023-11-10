import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class User {
  @prop({ index: true, required: true })
  address!: string
  // UUID
  @prop({ index: true, required: true })
  signerUUID!: string
  @prop({
    index: true,
    required: true,
    enum: SignerUUIDStatus,
    default: SignerUUIDStatus.pending,
  })
  signerUUIDStatus!: SignerUUIDStatus
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
