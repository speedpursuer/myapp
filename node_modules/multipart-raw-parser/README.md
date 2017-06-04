# Multipart Raw Parser
[![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![coverages][coverage-image]][coverage-url] [![downloads][downloads-image]][downloads-url]

[travis-image]: https://travis-ci.org/Wing-eu/multipart-raw-parser.svg?branch=master
[travis-url]: https://travis-ci.org/Wing-eu/multipart-raw-parser
[npm-image]: https://badge.fury.io/js/multipart-raw-parser.svg
[npm-url]: https://badge.fury.io/js/multipart-raw-parser
[downloads-image]: https://img.shields.io/npm/dm/multipart-raw-parser.svg
[downloads-url]: https://npmjs.org/package/multipart-raw-parser
[coverage-image]: https://codecov.io/gh/Wing-eu/multipart-raw-parser/branch/master/graph/badge.svg?branch=master
[coverage-url]: https://codecov.io/gh/Wing-eu/multipart-raw-parser?branch=master


[The multipart raw parser](https://github.com/Wing-eu/multipart-raw-parser) is a helper function to parse a multipart/*whatever* Content-Type from any HttpRequest response.

## Installation

Install the npm module:
``` bash
  $ npm install multipart-raw-parser --save
```

## Documentation


### Arguments
 * `contentType`: The response header `Content-Type`.
 * `body`: The response body as a string containing all multipart data parts.

 A multipart/*whatever* response is composed for each content of a `boundary identifier`, `headers` and `contents`:

``` bash
--uuid:2e6eb930-a6da-43e2-850c-ce98e3bbdb16
Content-Type: application/xop+xml; charset=UTF-8; type="text/xml";
Content-Transfer-Encoding: binary
Content-ID: <root.message@cxf.apache.org>

<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    ...
  </soap:Body>
</soap:Envelope>

--uuid:2e6eb930-a6da-43e2-850c-ce98e3bbdb16
Content-Type: application/octet-stream
Content-Transfer-Encoding: binary
Content-ID: <cc4451c7-9084-401b-b20d-c40331c4c43d-47984@cxf.apache.org>

sdbjkcndsjkvbdjs...
```
**NOTE**: The function will not process any form which do not contain a boundary identifier (`--id:...`).

### Returns

An array of objects composed of an index representing the position of the part in the `body` parameters, the part value and a array of object containing parsed headers.

### Example
Here is a simple way to use the library:

``` javascript
import fetch from 'fetch'
import { parse } from 'multipart-raw-parser'

try {
  const response = await fetch('https://wh.at/raw')
  const multipartDataArray = parse(response, response.headers.get('Content-Type'))
  console.log(multipartDataArray)
  // [...{
  //    index: 1,
  //    headers: [{
  //      name: 'Content-Type',
  //      value: 'application/octet-stream'
  //    }, ...],
  //    value: 'sdbjkcndsjkvbdjs...'
  // }]
} catch (e) {
  throw (e)
}
```

## Development

To run the function locally:

``` bash
npm install
npm run dev
```

Keep CI tests passing by running `npm run test` or `npm run test:watch` and `npm run lint` often.

## Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

You can find every release documented on the [Releases](https://github.com/Wing-eu/multipart-raw-parser/releases) page.

## License

MIT
