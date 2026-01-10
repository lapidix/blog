import NavigationButton from '@/components/common/molecules/NavigationButton'
import PostListItem from '@/components/main/molecules/PostListItem'
import Tag from '@/components/tags/Tag'
import { Authors, Blog, Retrospection } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer.js'
import { Fragment } from 'react'
import IntroduceContainer from '../templates/IntroduceContainer'
import TrendingPostContainer from '../templates/TrendingPostContainer'

const INTERESTED_TECH_TAGS = ['cosmos-network', 'nodejs', 'nextjs', 'react', 'typescript']
interface PostWithViews extends CoreContent<Blog | Retrospection> {
  views: number
}

export default function MainPage({ posts, author }: { posts: PostWithViews[]; author: Authors }) {
  console.log(posts)
  return (
    <>
      <Fragment>
        <IntroduceContainer />
        <div className="flex flex-row items-start">
          <TrendingPostContainer posts={posts} author={author} />
          <div className="hidden xl:flex flex-col sticky top-0 self-start mt-4 min-w-72 divide-y divide-gray-200 dark:divide-gray-700">
            {/* Interested Tags */}
            <div className="py-6">
              <p className="text-lg pb-3 font-bold px-4">Interested Tags</p>
              <div className="flex flex-wrap gap-2 pt-3 px-4">
                {INTERESTED_TECH_TAGS.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            </div>

            {/* Top Reads */}
            <div className="py-6">
              <p className="text-lg pb-3 font-bold px-4">Top Reads</p>
              <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700 pt-3 px-4">
                {posts.slice(0, 5).map((post, index) => (
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
      </Fragment>

      {/* {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )} */}
    </>
  )
}
