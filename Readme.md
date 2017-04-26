# gyazo-browser-upload

[![Build Status](https://travis-ci.org/martinheidegger/gyazo-browser-upload.svg?branch=master)](https://travis-ci.org/martinheidegger/gyazo-browser-upload)

Lightweight in-browser library to simply upload a base64 image to gyazo.

## Why?

[gyazo-api](https://www.npmjs.com/package/gyazo-api) allows upload to gyazo quite
well but it requires authentication. This library is a in-browser library
that allows to simply upload an image to your gyazo account.

## How?

It uses the lightweight [superagent](https://github.com/visionmedia/superagent)
package to send a POST request with the image data to the server.

## Step-by-step

1. Install this package: `$ npm install gyazo-browser-upload --save`
2. Use the package
    ```javascript
    const upload = require('gyazo-browser-upload')
    const redDotImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
    const options = {clientId: 'My client'}
    upload(redDotImage, options)
      .then((info) {
         info.url // URL of the image
         info.id // ID of the image
      })
    ```

## Options

- `options.clientId` … Identifier to be used to show in gyazo where the request came from **required!**
- `options.reqUrl` … URL to which the request should be sent _(optional, default: https://upload.gyazo.com/api/upload/easy_auth)_
- `options.referer` … Browser referer to be set _(optiona, default: `window.location.href`)_
- `options.title` … Title that the image should get after uploading. _(optional)_
