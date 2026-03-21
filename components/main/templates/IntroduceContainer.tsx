import GreetingTextWrapper from '../molecules/GreetingTextWrapper'
import { TypedIntroduceWrapper } from '../organisms/TypedIntroduceWrapper'

const IntroduceContainer = () => {
  return (
    <div className="flex p-0 md:py-4 w-auto items-center justify-between h-auto border-b border-zinc-600 dark:border-zinc-200">
      <div className="flex flex-col items-start justify-start h-auto flex-1">
        <GreetingTextWrapper />
        {/* <IntroduceTextWrapper /> */}
        <TypedIntroduceWrapper />
      </div>
    </div>
  )
}

export default IntroduceContainer
