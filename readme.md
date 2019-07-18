# `~ token`
[![NPM Version](https://img.shields.io/npm/v/tilde-token.svg?style=flat-square)](https://www.npmjs.com/package/tilde-token)
[![node](https://img.shields.io/node/v/tilde-token.svg?style=flat-square)](https://www.npmjs.com/package/tilde-token)
[![Build Status](https://img.shields.io/travis/kitcast/tilde-token.svg?branch=master&style=flat-square)](https://travis-ci.org/kitcast/tilde-token)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

> 🔐 Lightweight secure tokens

## Features

* Lightweight
* Secure
* Blazing fast
* Tamper Resistant
* Load balancer friendly

## Installation

`$ npm install tilde-token`

or

`$ yarn add tilde-token`

## Token structure

Example token: `~qlHxEVZjv983RJcqQ/uMEHhdshyp7wp0Mwr/tVyKav3ijQA0XzwUxnnqAAXhgt5DDnQbmPnFxcPssBxgsz4sAgfoo`

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

## Usage

```js
const {
  sign,
  signer,
  verify,
  verifier,
  decode,
  loadKeyPair,
  generateKeyPair
} = require('tilde-token')

// Load keypair
const { privateKey, publicKey } = loadKeyPair('-----BEGIN PRIVATE KEY-----\nMC4CAQAwBQYDK2VwBCIEIOAzzaE6rikNTr4ZbEz66rsGMxUfTutx2namfDJpmwD1\n-----END PRIVATE KEY-----')

// Generate keypair
const { privateKey, publicKey } = generateKeyPair()

// Create token
const token = sign('foo', privateKey)

// Decode token without signature verification
const { ok, data, signature } = decode(token)

// Verify token
const { ok, data } = verify(token, privateKey)

// Sign/Veryfy factories
const signToken = signer(privateKey)
const verifyToken = verifier(privateKey)

// Verify token using public key
const { ok, data } = verify(token, publicKey)

// Create token
const token = signToken({uid: '42', ssid: 'deadbeef'})

// Decode and verify token
const { ok, data } = verifyToken(token)
console.log('result', ok, data)

```
