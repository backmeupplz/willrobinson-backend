export default (approvalUrl?: string) => {
  return approvalUrl
    ? {
        iosUrl: approvalUrl,
        androidUrl: `https://client.warpcast.com/deeplinks/signed-key-request?token=${
          approvalUrl.split('=')[1]
        }`,
      }
    : {}
}
