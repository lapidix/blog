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
      {/* 시각적으로는 숨기되 문서 구조상 페이지 제목 역할을 하는 h1.
          터미널 UI 특성상 화면에 보이는 제목이 없어 헤딩 계층이 h3부터 시작하고 있었다. */}
      <h1 className="sr-only">
        Lapidix Dev — 프론트엔드 아키텍처와 Cosmos 블록체인을 다루는 이민기의 개인 기술 블로그
      </h1>

      {/* Top: Terminal(left) | Top Reads(right) */}
      <div className="flex flex-col xl:flex-row xl:items-stretch gap-0 xl:gap-4 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex-1 min-w-0 flex flex-col pb-6 md:pb-4 ">
          <Terminal
            posts={latestPosts}
            trendingPosts={trendingPosts}
            author={author}
            tags={INTERESTED_TECH_TAGS}
          />
        </div>

        <div className="hidden xl:block xl:w-80 xl:flex-shrink-0 py-2 xl:py-6 px-2 xl:px-4 xl:border-l xl:border-zinc-200 xl:dark:border-zinc-700">
          <RoughNotation type="underline" show color="#059669">
            {/* 기존 span과 동일한 인라인 박스를 유지해야 RoughNotation 밑줄 폭이 그대로다 */}
            <h2 className="inline text-lg font-bold">Top Articles</h2>
          </RoughNotation>
          <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-700 pt-4">
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
