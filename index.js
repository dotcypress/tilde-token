const crypto = require('crypto')
const querystring = require('querystring')

function serialize(data) {
  if (typeof data === 'string') {
    return querystring.escape(data)
  }
  if (Array.isArray(data)) {
    return querystring.stringify(data)
  }
  return querystring.stringify(
    Object.keys(data)
      .filter((key) => typeof data[key] !== 'undefined')
      .sort()
      .reduce((acc, key) => Object.assign(acc, { [key]: data[key] }), {})
  )
}

function deserialize(payload) {
  return payload.includes('=')
    ? querystring.parse(payload)
    : querystring.unescape(payload)
}

function decode(token) {
  if (typeof token !== 'string' || token[0] !== '~' || token.length < 88) {
    return { ok: false, err: new Error('Mailformed token') }
  }
  const payload = token.slice(87)
  return {
    ok: true,
    payload,
    data: deserialize(payload),
    signature: Buffer.from(token.slice(1, 87), 'base64')
  }
}

function generateKeyPair() {
  return crypto.generateKeyPairSync('ed25519')
}

function loadKeyPair(key) {
  return {
    publicKey: crypto.createPublicKey(key),
    privateKey: crypto.createPrivateKey(key)
  }
}

function signer(keyObj) {
  if (!keyObj) {
    throw new Error('Missing key')
  }
  const key = keyObj instanceof crypto.KeyObject ? keyObj : crypto.createPrivateKey(keyObj)
  return (data) => {
    if (!data) {
      throw new Error('Missing data')
    }
    const payload = Buffer.from(serialize(data), 'utf8')
    const signature = crypto.sign(null, payload, key)
      .toString('base64')
      .replace(/=/g, '')
    return `~${signature}${payload}`
  }
}

function verifier(keyObj) {
  if (!keyObj) {
    throw new Error('Missing key')
  }
  const key = keyObj instanceof crypto.KeyObject ? keyObj : crypto.createPrivateKey(keyObj)
  return (token) => {
    try {
      const { signature, payload, data } = decode(token)
      return crypto.verify(null, Buffer.from(payload, 'utf8'), key, signature)
        ? { ok: true, data }
        : { ok: false, err: new Error('Invalid signature') }
    } catch (err) {
      return { ok: false, error: err }
    }
  }
}

function sign(data, key) {
  return signer(key)(data)
}

function verify(token, key) {
  return verifier(key)(token)
}

module.exports = {
  signer,
  sign,
  verifier,
  verify,
  decode,
  loadKeyPair,
  generateKeyPair
}
