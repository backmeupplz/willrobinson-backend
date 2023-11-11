import env from '@/helpers/env'
import { generateSignature } from '@standard-crypto/farcaster-js-neynar'
import getApprovalUrls from '@/helpers/getApprovalUrls'
import client from '@/helpers/client'

export default async function (uuid?: string) {
  const signerFid = env.FID
  const deadline = Math.floor(Date.now() / 1000) + 86400 * 365 // a year from now
  const signer = uuid
    ? (await client.v2.fetchSigner(uuid)) || (await client.v2.createSigner())
    : await client.v2.createSigner()
  if (signer.status !== 'approved') {
    const signature = await generateSignature(
      signer.public_key,
      signerFid,
      env.FARCASTER_MNEMONIC,
      deadline
    )
    const registeredSigner = await client.v2.registerSigner(
      signer.signer_uuid,
      signerFid,
      deadline,
      signature
    )
    if (!registeredSigner.signer_approval_url) {
      throw new Error('No signer approval URL')
    }
    signer.signer_approval_url = registeredSigner.signer_approval_url
  }
  return {
    ...getApprovalUrls(signer.signer_approval_url),
    signerUUID: signer.signer_uuid,
    signerFID: signer.fid,
    signerPublicKey: signer.public_key,
    signerStatus: signer.status,
  }
}
