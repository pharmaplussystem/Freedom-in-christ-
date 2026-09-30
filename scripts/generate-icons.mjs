import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, r, g, b, isMaskable = false) {
  // Simple uncompressed or deflate PNG
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = isMaskable ? width * 0.38 : width * 0.44;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default dark navy background
      let pr = 15;
      let pg = 23;
      let pb = 42;
      let pa = 255;

      // Draw Shield / Circle emblem
      if (dist < radius) {
        // Inner gradient
        pr = 30;
        pg = 41;
        pb = 59;
      }
      if (Math.abs(dist - radius) < (width * 0.02)) {
        // Gold border
        pr = 234;
        pg = 179;
        pb = 8;
      }

      // Draw Cross in center
      const inVBeam = Math.abs(dx) < (width * 0.04) && Math.abs(dy) < (height * 0.28);
      const inHBeam = Math.abs(dy + height * 0.04) < (height * 0.04) && Math.abs(dx) < (width * 0.22);
      if (inVBeam || inHBeam) {
        pr = 250;
        pg = 204;
        pb = 21; // Bright Gold Cross
      }

      rawData[pxOffset] = pr;
      rawData[pxOffset + 1] = pg;
      rawData[pxOffset + 2] = pb;
      rawData[pxOffset + 3] = pa;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const sig = Buffer.from([137, 80, 78, 72, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0); // length
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  ihdr[16] = 8; // bit depth
  ihdr[17] = 6; // color type 6 (RGBA)
  ihdr[18] = 0; // compression
  ihdr[19] = 0; // filter
  ihdr[20] = 0; // interlace
  const ihdrCrc = crc32(ihdr.subarray(4, 21));
  ihdr.writeUInt32BE(ihdrCrc, 21);

  // IDAT
  const idat = Buffer.alloc(8 + deflated.length + 4);
  idat.writeUInt32BE(deflated.length, 0);
  idat.write('IDAT', 4);
  deflated.copy(idat, 8);
  const idatCrc = crc32(idat.subarray(4, 8 + deflated.length));
  idat.writeUInt32BE(idatCrc, 8 + deflated.length);

  // IEND
  const iend = Buffer.alloc(12);
  iend.writeUInt32BE(0, 0);
  iend.write('IEND', 4);
  const iendCrc = crc32(iend.subarray(4, 8));
  iend.writeUInt32BE(iendCrc, 8);

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// Simple CRC32 implementation
function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

fs.writeFileSync('./public/pwa-192x192.png', createPNG(192, 192, 234, 179, 8));
fs.writeFileSync('./public/pwa-512x512.png', createPNG(512, 512, 234, 179, 8));
fs.writeFileSync('./public/pwa-maskable-512x512.png', createPNG(512, 512, 234, 179, 8, true));
fs.writeFileSync('./public/apple-touch-icon.png', createPNG(180, 180, 234, 179, 8));
fs.writeFileSync('./public/favicon.ico', createPNG(32, 32, 234, 179, 8));
console.log('Generated PNG icons successfully.');
