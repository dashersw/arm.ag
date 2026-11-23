// Converts linkedin-export/{articles,lists}.txt (articles exported from LinkedIn) into src/content/articles/*.md.
// Run: node scripts/import-linkedin.mjs   (overwrites the four imported files)
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const root = path.resolve(import.meta.dirname, '..')
const read = f => fs.readFileSync(path.join(root, 'linkedin-export', f), 'utf8')
const assets = path.join(root, 'src/assets/linkedin')
fs.mkdirSync(assets, { recursive: true })

const meta = [
  { slug: 'mvp-is-not-version-1-0', tags: ['startups', 'product'] },
  { slug: 'not-every-app-needs-ai', tags: ['ai', 'product'] },
  { slug: 'the-strategic-developer', tags: ['ai', 'career', 'software-development'] },
  { slug: 'what-language-should-i-learn-next-misses-the-point', tags: ['career', 'software-development'] },
]
const lists = read('lists.txt').split(/@@@@DOC \d+\n/).filter(Boolean).map(doc =>
  doc.split(/@@LIST \w+\n/).filter(Boolean).map(l => l.split('@@ITEM ').map(s => s.trim()).filter(Boolean)),
)
const squash = s => s.replace(/\s+/g, '')

read('articles.txt').split('@@@@LI\n').filter(Boolean).forEach((part, n) => {
  const [head, body] = part.split('\n=====\n')
  const get = k => head.match(new RegExp(`^${k}: (.*)$`, 'm'))[1]
  const { slug, tags } = meta[n]
  const date = new Date(get('DATE') + ' UTC').toISOString().slice(0, 10)
  const file = path.join(assets, `${slug}.jpg`)
  if (!fs.existsSync(file)) execFileSync('curl', ['-sfL', '-o', file, get('COVER')])
  const out = []
  for (let b of body.trim().split('\n\n')) {
    if (b.startsWith('![IMG]')) continue
    const list = lists[n].find(l => squash(l.join('')) === squash(b))
    if (list) b = list.map(i => `- ${i.replace(/^(\*\*[^*]+\*\*) (?=[A-Z])/, (m, t) => (/[.?!]\*\*$/.test(t) ? m : `${t.slice(0, -2)}.** `))}`).join('\n')
    out.push(b.replace(/^### /, '## ').replace(/\]\( /g, ']('))
  }
  const first = out.find(b => !/^(#|-|>)/.test(b)).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*`]/g, '')
  const description = first.length > 180 ? first.slice(0, first.lastIndexOf(' ', 177)) + '…' : first
  const front = { title: get('TITLE'), description, date, lang: 'en', cover: `../../assets/linkedin/${slug}.jpg`, tags }
  const fm = Object.entries(front).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n')
  fs.writeFileSync(path.join(root, 'src/content/articles', `${slug}.md`), `---\n${fm}\n---\n\n${out.join('\n\n')}\n\n*First published [on LinkedIn](${get('URL')}).*\n`)
  console.log(date, slug, out.filter(b => b.startsWith('- ')).length, 'lists')
})
