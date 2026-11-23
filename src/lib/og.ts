// Share images (1200x630) for every page, drawn in the site's own type and colours.
import fs from 'node:fs'
import { createRequire } from 'node:module'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'

const require = createRequire(import.meta.url)
const font = (pkg: string, file: string) => fs.readFileSync(require.resolve(`${pkg}/files/${file}`))
const fonts = [
  { name: 'Familjen Grotesk', weight: 700 as const, data: font('@fontsource/familjen-grotesk', 'familjen-grotesk-latin-700-normal.woff') },
  { name: 'Familjen Grotesk Ext', weight: 700 as const, data: font('@fontsource/familjen-grotesk', 'familjen-grotesk-latin-ext-700-normal.woff') },
  { name: 'Plex Mono', weight: 400 as const, data: font('@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff') },
  { name: 'Plex Mono Ext', weight: 400 as const, data: font('@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-ext-400-normal.woff') },
]

const BG = '#121110'
const INK = '#f2efe9'
const MUTED = '#a59f96'
const AMBER = '#ffb000'

export interface OgCard {
  title: string
  label: string // what kind of page this is, e.g. "Talk"
  detail?: string // where and when
  text?: string // one or two sentences under the title, used when there is no picture
  image?: ImageMetadata
  round?: boolean
}

const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}) => ({
  type,
  props: { style: { display: 'flex', ...style }, children, ...extra },
})

function filePath(image: ImageMetadata) {
  const fsPath = (image as ImageMetadata & { fsPath?: string }).fsPath
  if (fsPath) return fsPath
  return decodeURIComponent(image.src.replace(/^\/@fs/, '').split('?')[0])
}

async function picture(image: ImageMetadata, w: number, h: number) {
  const buf = await sharp(filePath(image)).resize(w, h, { fit: 'cover', position: 'attention' }).jpeg({ quality: 86 }).toBuffer()
  return `data:image/jpeg;base64,${buf.toString('base64')}`
}

const clip = (t: string, n: number) => (t.length <= n ? t : t.slice(0, t.lastIndexOf(' ', n)).replace(/[,;:.]$/, '') + '…')

export async function renderOg({ title, label, detail, text, image, round }: OgCard) {
  // Covers keep their own proportions (they usually carry the talk title), fitted inside a 500x360 box.
  const fit = image ? Math.min(500 / image.width, 360 / image.height) : 0
  const pic = image ? (round ? { w: 380, h: 380 } : { w: Math.round(image.width * fit), h: Math.round(image.height * fit) }) : null
  const src = image && pic ? await picture(image, pic.w * 2, pic.h * 2) : null
  const textWidth = pic ? 1200 - 144 - pic.w - 56 : 1200 - 144
  const perLine = textWidth / 34
  const size = pic
    ? title.length <= perLine * 1.6 ? 76 : title.length <= perLine * 3 ? 62 : title.length <= perLine * 5 ? 50 : 42
    : title.length <= 14 ? 132 : title.length <= 30 ? 96 : title.length <= 70 ? 72 : 56

  const tree = el('div', { width: '100%', height: '100%', boxSizing: 'border-box', background: BG, color: INK, padding: '60px 72px', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'Familjen Grotesk, Familjen Grotesk Ext' }, [
    el('div', { alignItems: 'center', fontSize: 30, letterSpacing: '-0.01em' }, [
      el('div', { width: 18, height: 18, borderRadius: 9, background: AMBER, marginRight: 16 }),
      'Armağan Amcalar',
    ]),
    el('div', { alignItems: 'center', justifyContent: 'space-between' }, [
      el('div', { width: textWidth, flexDirection: 'column' }, [
        el('div', { fontSize: size, lineHeight: 1.04, letterSpacing: '-0.04em' }, title),
        !pic && text && el('div', { marginTop: 28, maxWidth: 940, fontSize: 34, lineHeight: 1.3, letterSpacing: '-0.01em', color: MUTED }, clip(text, 170)),
      ]),
      src && pic && el('img', { width: pic.w, height: pic.h, borderRadius: round ? pic.w / 2 : 10 }, undefined, { src, width: pic.w, height: pic.h }),
    ]),
    el('div', { justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: 'Plex Mono, Plex Mono Ext', fontSize: 22, color: MUTED }, [
      el('div', { maxWidth: 940 }, [el('span', { color: AMBER, marginRight: 14, flexShrink: 0 }, label.toUpperCase()), detail ?? '']),
      'arm.ag',
    ]),
  ])

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts })
  return new Resvg(svg).render().asPng()
}
