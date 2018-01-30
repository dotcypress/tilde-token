# `~ token`
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

const { 
  sign, 
  signer, 
  verify, 
  verifier, 
  decode, 
  makeKeypair 
} = require('tilde-token')

// Create token
const token = sign('foo', 'secret')

// Decode token without signature verification
const { ok, data, signature } = decode(token)

// Verify token
const { ok, data } = verify(token, 'secret')

// Verify token using public key
const { publicKey } = makeKeypair('secret')
const { ok, data } = verify(token, publicKey)

// Sign/Veryfy factories
const signToken = signer('secret')
const verifyToken = verifier('secret')

// Create token
const token = signToken({uid: '42', ssid: 'deadbeef'})

// Decode and verify token
const { ok, data } = verifyToken(token)
console.log('result', ok, data)

```

Example token:

`~qlHxEVZjv983RJcqQ/uMEHhdshyp7wp0Mwr/tVyKav3ijQA0XzwUxnnqAAXhgt5DDnQbmPnFxcPssBxgsz4sAgfoo`

```
┌────────────────┬────────────────────────────────┬───────────────┐
│     prefix     │           signature            │    payload    │
├────────────────┼────────────────────────────────┼───────────────┤
│       ~        │ qlHxEVZjv3RJcqQ...xcPssBxz4sAg │     foo       │
└────────────────┴────────────────────────────────┴───────────────┘
```

* `prefix`(1 byte) - tilde itself;
* `signature`(86 bytes) - payload signature (ed25519, base64-encoded, without padding);
* `payload`(vary) - urlencoded/urlescaped data;
