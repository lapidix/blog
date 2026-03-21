import { RoughNotation } from 'react-rough-notation'

const GreetingTextWrapper = () => {
  return (
    <div className="flex text-2xl font-extrabold leading-9 tracking-tight sm:text-5xl sm:leading-10 md:text-6xl md:leading-14 pb-2">
      <RoughNotation type="box" show color="#059669">
        <h1 className="bg-gradient-to-r from-slate-500 to-slate-800 text-transparent bg-clip-text dark:from-gray-200 dark:to-slate-300 mb-2">
          Hi There
        </h1>
      </RoughNotation>
      <p>&nbsp;👋🏻</p>
    </div>
  )
}

export default GreetingTextWrapper
