var nock = require('nock')
var test = require('tape')
var gyazo = require('..')
var qs = require('querystring')

var CLIENT_ID = 'gyazo-browser-api/test'

// From Wikipedia https://en.wikipedia.org/wiki/Data_URI_scheme
var redDotImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='

test(function (t) {
  var domain = 'https://upload.gyazo.com'
  var imageId = '0123456789abcdef0123456789abcdef'
  var imageUrl = '/' + imageId
  var otherDomain = 'https://moxy.com'
  var otherLocation = otherDomain + imageUrl + '/'
  var title = '日本語のタイトル  with some english text, and special chars like $%!{~@l}'

  // Go to the easy_auth endpoint
  nock(domain)
    .post('/api/upload/easy_auth', function (body) {
      body = qs.parse(body)
      t.equals(body.client_id, CLIENT_ID)
      t.equals(body.image_url, redDotImage)
      t.equals(body.title, title)
      return true
    })
    .reply(200, {
      get_image_url: domain + imageUrl
    })

  // Handle a redirect
  nock(domain)
    .get(imageUrl)
    .reply(301, 'OK', {
      Location: domain + imageUrl + '2'
    })

  // Another redirect to have more than one redirect
  nock(domain)
    .get(imageUrl + '2')
    .reply(301, 'OK', {
      Location: otherLocation
    })

  // Final request
  nock(otherDomain)
    .get(imageUrl + '/')
    .reply(200, 'OK')

  gyazo(redDotImage, {
    clientId: CLIENT_ID,
    title: title
  })
    .then(function (result) {
      t.equals(result.url, otherLocation)
      t.equals(result.imageId, imageId)
      t.end()
    })
    .catch(t.fail)
})
