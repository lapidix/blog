import { writeFileSync } from 'fs'
import GithubSlugger from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import siteMetadata from '../data/siteMetadata.js'

// JSON import를 동적으로 처리
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function generateData() {
  try {
    // contentlayer 생성된 데이터 동적 import
    const { allBlogs, allReflections } = await import('../.contentlayer/generated/index.mjs')

    // Tag count 생성
    const tagCount = {}
    const isProduction = process.env.NODE_ENV === 'production'

    const allDocs = [...allBlogs, ...allReflections]
    allDocs.forEach((file) => {
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
    console.log('Tag data generated...')

    // Search index 생성
    if (
      siteMetadata?.search?.provider === 'kbar' &&
      siteMetadata.search.kbarConfig.searchDocumentsPath
    ) {
      writeFileSync(
        `public/${siteMetadata.search.kbarConfig.searchDocumentsPath}`,
        JSON.stringify(allCoreContent(sortPosts(allDocs)))
      )
      console.log('Local search index generated...')
    }
  } catch (error) {
    console.error('Error generating data:', error)
  }
}

generateData()
