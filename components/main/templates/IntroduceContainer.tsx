import { Authors, Blog, Retrospection } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer.js'
import Terminal from '../organisms/Terminal'

interface PostWithViews extends CoreContent<Blog | Retrospection> {
  views: number
}

interface IntroduceContainerProps {
  posts: CoreContent<Blog | Retrospection>[]
  trendingPosts: PostWithViews[]
  author: Authors
  tags: string[]
}

const IntroduceContainer = ({ posts, trendingPosts, author, tags }: IntroduceContainerProps) => {
  return (
    <div className="w-auto border-b border-zinc-600 dark:border-zinc-200">
      <Terminal posts={posts} trendingPosts={trendingPosts} author={author} tags={tags} />
    </div>
  )
}

export default IntroduceContainer
