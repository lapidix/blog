import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from '../seo'

export const metadata = genPageMetadata({
  title: 'Privacy',
  description: `${siteMetadata.title}가 수집하는 데이터와 사용하는 third-party 서비스에 대한 안내.`,
  slug: 'privacy',
})

// 내용을 실제로 수정했을 때만 손으로 갱신한다. 빌드 시각을 쓰면 매 배포마다 바뀐다.
const LAST_UPDATED = '2026년 8월 30일'

export default function Privacy() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Privacy
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          최종 수정: {LAST_UPDATED}
        </p>
      </div>

      <div className="prose max-w-none pb-8 pt-8 dark:prose-invert">
        <h2>요약</h2>
        <p>
          {siteMetadata.title}는 {siteMetadata.author}가 운영하는 개인 기술 블로그입니다. 회원가입,
          로그인, 결제가 없으며 이름·이메일·전화번호 같은 개인정보를 직접 수집하지 않습니다. 아래에
          적힌 것은 방문 통계와 오류 추적을 위해 사용하는 third-party 서비스, 그리고 그 과정에서
          브라우저에 저장되는 값들입니다.
        </p>

        <h2>직접 수집하는 정보</h2>
        <p>없습니다. 이 사이트에는 가입 절차도, 문의 폼도, 뉴스레터 구독 폼도 없습니다.</p>

        <h2>사용하는 third-party 서비스</h2>
        <h3>Google Analytics</h3>
        <p>
          어떤 글이 얼마나 읽히는지 파악하기 위해 사용합니다. IP 익명화(<code>anonymize_ip</code>)
          옵션을 켜 둔 상태이며, 페이지 경로·리퍼러·브라우저 종류 같은 집계용 데이터를 Google이
          쿠키를 통해 수집합니다. 수집된 데이터는 Google의 개인정보처리방침을 따릅니다.
        </p>

        <h3>Vercel Analytics</h3>
        <p>
          페이지 조회수와 Web Vitals 성능 지표를 측정합니다. Vercel Analytics는 쿠키를 사용하지 않고
          개인을 식별하지 않는 방식으로 집계합니다.
        </p>

        <h3>Sentry</h3>
        <p>
          사이트에서 발생한 자바스크립트 오류를 추적하기 위해 사용합니다. 오류가 발생하면 스택
          트레이스와 브라우저 환경 정보가 Sentry로 전송됩니다. 같은 방문자가 겪은 오류를 하나로 묶기
          위해 브라우저 <code>localStorage</code>에 <code>sentry_user_id</code>라는 키로 무작위
          UUID를 저장합니다. 이 값은 무작위로 생성된 것이며 실제 신원과 연결되지 않습니다.
        </p>

        <h3>giscus (댓글)</h3>
        <p>
          글 하단의 댓글은 GitHub Discussions를 사용하는 giscus로 동작합니다. 댓글을 남기려면 GitHub
          계정으로 로그인해야 하며, 이때 입력한 내용과 계정 정보는 GitHub에 저장됩니다. 댓글을
          읽기만 한다면 로그인은 필요하지 않습니다.
        </p>

        <h2>쿠키와 로컬 저장소</h2>
        <ul>
          <li>
            <strong>조회수 중복 방지 쿠키</strong> — 글을 열면 <code>viewed_&lt;slug&gt;</code>{' '}
            형태의 쿠키가 1시간 동안 저장됩니다. 같은 사람이 새로고침할 때 조회수가 중복으로
            올라가는 것을 막기 위한 용도이며, <code>httpOnly</code> 속성이 걸려 있어 자바스크립트로
            읽을 수 없습니다. 개인을 식별하는 값은 담기지 않습니다.
          </li>
          <li>
            <strong>Google Analytics 쿠키</strong> — 방문 집계를 위해 Google이 설정합니다.
          </li>
          <li>
            <strong>테마 설정</strong> — 라이트/다크 모드 선택이 브라우저 로컬 저장소에 기록됩니다.
          </li>
          <li>
            <strong>Sentry 식별자</strong> — 위에 설명한 무작위 UUID입니다.
          </li>
        </ul>

        <h2>수집한 데이터의 사용 범위</h2>
        <p>
          집계된 통계는 어떤 주제의 글을 더 쓸지 판단하고 사이트의 오류를 고치는 데에만 사용합니다.
          어떤 데이터도 판매하거나 제3자에게 제공하지 않으며, 광고 네트워크를 연동하고 있지
          않습니다.
        </p>

        <h2>AI 크롤러에 대한 정책</h2>
        <p>
          검색 결과와 AI 답변에서 이 사이트가 출처로 인용되는 것은 허용합니다. 반면 모델 학습 데이터
          수집을 목적으로 하는 크롤러는 <a href="/robots.txt">robots.txt</a>에서 차단하고 있습니다.
          에이전트가 이 사이트의 내용을 구조적으로 읽을 수 있도록 <a href="/llms.txt">llms.txt</a>를
          제공합니다.
        </p>

        <h2>문의</h2>
        <p>
          이 문서나 데이터 처리 방식에 대해 궁금한 점이 있으면{' '}
          <a href={`mailto:${siteMetadata.email}`}>{siteMetadata.email}</a>로 연락 주세요. 저장된
          데이터의 삭제를 원하시는 경우에도 같은 주소로 요청하실 수 있습니다.
        </p>
      </div>
    </div>
  )
}
