// generate 6-char base62 code
const crypto = require('crypto');
const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateCode() {
  const buf = crypto.randomBytes(6);
  let code = '';
  for (let i = 0; i < buf.length; i++) {
    code += chars[buf[i] % chars.length];
  }
  return code;
}

module.exports = generateCode;
