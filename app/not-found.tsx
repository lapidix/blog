import Link from '@/components/common/atoms/Link'
import { NotFoundTracker } from '@/components/not-found/atom/NotFoundTracker'
import { Fragment } from 'react'

// 사람과 에이전트 모두에게 복구 경로가 되는 링크들.
// 에이전트는 404 본문에서 다음에 볼 곳을 찾지 못하면 그대로 탐색을 멈춘다.
// raw 파일 라우트는 next/link 클라이언트 내비게이션 대상이 아니므로 일반 앵커로 렌더한다.
const RECOVERY_LINKS = [
  { href: '/', label: 'Home', description: '메인 페이지', raw: false },
  { href: '/posts', label: 'Articles', description: '전체 기술 글 목록', raw: false },
  { href: '/retrospections', label: 'Retrospections', description: '회고 글 목록', raw: false },
  { href: '/llms.txt', label: 'llms.txt', description: '에이전트용 사이트 색인', raw: true },
  { href: '/sitemap.xml', label: 'sitemap.xml', description: '전체 URL 목록', raw: true },
]

export default function NotFound() {
  return (
    <Fragment>
      <NotFoundTracker />
      <div className="flex flex-col items-start justify-start md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6">
        <div className="space-x-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-6xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:border-r-2 md:px-6 md:text-8xl md:leading-14">
            404
          </h1>
        </div>
        <div className="max-w-md">
          <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">
            Sorry we couldn't find this page.
          </p>
          <p className="mb-6">
            요청하신 페이지가 존재하지 않습니다. 아래 경로에서 원하는 내용을 찾을 수 있습니다.
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Where to go next
          </h2>
          <ul className="mb-8 space-y-1 text-sm">
            {RECOVERY_LINKS.map(({ href, label, description, raw }) => (
              <li key={href}>
                {raw ? (
                  <a href={href} className="font-medium">
                    {label}
                  </a>
                ) : (
                  <Link href={href} className="font-medium">
                    {label}
                  </Link>
                )}
                <span className="text-gray-500 dark:text-gray-400"> — {description}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/"
            className="focus:shadow-outline-blue inline rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium leading-5 text-white shadow transition-colors duration-150 hover:bg-blue-700 focus:outline-none dark:hover:bg-blue-500"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </Fragment>
  )
}
