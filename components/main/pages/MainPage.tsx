import { Authors, Blog, Retrospection } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer.js'
import { Fragment } from 'react'
import IntroduceContainer from '../templates/IntroduceContainer'
import TrendingPostContainer from '../templates/TrendingPostContainer'

export default function MainPage({
  posts,
  author,
}: {
  posts: CoreContent<Blog | Retrospection>[]
  author: Authors
}) {
  return (
    <>
      <Fragment>
        <IntroduceContainer />
        <TrendingPostContainer posts={posts} author={author} />
      </Fragment>

      {/* {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )} */}
    </>
  )
}
