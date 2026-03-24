import { ctm } from 'app/utils/style'
import { slug } from 'github-slugger'
import Link from 'next/link'
interface Props {
  text: string
  count?: number
  className?: string
}

const Tag = ({ text, count, className }: Props) => {
  return (
    <Link href={`/tags/${slug(text)}`} className={ctm(' text-sm font-medium uppercase', className)}>
      <div className="inline-block relative py-1 text-xs group">
        <div className="absolute inset-0 text-primary-500 dark:text-primary-700 group-hover:text-primary-600 dark:group-hover:text-primary-500 flex">
          <svg height="100%" viewBox="0 0 50 100">
            <path
              d="M49.9,0a17.1,17.1,0,0,0-12,5L5,37.9A17,17,0,0,0,5,62L37.9,94.9a17.1,17.1,0,0,0,12,5ZM25.4,59.4a9.5,9.5,0,1,1,9.5-9.5A9.5,9.5,0,0,1,25.4,59.4Z"
              fill="currentColor"
            />
          </svg>
          <div className="flex-grow h-full -ml-px dark:bg-primary-700 bg-primary-500 group-hover:bg-primary-600 dark:group-hover:bg-primary-500 rounded-md rounded-l-none"></div>
        </div>
        <span className="relative text-white uppercase font-semibold pr-px">
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          {text.split(' ').join('-')}
          <span>&nbsp;</span>
          {count && `[ ${count} ]`}
          <span>&nbsp;</span>
        </span>
      </div>
    </Link>
  )
}

export default Tag
