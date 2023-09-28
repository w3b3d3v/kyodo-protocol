const dotenv = require('dotenv');
const path = require('path');
const bs58 = require('bs58');
const fs = require('fs');
dotenv.config({ path: path.resolve(__dirname, '../../../.env.development.local') });

b = bs58.decode(process.env.PHANTOM_WALLET_PRIVATE_KEY);
j = new Uint8Array(b.buffer, b.byteOffset, b.byteLength / Uint8Array.BYTES_PER_ELEMENT);
fs.writeFileSync('../mykey.json', `[${j}]`);