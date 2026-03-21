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
    <div className="flex flex-col items-start justify-start px-2">
      <div className="space-y-2 py-4 px-2 md:space-y-5">
        {/* sm 이하에서는 일반 h1 */}
        <h1 className="block md:hidden text-3xl font-extrabold  tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl sm:leading-10">
          Latest Articles
        </h1>

        {/* md 이상에서는 RoughNotation 적용 */}
        <div className="hidden md:inline-block ">
          <RoughNotation type="underline" show color="#059669">
            <h1 className="text-3xl font-extrabold  tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
              Latest Articles
            </h1>
          </RoughNotation>
        </div>
      </div>

      <ul
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pt-2 xl:mt-2"
        aria-label="latest-articles"
      >
        {!posts.length && 'No posts found.'}
        {posts.slice(0, 3).map((post, index) => (
          <li key={post.slug} className={index === 2 ? 'sm:hidden xl:list-item' : undefined}>
            <MainPostCard post={post} author={author} />
          </li>
        ))}
      </ul>
      <div className="w-full xl:hidden">
        {posts.length > MAX_DISPLAY && (
          <div className="flex justify-end text-base font-medium leading-6">
            <NavigationButton
              title="All Articles"
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
