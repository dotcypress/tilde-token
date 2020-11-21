const test = require('ava')
const { sign, decode, verify, generateKeyPair, loadKeyPair } = require('../')

const { publicKey, privateKey } = loadKeyPair(`
-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIOAzzaE6rikNTr4ZbEz66rsGMxUfTutx2namfDJpmwD1
-----END PRIVATE KEY-----
`)

test('throw error with empty data', (t) => {
  t.throws(() => sign(null, privateKey))
})

test('throw error with empty password', (t) => {
  t.throws(() => verify('~c/pjgPEau0uTmTmNszywrE3o8TYUtYwy3+bh79BwpQtRsLXUhoED0mIAwLRGN6QbJcRNv+A3MqEH9WqO/q1mAQfoo'))
})

test('throw error with mailformed token', (t) => {
  const { ok, data } = verify('~qlHxEVZjv983RJcqQ/uMEHhdshyp7wp0Mwr/tVyKav3ijQA0XzwUxnnqAAXhgt5DDnQbmPnFxcPssBxgsz4sAg', privateKey)
  t.false(ok)
  t.is(data, undefined)
})

test('empty token', (t) => {
  const { ok } = verify(null, privateKey)
  t.false(ok)
})

test('encode', (t) => {
  const token = sign('foo', privateKey)
  t.is(token, '~c/pjgPEau0uTmTmNszywrE3o8TYUtYwy3+bh79BwpQtRsLXUhoED0mIAwLRGN6QbJcRNv+A3MqEH9WqO/q1mAQfoo')
})

test('encode with payload', (t) => {
  const token = sign('fo=o', privateKey)
  t.is(token, '~o9r4GgufIxrOjTPEH6uQ+Li944NPGVvQahPEb91ThYwSa4yX2LONDrfdzZl82GZcF8B+P4wp7mWFprpfyaq9BQfo%3Do')
})

test('encode with object payload', (t) => {
  const token = sign({ uid: '1234567890', exp: '1000000' }, privateKey)
  t.is(token, '~Og8xP2b2KdUyrksAAG8M36DXemjKdBih4uxBcpwoHTN32RkvfP6X1SsyWhsxtEVaIwPOxOtnaogY11vO9z3CAAexp=1000000&uid=1234567890')
})

test('encode with object payload (keys order)', (t) => {
  const token = sign({ exp: '1000000', uid: '1234567890', junk: undefined }, privateKey)
  t.is(token, '~Og8xP2b2KdUyrksAAG8M36DXemjKdBih4uxBcpwoHTN32RkvfP6X1SsyWhsxtEVaIwPOxOtnaogY11vO9z3CAAexp=1000000&uid=1234567890')
})

test('encode with array payload', (t) => {
  const token = sign(['foo', 'bar', 42], privateKey)
  t.is(token, '~1y53xPM8a8bUGSBqUsIo3n3BdYFV/rCp3mcOKIpC3FogkTuo/YBhnRQ1oSPpJ1n6Q62j9dbRDZ6pGEp6zFQdDg0=foo&1=bar&2=42')
})

test('decode token', (t) => {
  const { ok, signature, data } = decode('~o9r4GgufIxrOjTPEH6uQ+Li944NPGVvQahPEb91ThYwSa4yX2LONDrfdzZl82GZcF8B+P4wp7mWFprpfyaq9BQfo%3Do')
  t.true(ok)
  t.is(signature.length, 64)
  t.deepEqual(data, 'fo=o')
})

test('decode mailformed token', (t) => {
  const { ok } = decode('Lq2jEAAcn/wLXe3uK9mDZS83OOOHVVOhT7LenjRTl+N6fbsohvVsjgQEITan3srP30ZGquUKV4mHfoWtRxRWAQexp=1000000&uid=1234567890')
  t.false(ok)
})

test('verify string token', (t) => {
  const token = sign('foo', privateKey)
  const { ok, data } = verify(token, privateKey)
  t.true(ok)
  t.deepEqual(data, 'foo')
})

test('verify pubkey validation', (t) => {
  const token = sign('foo', privateKey)
  const { ok, data } = verify(token, publicKey)
  t.true(ok)
  t.deepEqual(data, 'foo')
})

test('verify keypair validation', (t) => {
  const { privateKey, publicKey } = generateKeyPair()

  const token = sign('bar', privateKey)
  const { ok, data } = verify(token, publicKey)
  t.true(ok)
  t.deepEqual(data, 'bar')
})

test('verify object token', (t) => {
  const { ok, data } = verify('~Og8xP2b2KdUyrksAAG8M36DXemjKdBih4uxBcpwoHTN32RkvfP6X1SsyWhsxtEVaIwPOxOtnaogY11vO9z3CAAexp=1000000&uid=1234567890', privateKey)
  t.true(ok)
  t.deepEqual(data, { exp: '1000000', uid: '1234567890' })
})

test('verify array token', (t) => {
  const { ok, data } = verify('~1y53xPM8a8bUGSBqUsIo3n3BdYFV/rCp3mcOKIpC3FogkTuo/YBhnRQ1oSPpJ1n6Q62j9dbRDZ6pGEp6zFQdDg0=foo&1=bar&2=42', privateKey)
  t.true(ok)
  t.deepEqual(data, {
    0: 'foo',
    1: 'bar',
    2: '42'
  })
})

test('verify invalid token', (t) => {
  const { ok, data, err } = verify('~2y53xPM8a8bUGSBqUsIo3n3BdYFV/rCp3mcOKIpC3FogkTuo/YBhnRQ1oSPpJ1n6Q62j9dbRDZ6pGEp6zFQdDg0=foo&1=bar&2=42', privateKey)
  t.false(ok)
  t.is(data, undefined)
  t.truthy(err)
})
