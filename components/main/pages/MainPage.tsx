import NavigationButton from '@/components/common/molecules/NavigationButton'
import PostListItem from '@/components/main/molecules/PostListItem'
import { Authors, Blog, Retrospection } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer.js'
import { Fragment } from 'react'
import { RoughNotation } from 'react-rough-notation'
import Terminal from '../organisms/Terminal'
import LatestPostContainer from '../templates/LatestPostContainer'

const INTERESTED_TECH_TAGS = ['Cosmos', 'Go', 'Frontend', 'Blockchain']
interface PostWithViews extends CoreContent<Blog | Retrospection> {
  views: number
}

export default function MainPage({
  trendingPosts,
  latestPosts,
  author,
}: {
  trendingPosts: PostWithViews[]
  latestPosts: CoreContent<Blog | Retrospection>[]
  author: Authors
}) {
  return (
    <Fragment>
      {/* Top: Terminal(left) | Top Reads(right) */}
      <div className="flex flex-col xl:flex-row xl:items-stretch gap-0 xl:gap-4 border-b border-zinc-400 dark:border-zinc-200">
        <div className="flex-1 min-w-0 flex flex-col pb-6 md:pb-4 ">
          <Terminal
            posts={latestPosts}
            trendingPosts={trendingPosts}
            author={author}
            tags={INTERESTED_TECH_TAGS}
          />
        </div>

        <div className="hidden xl:block xl:w-80 xl:flex-shrink-0 py-2 xl:py-6 px-2 xl:px-4 xl:border-l xl:border-zinc-400 xl:dark:border-zinc-200">
          <RoughNotation type="underline" show color="#059669">
            <span className="text-lg font-bold">Top Articles</span>
          </RoughNotation>
          <div className="flex flex-col divide-y divide-zinc-400 dark:divide-zinc-200 pt-4">
            {trendingPosts.slice(0, 5).map((post, index) => (
              <PostListItem key={post.slug} post={post} author={author} index={index} />
            ))}
          </div>
          <div className="flex justify-end text-base font-medium leading-6">
            <NavigationButton
              title="All Articles"
              href="/posts"
              color="primary"
              isArrow={true}
              buttonClassName="mt-4"
            />
          </div>
        </div>
      </div>

      {/* Bottom: Latest Posts (full width, card grid) */}
      <LatestPostContainer posts={latestPosts} author={author} />
    </Fragment>
  )
}
