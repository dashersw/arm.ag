import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const md = (dir: string) => glob({ pattern: '*.md', base: `./src/content/${dir}` })

const talks = defineCollection({
  loader: md('talks'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      event: z.string(),
      date: z.coerce.date(),
      lang: z.enum(['en', 'tr']).default('en'),
      // talk: on a stage or at a meetup. workshop: a teaching session. conversation: interview, podcast, panel.
      kind: z.enum(['talk', 'workshop', 'conversation']).default('talk'),
      cover: image().optional(),
      video: z.string().optional(),
      slides: z.string().optional(),
      code: z.array(z.string()).optional(),
    }),
})

const articles = defineCollection({
  loader: md('articles'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      lang: z.enum(['en', 'tr']).default('en'),
      cover: image().optional(),
      tags: z.array(z.string()).default([]),
    }),
})

const projects = defineCollection({
  loader: md('projects'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tagline: z.string(),
      repo: z.string().optional(),
      url: z.string().optional(),
      year: z.number(),
      stars: z.string().optional(),
      order: z.number(),
      cover: image().optional(),
    }),
})

const pages = defineCollection({ loader: md('pages'), schema: z.object({ title: z.string() }) })

export const collections = { talks, articles, projects, pages }
