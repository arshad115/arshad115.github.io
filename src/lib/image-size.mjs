import fs from 'node:fs';
import path from 'node:path';

// Intrinsic sizes recorded once for legacy hot-linked images. Keeping them
// here makes static builds deterministic and prevents layout shift without
// downloading third-party media during every build.
const remoteImageSizes = new Map([
  ['https://www.gt-world-challenge-america.com//timthumb.php?w=1600&src=%2Fimages%2FSRO_SEB_2024_2142__FL-TP.JPG', { width: 1600, height: 1066 }],
  ['https://github.com/kookydroid-apps/crosspromote/raw/master/1.png', { width: 1080, height: 2160 }],
  ['https://i.imgur.com/0tg1mAht.png', { width: 160, height: 160 }],
  ['https://i.imgur.com/d7MXzlT.png', { width: 582, height: 85 }],
  ['https://i.imgur.com/bTS1Rri.png', { width: 795, height: 601 }],
  ['https://i.imgur.com/eF4HWwn.png', { width: 619, height: 867 }],
  ['https://miro.medium.com/max/1000/1*UJ68N887kfjee-bSvCIdIQ.png', { width: 1000, height: 574 }],
  ['https://shalb.com/wp-content/uploads/2019/11/Devops1.jpeg', { width: 2232, height: 1458 }],
  ['https://upload.wikimedia.org/wikipedia/commons/6/6b/Seagate2015_2c_horizontal_pos.png', { width: 5493, height: 1835 }],
  ['https://habrastorage.org/storage2/471/e3b/097/471e3b097546725b54e9ef7e6c0d5dd7.png', { width: 550, height: 160 }],
  ['https://thatsmytop10.com/wp-content/uploads/2014/05/Top-10-Funny-COC-Base-no-1.jpg', { width: 1024, height: 768 }],
  ['https://gamingcy.com/wp-content/uploads/2024/09/Caude-6-in-Destiny-2-The-Final-Shape.jpg', { width: 1560, height: 485 }],
  ['https://images.ctfassets.net/kftzwdyauwt9/7LzxdzMcijUYHtIES6rmub/1dd3bc9f423a6b1cd5176936dbb029aa/Entry_Point.png?w=1920&q=90&fm=webp', { width: 1920, height: 1080 }],
  ['https://i.imgur.com/RhGKTdE.png', { width: 1558, height: 469 }],
  ['https://i.imgur.com/2fGgtLB.png', { width: 1098, height: 73 }],
  ['https://dev.mysql.com/doc/workbench/en/images/wb-manage-db-connections-ssh-parameters.png', { width: 800, height: 536 }],
  ['https://cdn-images-1.medium.com/max/1600/1*Cd2NBjQD8Luwbu1Z23n5QQ.png', { width: 1600, height: 900 }],
  ['https://www.it-daily.net/images/Aufmacher-2019/Remote_Access_shutterstock_434600221_700.jpg', { width: 700, height: 400 }],
]);

function jpegSize(buf) {
  let offset = 2;
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) return undefined;
    const marker = buf[offset + 1];
    if (marker === 0xda) return undefined;
    const size = buf.readUInt16BE(offset + 2);
    const sof =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (sof) {
      return {
        height: buf.readUInt16BE(offset + 5),
        width: buf.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + size;
  }
  return undefined;
}

function webpSize(buf) {
  const kind = buf.toString('ascii', 12, 16);
  if (kind === 'VP8X' && buf.length >= 30) {
    const width = 1 + buf[24] + (buf[25] << 8) + (buf[26] << 16);
    const height = 1 + buf[27] + (buf[28] << 8) + (buf[29] << 16);
    return { width, height };
  }
  if (kind === 'VP8 ' && buf.length >= 30) {
    return {
      width: buf.readUInt16LE(26) & 0x3fff,
      height: buf.readUInt16LE(28) & 0x3fff,
    };
  }
  if (kind === 'VP8L' && buf.length >= 25) {
    const bits = buf.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }
  return undefined;
}

export function sizeFromBuffer(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 24) return undefined;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    return jpegSize(buf);
  }
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    return webpSize(buf);
  }
  return undefined;
}

/** Intrinsic pixel size for a site-root image (`/assets/...`). */
export function imageSize(src) {
  if (!src || typeof src !== 'string') return undefined;
  if (/^https?:/i.test(src)) return remoteImageSizes.get(src);
  if (/^(data:|\/\/)/i.test(src)) return undefined;
  const file = path.join(process.cwd(), 'public', src.replace(/^\//, ''));
  try {
    return sizeFromBuffer(fs.readFileSync(file));
  } catch {
    return undefined;
  }
}
