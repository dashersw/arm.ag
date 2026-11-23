import { getCollection, type CollectionEntry } from 'astro:content'

export type Talk = CollectionEntry<'talks'>

export const fmtDate = (d: Date, lang = 'en') =>
  d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
export const isoDate = (d: Date) => d.toISOString().slice(0, 10)
export const kindLabel = { talk: 'Talk', workshop: 'Workshop', conversation: 'Conversation' } as const

export const allTalks = async () => (await getCollection('talks')).sort((a, b) => +b.data.date - +a.data.date)
export const allArticles = async () => (await getCollection('articles')).sort((a, b) => +b.data.date - +a.data.date)
export const allProjects = async () => (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order)
