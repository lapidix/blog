import { readFileSync, writeFileSync } from 'fs'
import GithubSlugger from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import siteMetadata from '../data/siteMetadata.js'

const isProduction = process.env.NODE_ENV === 'production'

const allBlogs = JSON.parse(readFileSync('./.contentlayer/generated/Blog/_index.json', 'utf-8'))
const allReflections = JSON.parse(
  readFileSync('./.contentlayer/generated/Reflection/_index.json', 'utf-8')
)

const tagCount = {}
const allDocuments = [...allBlogs, ...allReflections]

allDocuments.forEach((file) => {
  if (file.tags && (!isProduction || file.draft !== true)) {
    file.tags.forEach((tag) => {
      const formattedTag = GithubSlugger.slug(tag)
      if (formattedTag in tagCount) {
        tagCount[formattedTag] += 1
      } else {
        tagCount[formattedTag] = 1
      }
    })
  }
})

writeFileSync('./app/tag-data.json', JSON.stringify(tagCount))
console.log('Tag count generated...')

if (
  siteMetadata?.search?.provider === 'kbar' &&
  siteMetadata.search.kbarConfig.searchDocumentsPath
) {
  writeFileSync(
    `public/${siteMetadata.search.kbarConfig.searchDocumentsPath}`,
    JSON.stringify(allCoreContent(sortPosts(allDocuments)))
  )
  console.log('Local search index generated...')
}
