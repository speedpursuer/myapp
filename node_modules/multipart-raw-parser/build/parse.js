'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseHeader = exports.parseBoundary = exports.parse = undefined;

var _regex = require('./regex');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Flow Typing


// import {
//   convertToRaw,
// } from 'helpers'

var HeaderObject = _flowRuntime2.default.type('HeaderObject', _flowRuntime2.default.object(_flowRuntime2.default.property('name', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('value', _flowRuntime2.default.string(), true)));

var MultipartParsedObject = _flowRuntime2.default.type('MultipartParsedObject', _flowRuntime2.default.object(_flowRuntime2.default.property('index', _flowRuntime2.default.number()), _flowRuntime2.default.property('value', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('headers', _flowRuntime2.default.array(HeaderObject), true)));

/**
 * Parse the content-type header received in the response
 * @param  {String}  contentType The response global content-type
 * @return {String}
 */


var parseBoundary = _flowRuntime2.default.annotate(function (contentType) {
  var _contentTypeType = _flowRuntime2.default.string();

  var _returnType = _flowRuntime2.default.return(_flowRuntime2.default.string());

  _flowRuntime2.default.param('contentType', _contentTypeType).assert(contentType);

  var arrayResults = contentType.match(_regex.REGEX_PARSE_BOUNDARY);

  if (!arrayResults) {
    throw new Error('Bad content-type header, no multipart boundary');
  }

  var boundary = arrayResults[1];

  // \r\n is part of the boundary.
  return _returnType.assert(String('\r\n--' + boundary));
}, _flowRuntime2.default.function(_flowRuntime2.default.param('contentType', _flowRuntime2.default.string()), _flowRuntime2.default.return(_flowRuntime2.default.string())));

/**
 * Parse headers values from the the current part
 * @param  {Array<String>}  headers HeaderObject array
 * @return {Array<HeaderObject>}
 */
var parseHeader = _flowRuntime2.default.annotate(function (headers) {
  var _headersType = _flowRuntime2.default.array(_flowRuntime2.default.string());

  var _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.array(HeaderObject));

  _flowRuntime2.default.param('headers', _headersType).assert(headers);

  return _returnType2.assert(headers.map(_flowRuntime2.default.annotate(function (header) {
    var _headerType = _flowRuntime2.default.string();

    var _returnType3 = _flowRuntime2.default.return(HeaderObject);

    _flowRuntime2.default.param('header', _headerType).assert(header);

    var matchResult = _flowRuntime2.default.nullable(_flowRuntime2.default.array(_flowRuntime2.default.string())).assert(header.match(_regex.REGEX_PARSE_HEADER));
    if (!matchResult) {
      return _returnType3.assert({});
    }
    return _returnType3.assert({ name: matchResult[1], value: matchResult[2] });
  }, _flowRuntime2.default.function(_flowRuntime2.default.param('header', _flowRuntime2.default.string()), _flowRuntime2.default.return(HeaderObject)))));
}, _flowRuntime2.default.function(_flowRuntime2.default.param('headers', _flowRuntime2.default.array(_flowRuntime2.default.string())), _flowRuntime2.default.return(_flowRuntime2.default.array(HeaderObject))));

/**
 * Parse a multipart/data raw response
 * @param  {string}  body Response string
 * @param  {String}  contentType  The response global content-type
 * @return {Array<MultipartParsedObject>}
 */
var parse = _flowRuntime2.default.annotate(function (body, contentType) {
  var _bodyType = _flowRuntime2.default.string();

  var _contentTypeType2 = _flowRuntime2.default.string();

  var _returnType4 = _flowRuntime2.default.return(_flowRuntime2.default.array(MultipartParsedObject));

  _flowRuntime2.default.param('body', _bodyType).assert(body);

  _flowRuntime2.default.param('contentType', _contentTypeType2).assert(contentType);

  // Parse body boundary
  var boundary = _flowRuntime2.default.string().assert(parseBoundary(contentType));

  // Convert and work on body if type is not a raw string
  // const isRaw = (typeof (body) !== 'string')
  var _rawBodyType = _flowRuntime2.default.string(),
      rawBody = _rawBodyType.assert(body);

  // if (isRaw) {
  //   rawBody = convertToRaw(body, isRaw)
  // }
  // Prepend what has been stripped by the body parsing mechanism.
  rawBody = _rawBodyType.assert('\r\n' + rawBody);
  // Parse content using the boundary and remove empty element
  var contents = rawBody.split(new RegExp(boundary)).filter(Boolean);

  var res = contents.map(function (content, index) {
    var subparts = content.split('\r\n\r\n');
    var headers = subparts[0].split('\r\n').filter(Boolean);
    var value = subparts[1] ? subparts[1] : '';
    var headerFields = parseHeader(headers);
    // @TODO Convert value content using the right content-type available in headers
    // or let it as a string

    return {
      index: index,
      value: value,
      headers: headerFields
    };
  });

  return _returnType4.assert(res);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('body', _flowRuntime2.default.string()), _flowRuntime2.default.param('contentType', _flowRuntime2.default.string()), _flowRuntime2.default.return(_flowRuntime2.default.array(MultipartParsedObject))));

exports.parse = parse;
exports.parseBoundary = parseBoundary;
exports.parseHeader = parseHeader;