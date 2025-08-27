import { CryptoJS } from './core'
import { SM3Digest } from './sm3'
import './cipher-core'
import './jsbn'
import './jsbn2'

export function doSM3(plaintext) {
  const d = CryptoJS.enc.Utf8.parse(plaintext)
  let msg = d
  let md
  const sm3keycur = new SM3Digest()
  msg = sm3keycur.GetWords(msg.toString())
  // msg.forEach(element => {
  //     console.log('asd', element)
  // });
  // console.log('msg', msg);
  sm3keycur.BlockUpdate(msg, 0, msg.length)
  // console.log('msg1', msg);
  const c3 = new Array(32)
  sm3keycur.DoFinal(c3, 0)
  for (let i = 0, len = c3.length; i < len; i++) {
    if (c3[i] == 256) {
      c3[i] = 0
    }
  }
  md = sm3keycur.GetHex(c3).toString()
  return md
}
