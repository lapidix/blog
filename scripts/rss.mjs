import { mkdirSync, writeFileSync } from 'fs'
import GithubSlugger from 'github-slugger'
import path from 'path'
import { sortPosts } from 'pliny/utils/contentlayer.js'
import { escape } from 'pliny/utils/htmlEscaper.js'
import { allBlogs, allReflections } from '../.contentlayer/generated/index.mjs'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import siteMetadata from '../data/siteMetadata.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const tagDataPath = join(__dirname, '../app/tag-data.json')
let tagData = {}
try {
  tagData = JSON.parse(readFileSync(tagDataPath, 'utf8'))
} catch (error) {
  console.warn(`Warning: Could not read tag data from ${tagDataPath}`)
  console.warn(error)
  tagData = {}
}

const generateRssItem = (config, post) => {
  const isReflection = post.type === 'Reflection'
  const urlPath = isReflection ? 'reflections' : 'posts'

  return `
  <item>
    <guid>${config.siteUrl}/${urlPath}/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/${urlPath}/${post.slug}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`
}

const generateRss = (config, posts, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${posts.length > 0 ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

async function generateRSS(config, allBlogs, page = 'feed.xml') {
  const publishPosts = allBlogs.filter((post) => post.draft !== true)

  if (publishPosts.length > 0) {
    const rss = generateRss(config, sortPosts(publishPosts))
    writeFileSync(`./public/${page}`, rss)
  }

  // Only process tags if we have tag data and posts
  if (publishPosts.length > 0 && Object.keys(tagData).length > 0) {
    for (const tag of Object.keys(tagData)) {
      const filteredPosts = allBlogs.filter(
        (post) => post.tags && post.tags.map((t) => GithubSlugger.slug(t)).includes(tag)
      )
      if (filteredPosts.length > 0) {
        const rss = generateRss(config, filteredPosts, `tags/${tag}/${page}`)
        const rssPath = path.join('public', 'tags', tag)
        mkdirSync(rssPath, { recursive: true })
        writeFileSync(path.join(rssPath, page), rss)
      }
    }
  }
}

const rss = () => {
  generateRSS(siteMetadata, allBlogs)

  if (typeof allReflections !== 'undefined' && allReflections.length > 0) {
    const reflectionsWithType = allReflections.map((reflection) => ({
      ...reflection,
      type: 'Reflection',
    }))
    generateRSS(siteMetadata, reflectionsWithType, 'reflections-feed.xml')
  }

  console.log('RSS feeds generated...')
}

export default rss
