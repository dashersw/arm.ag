// Converts medium-export/export.json (the old arm.ag Medium publication) into Markdown content collections.
// Run: node scripts/import-medium.mjs
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const d = JSON.parse(fs.readFileSync(path.join(root, 'medium-export/export.json'), 'utf8'))
const gistCache = path.join(root, 'medium-export/gists.json')
const gists = fs.existsSync(gistCache) ? JSON.parse(fs.readFileSync(gistCache, 'utf8')) : {}

const refs = (page, pred = () => true) =>
  Object.values(d.pages[page])
    .filter(v => v.posts && pred(v))
    .flatMap(v => v.posts.map(p => p.__ref.slice(5)))
const talkIds = new Set(refs('talks'))
const articleIds = new Set(refs('articles'))
const projectMeta = {
  '25cc65a6f147': { slug: 'cote', repo: 'dashersw/cote', stars: '2.4k', year: 2013, order: 30 },
  d4fbb2ed51ff: { slug: 'brain-bits', repo: 'dashersw/brain-bits', stars: '186', year: 2017, order: 60 },
  d490d1e235d1: { slug: 'erste', repo: 'dashersw/erste', stars: '283', year: 2017, order: 80 },
  c0bf3533f09b: { slug: 'pedalboard-js', repo: 'dashersw/pedalboard.js', stars: '853', year: 2012, order: 70 },
  '9c29cec04d82': { slug: 'dovecote', repo: 'dove-cote/dovecote', year: 2016, order: 90 },
}
// Recordings that surfaced after the original posts were written.
const extraVideo = { '679343423e40': 'SrIg8mRFtQg', a7a9b74918ca: 'Y5IQ9YEWDjQ' }

const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 }
const pad = n => String(n).padStart(2, '0')
const slugify = s =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')
    .replace(/['’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
const iso = ms => new Date(ms).toISOString().slice(0, 10)

function parseEvent(sub, fallbackMs) {
  const m = sub && sub.match(/^(.*?)[,\s]+([A-Z][a-z]+)\.? (\d{1,2})(?:[–-]\d{1,2})?,? (\d{4})$/)
  if (!m || !MONTHS[m[2].slice(0, 3).toLowerCase()]) return { event: sub || '', date: iso(fallbackMs) }
  return {
    event: m[1].replace(/^@/, '').replace(/,$/, '').trim(),
    date: `${m[4]}-${pad(MONTHS[m[2].slice(0, 3).toLowerCase()])}-${pad(m[3])}`,
  }
}

// ---- URL map -------------------------------------------------------------------------------------------------
const urlOf = { '7be4447a66cb': '/about/', '81de1f7d360a': '/talks/', '3252e985ab38': '/academics/' }
const plan = []
for (const p of d.posts) {
  if (urlOf[p.id]) {
    if (p.id === '3252e985ab38') plan.push({ p, kind: 'page', file: 'pages/academics.md' })
    continue
  }
  if (talkIds.has(p.id)) {
    const sub = p.paras.find(x => x.t === 13)?.x || p.subtitle
    const ev = parseEvent(sub, p.first)
    const id = `${ev.date}-${slugify(p.title)}`
    urlOf[p.id] = `/talks/${id}/`
    plan.push({ p, kind: 'talk', file: `talks/${id}.md`, ev })
  } else if (projectMeta[p.id]) {
    urlOf[p.id] = `/projects/${projectMeta[p.id].slug}/`
    plan.push({ p, kind: 'project', file: `projects/${projectMeta[p.id].slug}.md` })
  } else {
    const id = slugify(p.title)
    urlOf[p.id] = `/articles/${id}/`
    plan.push({ p, kind: 'article', file: `articles/${id}.md` })
  }
}

function mapHref(h) {
  if (!h) return h
  if (/^https?:\/\/(www\.)?arm\.ag\/talks(\/home)?\/?$/.test(h)) return '/talks/'
  if (/^https?:\/\/arm\.ag\/academics\/?$/.test(h)) return '/academics/'
  const m = h.match(/^https?:\/\/(?:arm\.ag|(?:www\.)?medium\.com)\/(?:.*?)([0-9a-f]{10,12})(?:[?#].*)?$/)
  if (m && urlOf[m[1]]) return urlOf[m[1]]
  return h.replace(/^http:\/\/slides\.com/, 'https://slides.com').replace(/#\/$/, '')
}

// ---- inline markup -------------------------------------------------------------------------------------------
const esc = s => s.replace(/([\\`*_[\]<>~])/g, '\\$1')
function inline(text, markups = []) {
  if (!text) return ''
  const cuts = new Set([0, text.length])
  for (const m of markups) {
    cuts.add(Math.max(0, m.s))
    cuts.add(Math.min(text.length, m.e))
  }
  const pts = [...cuts].sort((a, b) => a - b)
  let out = ''
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b] = [pts[i], pts[i + 1]]
    const on = markups.filter(m => m.s <= a && m.e >= b)
    const raw = text.slice(a, b)
    const lead = raw.match(/^\s*/)[0]
    const trail = raw.slice(lead.length).match(/\s*$/)[0]
    let core = raw.slice(lead.length, raw.length - trail.length)
    if (!core) {
      out += raw
      continue
    }
    const code = on.some(m => m.t === 10)
    core = code ? '`' + core + '`' : esc(core)
    if (on.some(m => m.t === 2)) core = `*${core}*`
    if (on.some(m => m.t === 1)) core = `**${core}**`
    const link = on.find(m => m.t === 3 && m.h)
    if (link) core = `[${core}](${mapHref(link.h)})`
    out += lead + core + trail
  }
  return out
    .replace(/\n/g, '\\\n')
    .replace(/^(#|\+ |- |\d+\. )/, '\\$1')
}

// ---- embeds --------------------------------------------------------------------------------------------------
const ytId = h => h.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1]
const attr = s => String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const video = (id, title) =>
  `<div class="embed video"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${attr(title)}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`

async function gist(href) {
  const id = href.split('/').pop()
  if (!gists[id]) {
    const r = await fetch(`https://api.github.com/gists/${id}`)
    if (!r.ok) throw new Error(`gist ${id}: ${r.status}`)
    const j = await r.json()
    gists[id] = Object.values(j.files).map(f => ({ name: f.filename, lang: (f.language || '').toLowerCase(), content: f.content }))
    fs.writeFileSync(gistCache, JSON.stringify(gists, null, 1))
  }
  return gists[id]
    .map(f => '```' + ({ javascript: 'js', shell: 'bash' }[f.lang] || f.lang || '') + '\n' + f.content.replace(/\n$/, '') + '\n```')
    .join('\n\n')
}

async function embed(x, meta) {
  const m = d.media[x.media]
  if (!m) return ''
  let out
  if (/youtube\.com|youtu\.be/.test(m.domain + m.href)) {
    const id = ytId(m.href)
    meta.video ||= id
    out = video(id, m.title)
  } else if (m.domain === 'vimeo.com') {
    out = `<div class="embed video"><iframe src="https://player.vimeo.com/video/${m.href.match(/(\d+)/)[1]}" title="${attr(m.title)}" loading="lazy" allowfullscreen></iframe></div>`
  } else if (m.domain === 'twitter.com') {
    out = `<blockquote class="tweet"><p>${attr(m.description)}</p><a href="${m.href}">@dashersw on X</a></blockquote>`
  } else if (m.domain === 'www.slideshare.net') {
    const src = new URL(m.iframeSrc).searchParams.get('src')
    meta.slides ||= m.href
    out = `<div class="embed slides"><iframe src="${attr(src)}" title="${attr(m.title)}" loading="lazy" allowfullscreen></iframe></div>`
  } else if (m.domain === 'gist.github.com') {
    out = await gist(m.href)
  } else {
    out = `<a class="linkcard" href="${m.href}"><strong>${attr(m.title)}</strong><em>${m.domain}</em></a>`
  }
  if (x.x) out += `\n\n<p class="caption">${attr(x.x)}</p>`
  return out
}

function linkcard(x, meta) {
  const link = (x.m || []).find(m => m.t === 3)
  const href = mapHref(x.mix?.href || link?.h || '')
  const b = (x.m || []).find(m => m.t === 1)
  const i = (x.m || []).find(m => m.t === 2)
  const title = b ? x.x.slice(b.s, b.e) : x.x.split('\n')[0]
  const desc = i ? x.x.slice(i.s, i.e) : ''
  let domain = ''
  try {
    domain = new URL(href, 'https://arm.ag').hostname.replace(/^www\./, '')
  } catch {}
  if (/slides\.com|slideshare/.test(domain)) meta.slides ||= href
  if (domain === 'github.com') (meta.code ||= []).push(href)
  return `<a class="linkcard" href="${attr(href)}"><strong>${attr(title.trim())}</strong>${desc ? `<span>${attr(desc.trim())}</span>` : ''}<em>${domain}</em></a>`
}

const img = id => `../../assets/medium/${id.replace(/\*/g, '-')}`
const codeLang = s =>
  /^\s*(\$ |npm |docker |git |curl |brew |cd )/m.test(s) ? 'bash' : /^\s*[{[]/.test(s) && /"\s*:/.test(s) ? 'json' : /<\/?[a-z][^>]*>/.test(s) && !/=>|function|const /.test(s) ? 'html' : /[;{}=()]/.test(s) ? 'js' : 'text'

async function body(paras, meta) {
  const blocks = []
  for (let i = 0; i < paras.length; i++) {
    const x = paras[i]
    const t = inline(x.x, x.m)
    if (x.t === 1) blocks.push(t)
    else if (x.t === 2 || x.t === 3) blocks.push('## ' + t)
    else if (x.t === 13) blocks.push('### ' + t)
    else if (x.t === 4) {
      if (!x.img?.id) continue
      blocks.push(x.x ? `<figure>\n\n![${attr(x.x)}](${img(x.img.id)})\n\n<figcaption>\n\n${t}\n\n</figcaption>\n</figure>` : `![](${img(x.img.id)})`)
    } else if (x.t === 6) blocks.push('> ' + t)
    else if (x.t === 7) blocks.push(`<blockquote class="pull">\n\n${t}\n\n</blockquote>`)
    else if (x.t === 8) blocks.push('```' + codeLang(x.x) + '\n' + x.x + '\n```')
    else if (x.t === 9 || x.t === 10) {
      const items = []
      while (i < paras.length && paras[i].t === x.t) {
        items.push((x.t === 9 ? '- ' : `${items.length + 1}. `) + inline(paras[i].x, paras[i].m))
        i++
      }
      i--
      blocks.push(items.join('\n'))
    } else if (x.t === 11) blocks.push(await embed(x, meta))
    else if (x.t === 14) blocks.push(linkcard(x, meta))
    else throw new Error('unknown paragraph type ' + x.t)
  }
  return blocks.filter(Boolean).join('\n\n') + '\n'
}

const fm = o =>
  '---\n' +
  Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length))
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n') +
  '\n---\n\n'

// ---- write ---------------------------------------------------------------------------------------------------
const redirects = { '/biography-7be4447a66cb': '/about/', '/talks-81de1f7d360a': '/talks/', '/talks/home': '/talks/' }
for (const { p, kind, file, ev } of plan) {
  const paras = [...p.paras]
  const meta = {}
  // Strip the title, the subtitle that follows it and the leading cover image; they live in frontmatter.
  let cover
  const ti = paras.findIndex((x, i) => i < 4 && (x.t === 3 || x.t === 2) && x.x.trim() === p.title.trim())
  let subtitle
  if (ti >= 0) {
    if (paras[ti + 1]?.t === 13) subtitle = paras.splice(ti + 1, 1)[0].x
    paras.splice(ti, 1)
  }
  if (paras[0]?.t === 4 && paras[0].img?.id && !paras[0].x) cover = paras.shift().img.id
  cover ||= kind === 'talk' ? p.preview : undefined
  let md = await body(paras, meta)
  if (extraVideo[p.id] && !meta.video) {
    meta.video = extraVideo[p.id]
    md += `\n## Video\n\n${video(meta.video, p.title)}\n`
  }
  const base = { title: p.title }
  let front
  if (kind === 'talk')
    front = { ...base, event: ev.event, date: ev.date, lang: p.lang, kind: 'talk', cover: cover && img(cover), video: meta.video, slides: meta.slides, code: meta.code && [...new Set(meta.code)] }
  else if (kind === 'article')
    front = { ...base, description: subtitle || p.subtitle, date: iso(p.first), lang: p.lang, cover: cover && img(cover), tags: p.tags.filter(t => t !== 'articles') }
  else if (kind === 'project') front = { ...base, tagline: subtitle || p.subtitle, cover: cover && img(cover), ...projectMeta[p.id], slug: undefined }
  else front = { ...base }
  const out = path.join(root, 'src/content', file)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, fm(front) + md)
  redirects['/' + p.uniqueSlug] = urlOf[p.id]
}
fs.mkdirSync(path.join(root, 'src/data'), { recursive: true })
fs.writeFileSync(path.join(root, 'src/data/redirects.json'), JSON.stringify(redirects, null, 1) + '\n')
console.log(plan.reduce((a, x) => ((a[x.kind] = (a[x.kind] || 0) + 1), a), {}))
