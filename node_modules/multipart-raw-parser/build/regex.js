"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var REGEX_PARSE_HEADER = /^(.*):(.*)$/m;
var REGEX_PARSE_BOUNDARY = /boundary=(?:"([^"]+)")/i;

exports.REGEX_PARSE_HEADER = REGEX_PARSE_HEADER;
exports.REGEX_PARSE_BOUNDARY = REGEX_PARSE_BOUNDARY;