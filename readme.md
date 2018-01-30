# `~token`
[![NPM Version](https://img.shields.io/npm/v/tilde-token.svg?style=flat-square)](https://www.npmjs.com/package/tilde-token)
[![node](https://img.shields.io/node/v/tilde-token.svg?style=flat-square)](https://www.npmjs.com/package/tilde-token)
[![Build Status](https://img.shields.io/travis/kitcast/tilde-token.svg?branch=master&style=flat-square)](https://travis-ci.org/kitcast/tilde-token)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)


> 🔐 Lightweight secure tokens

## Features

* Lightweight
* Secure
* Human readable (almost)
* Load balancer friendly

## Installation

`$ npm install tilde-token`

or

`$ yarn add tilde-token`

## Usage

```js

const { sign, verify, makeKeypair } = require('tilde-token')

// Create token
const token = sign('foo', 'secret')

// Verify token
const { ok, data } = verify(token, 'secret')

// Verify token using public key
const { publicKey } = makeKeypair('secret')
const { ok, data } = verify(token, publicKey)

```

```js

const { signer, verifier } = require('tilde-token')

// Sign/Veryfy factories
const sign = signer('secret')
const verify = verifier('secret')

// Create token
const token = sign({uid: '42', ssid: 'deadbeef'})

// Decode and verify token
const { ok, data } = verify(token)
console.log('result', ok, data)

```

### API

##### `signer(seed) -> fn(data)`
##### `sign(data, seed)`
##### `verifier(pubKeyOrSeed)`
##### `verify(token, pubKeyOrSeed)`
##### `decode(token)`
##### `safeDecode(token)`
##### `makeKeypair(seed)`

## Token structure

Example: `~qlHxEVZjv983RJcqQ/uMEHhdshyp7wp0Mwr/tVyKav3ijQA0XzwUxnnqAAXhgt5DDnQbmPnFxcPssBxgsz4sAgfoo`

```
┌────────────────┬────────────────────────────────────┬───────────────┐
│     prefix     │             signature              │    payload    │
├────────────────┼────────────────────────────────────┼───────────────┤
│       ~        │ qlHxEVZjv983RJcqQ...xcPssBxgsz4sAg │     foo       │
└────────────────┴────────────────────────────────────┴───────────────┘
```

* `prefix`(1 byte) - tilde itself;
* `signature`(86 bytes) - payload signature (ed25519, base64-encoded, without padding);
* `payload`(vary) - urlencoded/urlescaped data;
