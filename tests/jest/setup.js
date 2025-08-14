// This is necessary because Jest's JSDOM environment doesn't include these by default.
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
