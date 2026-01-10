import Tag from '@/components/tags/Tag'
import { RoughNotation } from 'react-rough-notation'

const INTERESTED_TECH_TAGS = ['cosmos']

const IntroduceTextWrapper = () => {
  return (
    <div className="">
      <div className="pl-2 flex text-lg bg-gradient-to-r from-slate-500 to-slate-800 text-transparent bg-clip-text dark:from-gray-200 dark:to-slate-300 mb-2">
        <div className="pr-1">Interested Tech&nbsp;</div>
        <RoughNotation type="box" show color="#1d4ed8">
          Tags
        </RoughNotation>
      </div>
      <div className="h-auto flex flex-col xl:flex-row gap w-full">
        {INTERESTED_TECH_TAGS.map((tag, index) => {
          return (
            <div key={index} className="p-1">
              <Tag text={tag} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default IntroduceTextWrapper
