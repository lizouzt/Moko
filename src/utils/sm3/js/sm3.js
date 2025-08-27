import { CryptoJS } from './core'

import { BigInteger } from './jsbn'
;

(function () {
  const C = CryptoJS
  const C_lib = C.lib
  const { WordArray } = C_lib
  const { Hasher } = C_lib
  const C_algo = C.algo
  const W = []
  const SM3 = (C_algo.SM3 = Hasher.extend({
    _doReset() {
      // this._hash = new WordArray.init([0x7380166f, 0x4914b2b9, 0x172442d7, 0xda8a0600, 0xa96f30bc, 0x163138aa, 0xe38dee4d, 0xb0fb0e4e]);
      this._hash = new WordArray.init([
        1937774191, 1226093241, 388252375, -628488704, -1452330820, 372324522, -477237683, -1325724082,
      ])
    },
    _doProcessBlock(M, offset) {
      const H = this._hash.words
      let a = H[0]
      let b = H[1]
      let c = H[2]
      let d = H[3]
      let e = H[4]
      for (let i = 0; i < 80; i++) {
        if (i < 16) {
          W[i] = M[offset + i] | 0
        } else {
          const n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]
          W[i] = (n << 1) | (n >>> 31)
        }
        let t = ((a << 5) | (a >>> 27)) + e + W[i]
        if (i < 20) {
          t += ((b & c) | (~b & d)) + 0x5a827999
        } else if (i < 40) {
          t += (b ^ c ^ d) + 0x6ed9eba1
        } else if (i < 60) {
          t += ((b & c) | (b & d) | (c & d)) - 0x70e44324
        } else {
          t += (b ^ c ^ d) - 0x359d3e2a
        }
        e = d
        d = c
        c = (b << 30) | (b >>> 2)
        b = a
        a = t
      }
      H[0] = (H[0] + a) | 0
      H[1] = (H[1] + b) | 0
      H[2] = (H[2] + c) | 0
      H[3] = (H[3] + d) | 0
      H[4] = (H[4] + e) | 0
    },
    _doFinalize() {
      const data = this._data
      const dataWords = data.words
      const nBitsTotal = this._nDataBytes * 8
      const nBitsLeft = data.sigBytes * 8
      dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32))
      dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000)
      dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal
      data.sigBytes = dataWords.length * 4
      this._process()
      return this._hash
    },
    clone() {
      const clone = Hasher.clone.call(this)
      clone._hash = this._hash.clone()
      return clone
    },
  }))
  C.SM3 = Hasher._createHelper(SM3)
  C.HmacSM3 = Hasher._createHmacHelper(SM3)
})()
export function SM3Digest() {
  this.BYTE_LENGTH = 64
  this.xBuf = []
  this.xBufOff = 0
  this.byteCount = 0
  this.DIGEST_LENGTH = 32
  // this.v0 = [0x7380166f,0x4914b2b9,0x172442d7,0xda8a0600,0xa96f30bc,0x163138aa,0xe38dee4d,0xb0fb0e4e];
  // this.v0 = [0x7380166f, 0x4914b2b9, 0x172442d7,0xda8a0600,0xa96f30bc,0x163138aa,0xe38dee4d,0xb0fb0e4e];
  // this.v0 = [0x7380166f, 0x4914b2b9, 0x172442d7, -628488704, -1452330820, 0x163138aa, -477237683, -1325724082];
  this.v0 = [1937774191, 1226093241, 388252375, -628488704, -1452330820, 372324522, -477237683, -1325724082]
  this.v = new Array(8)
  this.v_ = new Array(8)
  this.X0 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  this.X = new Array(68)
  this.xOff = 0
  this.T_00_15 = 0x79cc4519
  this.T_16_63 = 0x7a879d8a
  if (arguments.length > 0) {
    this.InitDigest(arguments[0])
  } else {
    this.Init()
  }
}
SM3Digest.prototype = {
  Init() {
    this.xBuf = new Array(4)
    this.Reset()
  },
  InitDigest(t) {
    this.xBuf = new Array(t.xBuf.length)
    Array.Copy(t.xBuf, 0, this.xBuf, 0, t.xBuf.length)
    this.xBufOff = t.xBufOff
    this.byteCount = t.byteCount
    Array.Copy(t.X, 0, this.X, 0, t.X.length)
    this.xOff = t.xOff
    Array.Copy(t.v, 0, this.v, 0, t.v.length)
  },
  GetDigestSize() {
    return this.DIGEST_LENGTH
  },
  Reset() {
    this.byteCount = 0
    this.xBufOff = 0
    Array.Clear(this.xBuf, 0, this.xBuf.length)
    Array.Copy(this.v0, 0, this.v, 0, this.v0.length)
    this.xOff = 0
    Array.Copy(this.X0, 0, this.X, 0, this.X0.length)
  },
  GetByteLength() {
    return this.BYTE_LENGTH
  },
  ProcessBlock() {
    let i
    const ww = this.X
    const ww_ = new Array(64)
    for (i = 16; i < 68; i++) {
      ww[i] = this.P1(ww[i - 16] ^ ww[i - 9] ^ this.ROTATE(ww[i - 3], 15)) ^ this.ROTATE(ww[i - 13], 7) ^ ww[i - 6]
    }
    for (i = 0; i < 64; i++) {
      ww_[i] = ww[i] ^ ww[i + 4]
    }
    const vv = this.v
    const vv_ = this.v_
    Array.Copy(vv, 0, vv_, 0, this.v0.length)
    let SS1
    let SS2
    let TT1
    let TT2
    let aaa
    for (i = 0; i < 16; i++) {
      aaa = this.ROTATE(vv_[0], 12)
      SS1 = Int32.parse(Int32.parse(aaa + vv_[4]) + this.ROTATE(this.T_00_15, i))
      SS1 = this.ROTATE(SS1, 7)
      SS2 = SS1 ^ aaa
      TT1 = Int32.parse(Int32.parse(this.FF_00_15(vv_[0], vv_[1], vv_[2]) + vv_[3]) + SS2) + ww_[i]
      TT2 = Int32.parse(Int32.parse(this.GG_00_15(vv_[4], vv_[5], vv_[6]) + vv_[7]) + SS1) + ww[i]
      vv_[3] = vv_[2]
      vv_[2] = this.ROTATE(vv_[1], 9)
      vv_[1] = vv_[0]
      vv_[0] = TT1
      vv_[7] = vv_[6]
      vv_[6] = this.ROTATE(vv_[5], 19)
      vv_[5] = vv_[4]
      vv_[4] = this.P0(TT2)
    }
    for (i = 16; i < 64; i++) {
      aaa = this.ROTATE(vv_[0], 12)
      SS1 = Int32.parse(Int32.parse(aaa + vv_[4]) + this.ROTATE(this.T_16_63, i))
      SS1 = this.ROTATE(SS1, 7)
      SS2 = SS1 ^ aaa
      TT1 = Int32.parse(Int32.parse(this.FF_16_63(vv_[0], vv_[1], vv_[2]) + vv_[3]) + SS2) + ww_[i]
      TT2 = Int32.parse(Int32.parse(this.GG_16_63(vv_[4], vv_[5], vv_[6]) + vv_[7]) + SS1) + ww[i]
      vv_[3] = vv_[2]
      vv_[2] = this.ROTATE(vv_[1], 9)
      vv_[1] = vv_[0]
      vv_[0] = TT1
      vv_[7] = vv_[6]
      vv_[6] = this.ROTATE(vv_[5], 19)
      vv_[5] = vv_[4]
      vv_[4] = this.P0(TT2)
    }
    for (i = 0; i < 8; i++) {
      vv[i] ^= Int32.parse(vv_[i])
    }
    this.xOff = 0
    Array.Copy(this.X0, 0, this.X, 0, this.X0.length)
  },
  ProcessWord(in_Renamed, inOff) {
    let n = in_Renamed[inOff] << 24
    n |= (in_Renamed[++inOff] & 0xff) << 16
    n |= (in_Renamed[++inOff] & 0xff) << 8
    n |= in_Renamed[++inOff] & 0xff
    this.X[this.xOff] = n
    if (++this.xOff == 16) {
      this.ProcessBlock()
    }
  },
  ProcessLength(bitLength) {
    if (this.xOff > 14) {
      this.ProcessBlock()
    }
    this.X[14] = this.URShiftLong(bitLength, 32)
    this.X[15] = bitLength & 0xffffffff
  },
  IntToBigEndian(n, bs, off) {
    bs[off] = Int32.parseByte(this.URShift(n, 24))
    bs[++off] = Int32.parseByte(this.URShift(n, 16))
    bs[++off] = Int32.parseByte(this.URShift(n, 8))
    bs[++off] = Int32.parseByte(n)
  },
  DoFinal(out_Renamed, outOff) {
    this.Finish()
    for (let i = 0; i < 8; i++) {
      this.IntToBigEndian(this.v[i], out_Renamed, outOff + i * 4)
    }
    this.Reset()
    return this.DIGEST_LENGTH
  },
  Update(input) {
    this.xBuf[this.xBufOff++] = input
    if (this.xBufOff == this.xBuf.length) {
      this.ProcessWord(this.xBuf, 0)
      this.xBufOff = 0
    }
    this.byteCount++
  },
  BlockUpdate(input, inOff, length) {
    while (this.xBufOff != 0 && length > 0) {
      this.Update(input[inOff])
      inOff++
      length--
    }
    while (length > this.xBuf.length) {
      this.ProcessWord(input, inOff)
      inOff += this.xBuf.length
      length -= this.xBuf.length
      this.byteCount += this.xBuf.length
    }
    while (length > 0) {
      this.Update(input[inOff])
      inOff++
      length--
    }
  },
  Finish() {
    const bitLength = this.byteCount << 3
    this.Update(128)
    while (this.xBufOff != 0) this.Update(0)
    this.ProcessLength(bitLength)
    this.ProcessBlock()
  },
  ROTATE(x, n) {
    return (x << n) | this.URShift(x, 32 - n)
  },
  P0(X) {
    return X ^ this.ROTATE(X, 9) ^ this.ROTATE(X, 17)
  },
  P1(X) {
    return X ^ this.ROTATE(X, 15) ^ this.ROTATE(X, 23)
  },
  FF_00_15(X, Y, Z) {
    return X ^ Y ^ Z
  },
  FF_16_63(X, Y, Z) {
    return (X & Y) | (X & Z) | (Y & Z)
  },
  GG_00_15(X, Y, Z) {
    return X ^ Y ^ Z
  },
  GG_16_63(X, Y, Z) {
    return (X & Y) | (~X & Z)
  },
  URShift(number, bits) {
    if (number > Int32.maxValue || number < Int32.minValue) {
      number = Int32.parse(number)
    }
    if (number >= 0) {
      return number >> bits
    }
    return (number >> bits) + (2 << ~bits)
  },
  URShiftLong(number, bits) {
    let returnV
    const big = new BigInteger()
    big.fromInt(number)
    if (big.signum() >= 0) {
      returnV = big.shiftRight(bits).intValue()
    } else {
      const bigAdd = new BigInteger()
      bigAdd.fromInt(2)
      const shiftLeftBits = ~bits
      let shiftLeftNumber = ''
      if (shiftLeftBits < 0) {
        const shiftRightBits = 64 + shiftLeftBits
        for (let i = 0; i < shiftRightBits; i++) {
          shiftLeftNumber += '0'
        }
        const shiftLeftNumberBigAdd = new BigInteger()
        shiftLeftNumberBigAdd.fromInt(number >> bits)
        const shiftLeftNumberBig = new BigInteger(`10${shiftLeftNumber}`, 2)
        shiftLeftNumber = shiftLeftNumberBig.toRadix(10)
        const r = shiftLeftNumberBig.add(shiftLeftNumberBigAdd)
        returnV = r.toRadix(10)
      } else {
        shiftLeftNumber = bigAdd.shiftLeft(~bits).intValue()
        returnV = (number >> bits) + shiftLeftNumber
      }
    }
    return returnV
  },
  GetZ(g, pubKeyHex) {
    const userId = CryptoJS.enc.Utf8.parse('1234567812345678')
    const len = userId.words.length * 4 * 8
    this.Update((len >> 8) & 0x00ff)
    this.Update(len & 0x00ff)
    const userIdWords = this.GetWords(userId.toString())
    this.BlockUpdate(userIdWords, 0, userIdWords.length)
    const aWords = this.GetWords(g.curve.a.toBigInteger().toRadix(16))
    const bWords = this.GetWords(g.curve.b.toBigInteger().toRadix(16))
    const gxWords = this.GetWords(g.getX().toBigInteger().toRadix(16))
    const gyWords = this.GetWords(g.getY().toBigInteger().toRadix(16))
    const pxWords = this.GetWords(pubKeyHex.substr(0, 64))
    const pyWords = this.GetWords(pubKeyHex.substr(64, 64))
    this.BlockUpdate(aWords, 0, aWords.length)
    this.BlockUpdate(bWords, 0, bWords.length)
    this.BlockUpdate(gxWords, 0, gxWords.length)
    this.BlockUpdate(gyWords, 0, gyWords.length)
    this.BlockUpdate(pxWords, 0, pxWords.length)
    this.BlockUpdate(pyWords, 0, pyWords.length)
    const md = new Array(this.GetDigestSize())
    this.DoFinal(md, 0)
    return md
  },
  GetWords(hexStr) {
    const words = []
    const hexStrLength = hexStr.length
    for (let i = 0; i < hexStrLength; i += 2) {
      words[words.length] = parseInt(hexStr.substr(i, 2), 16)
    }
    return words
  },
  GetHex(arr) {
    const words = []
    let j = 0
    for (let i = 0; i < arr.length * 2; i += 2) {
      words[i >>> 3] |= parseInt(arr[j]) << (24 - (i % 8) * 4)
      j++
    }
    const wordArray = new CryptoJS.lib.WordArray.init(words, arr.length)
    return wordArray
  },
}
Array.Clear = function (destinationArray, destinationIndex, length) {
  for (const elm in destinationArray) {
    destinationArray[elm] = null
  }
}
Array.Copy = function (sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
  const cloneArray = sourceArray.slice(sourceIndex, sourceIndex + length)
  for (let i = 0; i < cloneArray.length; i++) {
    destinationArray[destinationIndex] = cloneArray[i]
    destinationIndex++
  }
}
window.Int32 = {
  minValue: -0b10000000000000000000000000000000,
  maxValue: 0b1111111111111111111111111111111,
  parse(n) {
    if (n < this.minValue) {
      var bigInteger = new Number(-n)
      var bigIntegerRadix = bigInteger.toString(2)
      var subBigIntegerRadix = bigIntegerRadix.substr(bigIntegerRadix.length - 31, 31)
      var reBigIntegerRadix = ''
      for (var i = 0; i < subBigIntegerRadix.length; i++) {
        var subBigIntegerRadixItem = subBigIntegerRadix.substr(i, 1)
        reBigIntegerRadix += subBigIntegerRadixItem == '0' ? '1' : '0'
      }
      var result = parseInt(reBigIntegerRadix, 2)
      return result + 1
    }
    if (n > this.maxValue) {
      var bigInteger = Number(n)
      var bigIntegerRadix = bigInteger.toString(2)
      var subBigIntegerRadix = bigIntegerRadix.substr(bigIntegerRadix.length - 31, 31)
      var reBigIntegerRadix = ''
      for (var i = 0; i < subBigIntegerRadix.length; i++) {
        var subBigIntegerRadixItem = subBigIntegerRadix.substr(i, 1)
        reBigIntegerRadix += subBigIntegerRadixItem == '0' ? '1' : '0'
      }
      var result = parseInt(reBigIntegerRadix, 2)
      return -(result + 1)
    }
    return n
  },
  parseByte(n) {
    if (n < 0) {
      var bigInteger = new Number(-n)
      var bigIntegerRadix = bigInteger.toString(2)
      const subBigIntegerRadix = bigIntegerRadix.substr(bigIntegerRadix.length - 8, 8)
      let reBigIntegerRadix = ''
      for (let i = 0; i < subBigIntegerRadix.length; i++) {
        const subBigIntegerRadixItem = subBigIntegerRadix.substr(i, 1)
        reBigIntegerRadix += subBigIntegerRadixItem == '0' ? '1' : '0'
      }
      const result = parseInt(reBigIntegerRadix, 2)
      return result + 1
    }
    if (n > 255) {
      var bigInteger = Number(n)
      var bigIntegerRadix = bigInteger.toString(2)
      return parseInt(bigIntegerRadix.substr(bigIntegerRadix.length - 8, 8), 2)
    }
    return n
  },
}
