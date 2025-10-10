import { ReactNode } from 'react'

// SVG 아이콘 컴포넌트
const TipIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
)

const NoteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-sky-600 dark:text-sky-300"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-yellow-600 dark:text-yellow-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
)

const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-red-600 dark:text-red-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

export const TipCallout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-emerald-300/20 dark:bg-emerald-900/30 border-l-4 border-emerald-600 rounded-md px-5 pb-0.5 mb-5">
      <div className="flex items-center pt-5">
        <span className="mr-2">
          <TipIcon />
        </span>
        <span className="font-extrabold">Tip</span>
      </div>
      {children}
    </div>
  )
}

export const NoteCallout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-sky-100/80 dark:bg-sky-900/30 border-l-4 border-sky-500 rounded-md px-5 pb-3 mb-5">
      <div className="flex items-center pt-4 pb-2">
        <span className="mr-2">
          <NoteIcon />
        </span>
        <span className="font-bold text-sky-700 dark:text-sky-300">Note</span>
      </div>
      <div className="text-gray-800 dark:text-gray-100">{children}</div>
    </div>
  )
}

export const WarningCallout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-yellow-300/20 dark:bg-yellow-700/30 border-l-4 border-yellow-500 rounded-md px-5 pb-0.5 mb-5">
      <div className="flex items-center pt-5">
        <span className="mr-2">
          <WarningIcon />
        </span>
        <span className="font-extrabold">Warning</span>
      </div>
      {children}
    </div>
  )
}

export const ErrorCallout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-red-300/20 dark:bg-red-700/30 border-l-4 border-red-500 rounded-md px-5 pb-0.5 mb-5">
      <div className="flex items-center pt-5">
        <span className="mr-2">
          <ErrorIcon />
        </span>
        <span className="font-extrabold">Error</span>
      </div>
      {children}
    </div>
  )
}

export const InfoCallout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-indigo-300/20 dark:bg-indigo-700/30 border-l-4 border-indigo-500 rounded-md px-5 pb-0.5 mb-5">
      <div className="flex items-center pt-5">
        <span className="mr-2">
          <InfoIcon />
        </span>
        <span className="font-extrabold">Info</span>
      </div>
      {children}
    </div>
  )
}
