import NavigationButton from '@/components/common/molecules/NavigationButton'
import PostListItem from '@/components/main/molecules/PostListItem'
import Tag from '@/components/tags/Tag'
import { Authors, Blog, Retrospection } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer.js'
import { Fragment } from 'react'
import { RoughNotation } from 'react-rough-notation'
import IntroduceContainer from '../templates/IntroduceContainer'
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
      <IntroduceContainer />
      <div className="flex flex-row items-start">
        <LatestPostContainer posts={latestPosts} author={author} />
        <div className="hidden xl:flex flex-col sticky top-0 self-start mt-4 min-w-72 divide-y divide-gray-200 dark:divide-gray-700">
          {/* Interested Tags */}
          <div className="py-6 px-4">
            <RoughNotation type="underline" show color="#1d4ed8">
              <span className="text-lg font-bold">I Write About</span>
            </RoughNotation>
            <div className="flex flex-wrap gap-2 pt-6">
              {INTERESTED_TECH_TAGS.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          </div>

          {/* Top Reads */}
          <div className="py-6 px-4">
            <RoughNotation type="underline" show color="#1d4ed8">
              <span className="text-lg font-bold">Top Reads</span>
            </RoughNotation>
            <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700 pt-3">
              {trendingPosts.slice(0, 5).map((post, index) => (
                <PostListItem key={post.slug} post={post} author={author} index={index} />
              ))}
            </div>
            <div className="flex justify-end text-base font-medium leading-6">
              <NavigationButton
                title="All Posts"
                href="/posts"
                color="primary"
                isArrow={true}
                buttonClassName="mt-4"
              />
            </div>
          </div>
        </div>
      </div>
      {/* {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )} */}
    </Fragment>
  )
}
