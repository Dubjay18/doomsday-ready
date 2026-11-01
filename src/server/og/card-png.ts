import { deflateSync } from 'node:zlib'

/** 1200×630 share image. Bitmap font only, so the card cannot smuggle an answer key in as text. */
export interface ShareCardArt {
  name: string
  stamp: string
  scoreLine: string
  rankLine: string
  kicker: string
  ready: boolean
  pct: number
}

const W = 1200
const H = 630
const INK: RGB = [0x11, 0x11, 0x11]
const POW: RGB = [0xff, 0xd2, 0x3f]
const PAPER: RGB = [0xff, 0xf4, 0xdc]
const RED: RGB = [0xc8, 0x10, 0x2e]
const GREEN: RGB = [0x2e, 0x7d, 0x32]
const ORANGE: RGB = [0xff, 0x8a, 0x3d]

type RGB = [number, number, number]

/** 5×7 glyphs, MSB = left pixel. */
const GLYPH: Record<string, number[]> = {
  ' ': [0, 0, 0, 0, 0, 0, 0],
  '0': [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110],
  '1': [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  '2': [0b01110, 0b10001, 0b00001, 0b00010, 0b00100, 0b01000, 0b11111],
  '3': [0b11110, 0b00001, 0b00001, 0b01110, 0b00001, 0b00001, 0b11110],
  '4': [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
  '5': [0b11111, 0b10000, 0b10000, 0b11110, 0b00001, 0b00001, 0b11110],
  '6': [0b01110, 0b10000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110],
  '7': [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
  '8': [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  '9': [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00001, 0b01110],
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  B: [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  D: [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  G: [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01111],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  I: [0b01110, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  J: [0b00111, 0b00010, 0b00010, 0b00010, 0b00010, 0b10010, 0b01100],
  K: [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  Q: [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01101],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  V: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  W: [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b10101, 0b01010],
  X: [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  Z: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
  '%': [0b11001, 0b11010, 0b00010, 0b00100, 0b01000, 0b01011, 0b10011],
  '!': [0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00000, 0b00100],
  '-': [0b00000, 0b00000, 0b00000, 0b11111, 0b00000, 0b00000, 0b00000],
}

function crc32(buf: Buffer) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c >>> 0
}

function chunk(type: string, data: Buffer) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(td))
  return Buffer.concat([len, td, crc])
}

function fit(text: string) {
  return text
    .toUpperCase()
    .replace(/[^A-Z0-9 %!-]/g, ' ')
    .replace(/ +/g, ' ')
    .trim()
}

function scaleFor(text: string, maxWidth: number, preferred: number) {
  const n = Math.max(text.length, 1)
  const fitted = Math.floor(maxWidth / (6 * n - 1))
  return Math.max(2, Math.min(preferred, fitted))
}

function fillRect(px: Buffer, x: number, y: number, w: number, h: number, color: RGB) {
  const x0 = Math.max(0, x)
  const y0 = Math.max(0, y)
  const x1 = Math.min(W, x + w)
  const y1 = Math.min(H, y + h)
  for (let yy = y0; yy < y1; yy++) {
    const row = yy * W * 3
    for (let xx = x0; xx < x1; xx++) {
      const i = row + xx * 3
      px[i] = color[0]
      px[i + 1] = color[1]
      px[i + 2] = color[2]
    }
  }
}

function drawText(px: Buffer, text: string, x: number, y: number, scale: number, color: RGB) {
  let cx = x
  for (const ch of text) {
    const g = GLYPH[ch] ?? GLYPH[' ']
    for (let row = 0; row < 7; row++) {
      const bits = g[row]
      for (let col = 0; col < 5; col++) {
        if ((bits & (1 << (4 - col))) !== 0) fillRect(px, cx + col * scale, y + row * scale, scale, scale, color)
      }
    }
    cx += 6 * scale
  }
}

function drawCentered(px: Buffer, text: string, y: number, scale: number, color: RGB) {
  const width = text.length === 0 ? 0 : text.length * 6 * scale - scale
  drawText(px, text, Math.floor((W - width) / 2), y, scale, color)
}

export function renderShareCard(art: ShareCardArt): Buffer {
  const px = Buffer.alloc(W * H * 3, INK[0])
  fillRect(px, 0, 0, W, H, INK)
  fillRect(px, 0, 0, W, 28, POW)
  fillRect(px, 0, H - 28, W, 28, POW)
  fillRect(px, 0, 0, 28, H, POW)
  fillRect(px, W - 28, 0, 28, H, POW)

  const stamp = fit(art.stamp) || 'OOF!'
  const score = fit(art.scoreLine)
  const rank = fit(art.rankLine)
  const name = fit(art.name) || 'PLAYER'
  const kicker = fit(art.kicker) || 'DOOMSDAY READY'
  const stampColor = art.ready ? GREEN : art.pct >= 50 ? ORANGE : RED

  drawCentered(px, kicker, 78, scaleFor(kicker, 1040, 5), POW)
  const stampScale = scaleFor(stamp, 1080, 10)
  drawCentered(px, stamp, 168, stampScale, stampColor)
  const scoreY = 168 + 7 * stampScale + 40
  drawCentered(px, score, scoreY, scaleFor(score, 1040, 6), PAPER)
  drawCentered(px, name, 500, scaleFor(name, 1040, 5), POW)
  drawCentered(px, rank, 555, scaleFor(rank, 1040, 4), PAPER)

  const raw = Buffer.alloc((W * 3 + 1) * H)
  for (let y = 0; y < H; y++) {
    const off = y * (W * 3 + 1)
    raw[off] = 0
    px.copy(raw, off + 1, y * W * 3, (y + 1) * W * 3)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(W, 0)
  ihdr.writeUInt32BE(H, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))])
}
