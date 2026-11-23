// Converts x-export/articles.txt (articles exported from x.com/dashersw/articles) into src/content/articles/*.md.
// Run: node scripts/import-x.mjs   (overwrites the six imported files)
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const root = path.resolve(import.meta.dirname, '..')
const raw = fs.readFileSync(path.join(root, 'x-export/articles.txt'), 'utf8')
const assets = path.join(root, 'src/assets/x')
fs.mkdirSync(assets, { recursive: true })

const meta = {
  '2034358153601835381': { slug: 'introducing-gea', tags: ['javascript', 'gea', 'open-source'] },
  '1997479210328203356': { slug: 'limitless-ai-is-everything-wrong-with-the-startup-ecosystem', tags: ['startups', 'privacy'] },
  '1981770147905122413': { slug: 'when-a-cache-learned-to-speak-mongoose', tags: ['javascript', 'databases', 'open-source'] },
  '1952079140636774633': { slug: 'the-em-dash-fallacy', tags: ['writing', 'ai'] },
  '1947385572626206984': { slug: 'the-path-to-agi-is-a-network-not-a-monolith', tags: ['ai', 'multi-agent-systems'] },
  '2078870000610185316': { slug: 'graph-engineering-and-the-future-of-autonomous-work', tags: ['ai', 'agents', 'openserv'] },
}

const code = {
  'class Counter extends Component': `class Counter extends Component {
  count = 0

  increment() { this.count++ }
  decrement() { this.count-- }

  template() {
    return (
      <div class="counter">
        <span>{this.count}</span>
        <button click={this.increment}>+</button>
        <button click={this.decrement}>-</button>
      </div>
    )
  }
}`,
  'class CounterStore extends Store': `class CounterStore extends Store {
  count = 0

  increment() { this.count++ }
  decrement() { this.count-- }
}`,
}

const fetchImage = url => {
  const id = url.match(/media\/([\w-]+)/)[1]
  const file = path.join(assets, `${id}.jpg`)
  if (!fs.existsSync(file)) execFileSync('curl', ['-sfL', '-o', file, url.replace(/name=\w+/, 'name=large')])
  return `../../assets/x/${id}.jpg`
}
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

for (const part of raw.split('@@@@ARTICLE\n').filter(Boolean)) {
  const [head, body] = part.split('\n=====\n')
  const get = k => head.match(new RegExp(`^${k}: (.*)$`, 'm'))[1]
  const url = get('URL')
  const id = url.match(/status\/(\d+)/)[1]
  const { slug, tags } = meta[id]
  const date = new Date(Number((BigInt(id) >> 22n) + 1288834974657n)).toISOString().slice(0, 10)
  const cover = get('COVER') !== 'undefined' ? fetchImage(get('COVER')) : undefined

  const blocks = body.trim().split(/\n\n(?!\s)/)
  const out = []
  for (let i = 0; i < blocks.length; i++) {
    let b = blocks[i]
    if (b.startsWith('```')) {
      const key = Object.keys(code).find(k => b.includes(k))
      out.push(key ? '```jsx\n' + code[key] + '\n```' : b)
      continue
    }
    if (b === '---') continue
    let m
    if ((m = b.match(/^!\[IMG\]\((https:[^)]+)\)$/))) {
      const next = blocks[i + 1] || ''
      const alt = /^js-framework-benchmark results/.test(next) ? (i++, next) : ''
      out.push(`![${alt}](${fetchImage(m[1])})`)
      continue
    }
    if ((m = b.match(/^\[TWEET\]\((\S+)\) (\S+) @(\w+) · (.*)$/s))) {
      const text = m[4].replace(/^\w+ \d+ /, '').replace(/ From \S+ [\d.K ]+$/, '').trim()
      out.push(`<a class="linkcard" href="${m[1]}"><strong>${esc(m[2])} on X</strong><span>${esc(text)}…</span><em>x.com/${m[3]}</em></a>`)
      continue
    }
    if (blocks[i - 1] === '---' && (m = b.match(/^\*\*([^*]+)\*\*$/))) b = `## ${m[1]}`
    b = b
      .replace(/^### /, '## ')
      .replace(/\[\*?(\$\w+)\*?\]\(https:\/\/x\.com\/search[^)]*\)/g, '`$1`')
      .replace(/\(https:\/\/x\.com\/@/g, '(https://x.com/')
      .replace(/\*\*an\*\* \*\*\*almost\*\*\* \*\*drop-in/, '**an *almost* drop-in')
      .replace(/Assurance: P\*\*rovi/, 'Assurance:** Provi')
    out.push(b)
  }
  // list items come one per block; join neighbours
  const md = out.join('\n\n').replace(/^((?:- |\d+\. ).*)\n\n(?=(?:- |\d+\. ))/gm, '$1\n')
  const first = out.find(b => !/^(#|!|<|```|- )/.test(b)).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*`]/g, '')
  const description = first.length > 180 ? first.slice(0, first.lastIndexOf(' ', 177)) + '…' : first
  const front = { title: get('TITLE').replace(/\.$/, ''), description, date, lang: 'en', cover, tags }
  const fm = Object.entries(front).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n')
  fs.writeFileSync(path.join(root, 'src/content/articles', `${slug}.md`), `---\n${fm}\n---\n\n${md}\n\n*First published [on X](${url}).*\n`)
  console.log(date, slug)
}
