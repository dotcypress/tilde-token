import test from 'ava'
import { sign, decode, safeDecode, verify, makeKeypair } from '../'

test('throw error with empty password', (t) => {
  t.throws(() => sign(null, 'bar'))
})

test('throw error with empty password', (t) => {
  t.throws(() => verify('~qlHxEVZjv983RJcqQ/uMEHhdshyp7wp0Mwr/tVyKav3ijQA0XzwUxnnqAAXhgt5DDnQbmPnFxcPssBxgsz4sAgfoo'))
})

test('throw error with mailformed token', (t) => {
  const { ok } = verify('~qlHxEVZjv983RJcqQ/uMEHhdshyp7wp0Mwr/tVyKav3ijQA0XzwUxnnqAAXhgt5DDnQbmPnFxcPssBxgsz4sAg', 'bar')
  t.false(ok)
})

test('throw error with empty data', (t) => {
  t.throws(() => sign(null, 'bar'))
})

test('throw error with empty token', (t) => {
  const { ok } = verify(null, 'bar')
  t.false(ok)
})

test('encode with string password', (t) => {
  const token = sign('foo', 'bar')
  t.is(token, '~qlHxEVZjv983RJcqQ/uMEHhdshyp7wp0Mwr/tVyKav3ijQA0XzwUxnnqAAXhgt5DDnQbmPnFxcPssBxgsz4sAgfoo')
})

test('encode with string password', (t) => {
  const token = sign('fo=o', 'bar')
  t.is(token, '~hKCl4E6c+K/CE9DLMBIskGmuIW26C9MCTjTT2f0g1dY+4T3N/CTl3rauKZ1oZQSN12G1DUWexyoWEK1rQ0UZAAfo%3Do')
})

test('encode with buffer password', (t) => {
  const token = sign('foo', Buffer.from('bar'))
  t.is(token, '~qlHxEVZjv983RJcqQ/uMEHhdshyp7wp0Mwr/tVyKav3ijQA0XzwUxnnqAAXhgt5DDnQbmPnFxcPssBxgsz4sAgfoo')
})

test('encode with object payload', (t) => {
  const token = sign({uid: '1234567890', exp: '1000000'}, 'bar')
  t.is(token, '~Lq2jEAAcn/wLXe3uK9mDZS83OOOHVVOhT7LenjRTl+N6fbsohvVsjgQEITan3srP30ZGquUKV4mHfoWtRxRWAQexp=1000000&uid=1234567890')
})

test('encode with object payload (keys order)', (t) => {
  const token = sign({exp: '1000000', uid: '1234567890', junk: undefined}, 'bar')
  t.is(token, '~Lq2jEAAcn/wLXe3uK9mDZS83OOOHVVOhT7LenjRTl+N6fbsohvVsjgQEITan3srP30ZGquUKV4mHfoWtRxRWAQexp=1000000&uid=1234567890')
})

test('encode with array payload', (t) => {
  const token = sign(['foo', 'bar', 42], 'bar')
  t.is(token, '~4dxwoKlLzbpWUwuCsnh1mgoazvkpUDjx3YdsRA7hJc8wlH7EkQncHjgVYNL7AJsijiAipO6tRdbFhGQMm63PBg0=foo&1=bar&2=42')
})

test('decode token', (t) => {
  const { signature, data } = decode('~hKCl4E6c-K_CE9DLMBIskGmuIW26C9MCTjTT2f0g1dY-4T3N_CTl3rauKZ1oZQSN12G1DUWexyoWEK1rQ0UZAAfo%3Do')
  t.is(signature.length, 64)
  t.deepEqual(data, 'fo=o')
})

test('safe decode token', (t) => {
  const { ok, signature, data } = safeDecode('~hKCl4E6c-K_CE9DLMBIskGmuIW26C9MCTjTT2f0g1dY-4T3N_CTl3rauKZ1oZQSN12G1DUWexyoWEK1rQ0UZAAfo%3Do')
  t.true(ok)
  t.is(signature.length, 64)
  t.deepEqual(data, 'fo=o')
})

test('decode mailformed token', (t) => {
  t.throws(() => decode('Lq2jEAAcn/wLXe3uK9mDZS83OOOHVVOhT7LenjRTl+N6fbsohvVsjgQEITan3srP30ZGquUKV4mHfoWtRxRWAQexp=1000000&uid=1234567890'))
})

test('safe decode mailformed token', (t) => {
  const { ok } = safeDecode('Lq2jEAAcn/wLXe3uK9mDZS83OOOHVVOhT7LenjRTl+N6fbsohvVsjgQEITan3srP30ZGquUKV4mHfoWtRxRWAQexp=1000000&uid=1234567890')
  t.false(ok)
})

test('verify token', (t) => {
  const token = sign('foo', 'bar')
  const { ok } = verify(token, 'bar')
  t.true(ok)
})

test('verify token', (t) => {
  const { ok, data } = verify('~Lq2jEAAcn/wLXe3uK9mDZS83OOOHVVOhT7LenjRTl+N6fbsohvVsjgQEITan3srP30ZGquUKV4mHfoWtRxRWAQexp=1000000&uid=1234567890', 'bar')
  t.true(ok)
  t.deepEqual(data, { exp: '1000000', uid: '1234567890' })
})

test('verify token with pubkey', (t) => {
  const { publicKey } = makeKeypair('bar')
  const { ok, data } = verify('~Lq2jEAAcn/wLXe3uK9mDZS83OOOHVVOhT7LenjRTl+N6fbsohvVsjgQEITan3srP30ZGquUKV4mHfoWtRxRWAQexp=1000000&uid=1234567890', publicKey)
  t.true(ok)
  t.deepEqual(data, { exp: '1000000', uid: '1234567890' })
})
