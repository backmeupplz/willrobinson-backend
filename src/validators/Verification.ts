import { IsEthereumAddress } from 'amala'

export default class Verification {
  @IsEthereumAddress()
  address!: string
}
