import { Authors, Blog, Retrospection } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer.js'

import { PostSummaryTextElement } from '@/components/common/atoms/PostTextElement'
import PostThumbnailWrapper from '@/components/common/molecules/PostThumbnailWrapper'
import NavigationButton from '../../common/molecules/NavigationButton'
import PostAuthorSection from '../../common/organisms/PostAuthorSection'
import Tag from '../../tags/Tag'

interface MainPostCardProps {
  post: CoreContent<Blog | Retrospection>
  author: Authors
}

const MainPostCard = ({ post, author }: MainPostCardProps) => {
  const { slug, date, title, summary, tags, images, type } = post
  return (
    <div className="container rounded-xl h-full shadow-md bg-slate-200 dark:bg-slate-700 flex flex-col justify-center items-center p-4">
      <PostThumbnailWrapper
        title={title}
        slug={slug}
        image={Array.isArray(images) ? images[0] : '/static/images/banner.jpeg'}
        className="mb-4 rounded-xl h-72 shadow-md bg-white"
        imageObjectFit="contain"
      />

      <div className="mt-2 w-full lg:mt-0 h-60 md:h-72 flex flex-col items-start justify-start min-h-max overflow-hidden">
        <div className="flex-1 w-full overflow-hidden">
          <NavigationButton
            href={type === 'Blog' ? `/posts/${slug}` : `/retrospections/${slug}`}
            isArrow={false}
            color="slate"
            title={title}
            spanClassName="text-lg font-semibold text-gray-800 dark:text-white md:text-lg md:py-1 leading-6 line-clamp-2 overflow-hidden text-ellipsis"
            buttonClassName="tracking-normal w-full"
          />

          <PostSummaryTextElement summary={summary ?? ''} />
        </div>

        <div className="mt-8 flex flex-wrap-reverse">
          {tags.map((tag) => (
            <Tag className="mr-1 my-1" key={tag} text={tag} />
          ))}
        </div>
        {/* <NavigationButton
          title="Read more"
          href={`/posts/${slug}`}
          isArrow={true}
          color="primary"
          buttonClassName="mt-3"
        /> */}
        <PostAuthorSection author={author} date={date} />
      </div>
    </div>
  )
}

export default MainPostCard
