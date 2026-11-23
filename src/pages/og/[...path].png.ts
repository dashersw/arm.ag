import type { APIRoute, GetStaticPaths } from 'astro'
import portrait from '../../assets/portrait.png'
import { allArticles, allProjects, allTalks, fmtDate, kindLabel } from '../../lib/site'
import { renderOg, type OgCard } from '../../lib/og'

const abstract = (body = '') =>
  body
    .split('\n')
    .find(l => l && !l.startsWith('<') && !l.startsWith('#'))
    ?.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_]/g, '')

export const getStaticPaths: GetStaticPaths = async () => {
  const [talks, articles, projects] = await Promise.all([allTalks(), allArticles(), allProjects()])
  const stage = talks.filter(t => t.data.kind === 'talk').length
  const page = (path: string, card: OgCard) => ({ params: { path }, props: { card } })
  return [
    page('index', { title: 'I design software systems, build the tools they need, and teach people the craft.', label: 'Software architect', detail: 'Berlin', image: portrait, round: true }),
    page('about', { title: 'About', label: 'Biography', detail: 'Software architect, founder, teacher', image: portrait, round: true }),
    page('talks', { title: 'Talks', label: `${stage} talks`, detail: 'Since 2013', text: 'Every conference talk, workshop and interview, with slides and video. Distributed systems, JavaScript, engineering teams and AI reasoning.' }),
    page('articles', { title: 'Articles', label: `${articles.length} articles`, detail: 'Essays', text: 'Longer pieces on software craftsmanship, architecture, microservices, AI and building a career in engineering.' }),
    page('projects', { title: 'Projects', label: 'Open source', detail: 'Since 1999', text: 'Gea Stack, Gea, cote, liquid-glass-js, pedalboard.js, brain-bits and the rest of what I have published.' }),
    page('coyotiv', { title: 'Coyotiv', label: 'Company', detail: 'Berlin · Founded April 2020', text: 'The software company and engineering school I founded. We build software for clients, ship our own products and train engineers.' }),
    page('mentoring', { title: 'Mentoring', label: 'Work with me', detail: 'One-to-one', text: 'Mentoring for engineers, engineering managers and founders, as ongoing sessions or a single call.' }),
    page('contact', { title: 'Contact', label: 'Get in touch', detail: 'hello@arm.ag', text: 'Speaking invitations, mentoring, consulting, or a question about something I built.' }),
    page('academics', { title: 'Academic work', label: 'Research', detail: 'Sabancı University', text: 'Research on P300-based brain-computer interfaces: typing with brain signals, and the publications that came out of it.' }),
    page('turkce', { title: 'Türkçe', label: 'Türkçe', detail: 'arm.ag/turkce', text: 'Türkçe yaptığım konuşmalar, katıldığım söyleşiler ve yazdığım yazılar.' }),
    ...talks.map(t => page(`talks/${t.id}`, { title: t.data.title, label: kindLabel[t.data.kind], detail: `${t.data.event} · ${fmtDate(t.data.date, t.data.lang)}`, image: t.data.cover, text: abstract(t.body) })),
    ...articles.map(a => page(`articles/${a.id}`, { title: a.data.title, label: 'Article', detail: fmtDate(a.data.date, a.data.lang), image: a.data.cover, text: a.data.description })),
    ...projects.map(p => page(`projects/${p.id}`, { title: p.data.title, label: 'Open source', detail: `Since ${p.data.year}${p.data.stars ? ` · ${p.data.stars} stars` : ''}`, image: p.data.cover, text: p.data.tagline })),
  ]
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await renderOg(props.card as OgCard), { headers: { 'content-type': 'image/png' } })
