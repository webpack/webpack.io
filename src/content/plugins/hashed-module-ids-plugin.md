---
title: HashedModuleIdsPlugin
contributors:
  - shaodahong
  - byzyk
---

This plugin will cause hashes to be based on the relative path of the module, generating a four character string as the module id. Suggested for use in production.

``` js
new webpack.HashedModuleIdsPlugin({
  // Options...
});
```


## Options

This plugin supports the following options:

- `hashFunction`: The hashing algorithm to use, defaults to `'md4'`. All functions from Node.JS' [`crypto.createHash`](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options) are supported.
- `hashDigest`: The encoding to use when generating the hash, defaults to `'base64'`. All encodings from Node.JS' [`hash.digest`](https://nodejs.org/api/crypto.html#crypto_hash_digest_encoding) are supported.
- `hashDigestLength`: The prefix length of the hash digest to use, defaults to `4`.


## Usage

Here's an example of how this plugin might be used:

``` js
new webpack.HashedModuleIdsPlugin({
  hashFunction: 'sha256',
  hashDigest: 'hex',
  hashDigestLength: 20
});
```
