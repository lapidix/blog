import NavigationButton from '@/components/common/molecules/NavigationButton'
import { Authors, Blog, Retrospection } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer.js'
import { RoughNotation } from 'react-rough-notation'
import MainPostCard from '../organisms/MainPostCard'
const MAX_DISPLAY = 4
const LatestPostContainer = ({
  posts,
  author,
}: {
  posts: CoreContent<Blog | Retrospection>[]
  author: Authors
}) => {
  return (
    <div className="flex flex-col items-start justify-start pr-6 xl:border-r xl:border-gray-200 dark:xl:border-gray-700 px-2">
      <div className="space-y-2 py-4 px-2 md:space-y-5">
        {/* sm 이하에서는 일반 h1 */}
        <h1 className="block md:hidden text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10">
          Latest Posts
        </h1>

        {/* md 이상에서는 RoughNotation 적용 */}
        <div className="hidden md:inline-block ">
          <RoughNotation type="underline" show color="#1d4ed8">
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
              Latest Posts
            </h1>
          </RoughNotation>
        </div>
      </div>

      <ul
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 pt-2 xl:mt-2 min-h-[300px] sm:min-h-[350px]"
        aria-label="latest-posts"
        style={{ containIntrinsicSize: '0 500px' }}
      >
        {!posts.length && 'No posts found.'}
        {posts.map((post, index) => {
          const { slug } = post

          if (index >= 4) return null // 최대 4개까지만

          // 4번째 포스트(index 3)는 xl에서만 숨김
          const className = index === 4 ? 'hidden xl:hidden lg:block md:block sm:block' : ''

          return (
            <li key={slug} className={className}>
              <MainPostCard post={post} author={author} />
            </li>
          )
        })}
      </ul>
      <div className="w-full xl:hidden">
        {posts.length > MAX_DISPLAY && (
          <div className="flex justify-end text-base font-medium leading-6">
            <NavigationButton
              title="All Posts"
              href="/posts"
              color="primary"
              isArrow={true}
              buttonClassName="mt-4"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default LatestPostContainer
