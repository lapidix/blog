import React from 'react'

export type TocHeading = {
  value: string
  depth: number
  url: string
}

type CustomTOCProps = {
  toc: string | TocHeading[]
  exclude?: string | string[]
  maxDepth?: number
}

const CustomTOC: React.FC<CustomTOCProps> = ({ toc, exclude = '', maxDepth = 3 }) => {
  let tocItems: TocHeading[] = []
  if (typeof toc === 'string') {
    try {
      tocItems = JSON.parse(toc)
    } catch (e) {
      console.error('Failed to parse TOC:', e)
      return null
    }
  } else {
    tocItems = toc
  }

  const excludeArray = Array.isArray(exclude) ? exclude : [exclude]
  const filteredToc = tocItems.filter((heading) => {
    return !excludeArray.includes(heading.value) && heading.depth <= maxDepth
  })

  if (filteredToc.length === 0) {
    return null
  }

  return (
    <div className="toc-container">
      <h2 className="text-xs font-bold pb-2 uppercase tracking-wider text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
        On This Page
      </h2>
      <ul className="pt-2 space-y-1 text-sm">
        {filteredToc.map((heading) => (
          <li
            key={`${heading.url}-${heading.value}`}
            className={`toc-item ${heading.depth === 1 ? 'font-medium' : 'font-normal'}`}
            style={{ paddingLeft: `${(heading.depth - 1) * 0.75}rem` }}
          >
            <a
              href={heading.url}
              className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors text-sm"
            >
              {heading.value}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default CustomTOC
