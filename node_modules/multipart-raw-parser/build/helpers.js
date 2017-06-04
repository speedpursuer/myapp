"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rawStringToBuffer = exports.convertToRaw = undefined;

var _flowRuntime = require("flow-runtime");

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert a buffer to string
 * @param  {string}  body Response string
 * @return {string}
 */
var convertToRaw = _flowRuntime2.default.annotate(function (body) {
  var _bodyType = _flowRuntime2.default.string();

  var _returnType = _flowRuntime2.default.return(_flowRuntime2.default.string());

  _flowRuntime2.default.param("body", _bodyType).assert(body);

  return _returnType.assert(String.fromCharCode.apply(null, new Uint8Array(body)));
}, _flowRuntime2.default.function(_flowRuntime2.default.param("body", _flowRuntime2.default.string()), _flowRuntime2.default.return(_flowRuntime2.default.string())));

/**
 * Convert a string to typed array buffer
 * @param  {string}  str A string
 * @return {ArrayBuffer}
 */
var rawStringToBuffer = _flowRuntime2.default.annotate(function (str) {
  var _strType = _flowRuntime2.default.string();

  var _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref(ArrayBuffer));

  _flowRuntime2.default.param("str", _strType).assert(str);

  var arr = Array.from(str);
  var result = arr.map(function (element) {
    return element.charCodeAt(0) & 0xFF;
  });
  return _returnType2.assert(new Uint8Array(result).buffer);
}, _flowRuntime2.default.function(_flowRuntime2.default.param("str", _flowRuntime2.default.string()), _flowRuntime2.default.return(_flowRuntime2.default.ref(ArrayBuffer))));

exports.convertToRaw = convertToRaw;
exports.rawStringToBuffer = rawStringToBuffer;