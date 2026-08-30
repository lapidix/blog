import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from '../seo'

export const metadata = genPageMetadata({
  title: 'Contact',
  description: `${siteMetadata.author}에게 연락하는 방법 — 이메일, GitHub, LinkedIn, X.`,
  slug: 'contact',
})

const CHANNELS = [
  {
    label: 'Email',
    value: siteMetadata.email,
    href: `mailto:${siteMetadata.email}`,
    description: '가장 확실한 경로입니다. 글 관련 문의, 정정 요청, 협업 제안 모두 환영합니다.',
  },
  {
    label: 'GitHub',
    value: siteMetadata.github,
    href: siteMetadata.github,
    description: '작성한 오픈소스와 이 블로그의 소스 코드를 볼 수 있습니다.',
  },
  {
    label: 'LinkedIn',
    value: siteMetadata.linkedin,
    href: siteMetadata.linkedin,
    description: '경력과 이력에 대한 문의는 이쪽이 편합니다.',
  },
  {
    label: 'X',
    value: siteMetadata.twitter,
    href: siteMetadata.twitter,
    description: '짧은 질문이나 가벼운 대화를 나눕니다.',
  },
]

export default function Contact() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Contact
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          {siteMetadata.author}에게 연락하는 방법
        </p>
      </div>

      <div className="prose max-w-none pb-8 pt-8 dark:prose-invert">
        <p>
          이 블로그는 {siteMetadata.author}가 개인적으로 운영하는 기술 블로그입니다. 회사나 조직이
          아닌 개인이 쓰고 관리하며, 광고나 유료 구독 없이 누구나 무료로 읽을 수 있습니다.
        </p>

        <h2>이런 연락을 환영합니다</h2>
        <ul>
          <li>
            글의 내용에 사실 관계 오류가 있거나 더 나은 접근 방법을 알고 계신 경우. 정정과 반박은
            언제나 환영합니다.
          </li>
          <li>
            Cosmos SDK, CometBFT, IBC, 프론트엔드 아키텍처, 모노레포 빌드 도구 등 다루는 주제에 대한
            질문과 토론.
          </li>
          <li>글 인용, 번역, 재게시에 대한 문의.</li>
          <li>채용 제안이나 협업 제안.</li>
        </ul>

        <h2>답변에 대해</h2>
        <p>
          본업이 있는 상태로 개인 시간에 운영하기 때문에 답변까지 며칠이 걸릴 수 있습니다. 급한
          사안이라면 메일 제목에 그 점을 적어 주세요. 개별 코드에 대한 무료 디버깅 요청이나 과제
          대행 요청에는 답하지 않습니다.
        </p>

        <h2>연락 채널</h2>
        <dl>
          {CHANNELS.map(({ label, value, href, description }) => (
            <div key={label}>
              <dt>
                <strong>{label}</strong>{' '}
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {value}
                </a>
              </dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>

        <p>
          블로그 자체의 버그(깨진 링크, 잘못된 렌더링 등)는{' '}
          <a href={`${siteMetadata.siteRepo}/issues`} target="_blank" rel="noopener noreferrer">
            GitHub 이슈
          </a>
          로 알려 주시면 가장 빠르게 확인합니다.
        </p>
      </div>
    </div>
  )
}
