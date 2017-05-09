var request = require('superagent')
var DEFAULT_REQ_URL = 'https://upload.gyazo.com/api/upload/easy_auth'

module.exports = function (dataUrl, options) {
  if (!options || !options.clientId) {
    throw new Error('You need to provide a "clientId" option for gyazo to know who sends this image!')
  }
  var reqUrl = options.reqUrl || DEFAULT_REQ_URL
  var referer = options.referer || (global.window && encodeURIComponent(global.window.location.href))
  var sendObject = {
    referer_url: referer,
    client_id: options.clientId,
    image_url: dataUrl,
    title: options.title
  }

  return request.post(reqUrl)
    .withCredentials()
    .type('form')
    .send(sendObject)
    .then(function (res) {
      var gyazoUrl = res.body.get_image_url
      return request.get(gyazoUrl)
        .withCredentials()
        .then(function (res) {
          if (res.redirects && res.redirects.length > 0) {
            gyazoUrl = res.redirects[res.redirects.length - 1]
          } else if (res.xhr) {
            gyazoUrl = res.xhr.responseURL
          }
          var match = gyazoUrl.match(/[a-f0-9]{32}/)
          if (!match) {
            return Promise.reject(new Error('Invalid response from server, not a gyazo image'))
          }
          return {
            url: gyazoUrl,
            imageId: match[0]
          }
        })
    })
}
