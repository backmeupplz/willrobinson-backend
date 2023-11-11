import likeLatestCast from '@/helpers/likeLatestCast'

export default function () {
  likeLatestCast()
  setInterval(likeLatestCast, 1000 * 10)
}
