import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context) {
  const articles = (await getCollection('articles')).map(a => ({ title: a.data.title, pubDate: a.data.date, description: a.data.description, link: `/articles/${a.id}/` }))
  const talks = (await getCollection('talks')).map(t => ({ title: `${t.data.title} (${t.data.event})`, pubDate: t.data.date, link: `/talks/${t.id}/` }))
  return rss({
    title: 'Armağan Amcalar',
    description: 'Talks and articles by Armağan Amcalar.',
    site: context.site,
    items: [...articles, ...talks].sort((a, b) => b.pubDate - a.pubDate),
  })
}
