[![NPM Version](https://img.shields.io/npm/v/tilde-token.svg?style=flat-square)](https://www.npmjs.com/package/tilde-token)
[![node](https://img.shields.io/node/v/tilde-token.svg?style=flat-square)](https://www.npmjs.com/package/tilde-token)
[![Build Status](https://img.shields.io/travis/kitcast/tilde-token.svg?branch=master&style=flat-square)](https://travis-ci.org/kitcast/tilde-token)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)


# ~token

> 🔐 TildeToken: Lightweight auth tokens

## Features

* Lightweight
* Human readable (almost)
* Load balancer friendly

## Installation

`$ npm install tilde-token`

## Usage

```js

import { sign, verify, makeKeypair } from 'tilde-token'

// Create token
const token = sign('foo', 'secret')

// Verify token
const { ok, data } = verify(token, 'secret')

// Verify token using public key
const { publicKey } = makeKeypair('secret')
const { ok, data } = verify(token, publicKey)

```

```js

import { signer, verifier } from 'tilde-token'

const sign = signer('secret')
const verify = verifier('secret')

// Create token
const token = sign({uid: '42', ssid: 'deadbeef'})

// Decode and verify token
const { ok, data } = verify(token)
console.log('result', ok, data)

```

## Token structure

Example token: `~qlHxEVZjv983RJcqQ/uMEHhdshyp7wp0Mwr/tVyKav3ijQA0XzwUxnnqAAXhgt5DDnQbmPnFxcPssBxgsz4sAgfoo`

```
┌────────────────┬───────────────────────────┬───────────────┐
│ prefix(1 byte) │    signature(86 bytes)    │ payload(vary) │
├────────────────┼───────────────────────────┼───────────────┤
│       ~        │ ~qlHxEVZjv983...Bxgsz4sAg │     foo       │
└────────────────┴───────────────────────────┴───────────────┘
```

* `prefix` - just tilde;
* `signature` - payload signature (ed25519, base64-encoded, without padding);
* `payload` - urlencoded/urlescaped data;
