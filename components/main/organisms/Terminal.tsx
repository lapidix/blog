'use client'

import { terminalAbout, terminalContacts, terminalSkills } from '@/data/terminal'
import { Authors, Blog, Retrospection } from 'contentlayer/generated'
import { slug as slugify } from 'github-slugger'
import Link from 'next/link'
import { CoreContent } from 'pliny/utils/contentlayer.js'
import { useCallback, useEffect, useRef, useState } from 'react'

interface PostWithViews extends CoreContent<Blog | Retrospection> {
  views: number
}

interface TerminalProps {
  posts: CoreContent<Blog | Retrospection>[]
  trendingPosts: PostWithViews[]
  author: Authors
  tags: string[]
}

type LineType = 'command' | 'output' | 'link' | 'blank'

interface TerminalLine {
  id: number
  type: LineType
  text: string
  href?: string
}

const COMMANDS: Record<string, string> = {
  help: 'Show available commands',
  about: 'About me',
  skills: 'Tech stack',
  articles: 'Latest articles',
  top: 'Top articles',
  tags: 'Browse by tags',
  contact: 'Get in touch',
  clear: 'Clear terminal',
}

const SUGGESTED_COMMANDS = ['about', 'articles', 'top', 'skills', 'contact']

let lineIdCounter = 0
function nextLineId() {
  return lineIdCounter++
}

function makeLine(type: LineType, text: string, href?: string): TerminalLine {
  return { id: nextLineId(), type, text, href }
}

export default function Terminal({ posts, trendingPosts, author, tags }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [initialized, setInitialized] = useState(false)
  const isComposing = useRef(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    })
  }, [])

  const buildOutput = useCallback(
    (cmd: string): TerminalLine[] => {
      switch (cmd) {
        case 'help':
          return [
            makeLine('output', 'Available commands:'),
            makeLine('blank', ''),
            ...Object.entries(COMMANDS).map(([name, desc]) =>
              makeLine('output', `  ${name.padEnd(10)} ${desc}`)
            ),
          ]

        case 'about':
          return terminalAbout.map((line) =>
            line === '' ? makeLine('blank', '') : makeLine('output', `  ${line}`)
          )

        case 'skills':
          return [
            makeLine('output', '  Tech Stack:'),
            makeLine('blank', ''),
            ...terminalSkills.map((g) => makeLine('output', `  ${g.label.padEnd(12)} ${g.items}`)),
          ]

        case 'articles':
          if (!posts.length) return [makeLine('output', '  No articles found.')]
          return [
            makeLine('output', '  Latest Articles:'),
            makeLine('blank', ''),
            ...posts.slice(0, 5).map((post, i) => {
              const href =
                post.type === 'Blog' ? `/posts/${post.slug}` : `/retrospections/${post.slug}`
              return makeLine('link', `  ${i + 1}. ${post.title}`, href)
            }),
            makeLine('blank', ''),
            makeLine('link', '  → View all articles', '/posts'),
          ]

        case 'top':
          if (!trendingPosts.length) return [makeLine('output', '  No trending articles yet.')]
          return [
            makeLine('output', '  Top Articles:'),
            makeLine('blank', ''),
            ...trendingPosts.slice(0, 5).map((post, i) => {
              const href =
                post.type === 'Blog' ? `/posts/${post.slug}` : `/retrospections/${post.slug}`
              const views =
                typeof post.views === 'number' ? ` (${post.views.toLocaleString()} views)` : ''
              return makeLine('link', `  ${i + 1}. ${post.title}${views}`, href)
            }),
          ]

        case 'tags':
          if (!tags.length) return [makeLine('output', '  No tags available.')]
          return [
            makeLine('output', '  Tags:'),
            makeLine('blank', ''),
            ...tags.map((tag) => makeLine('link', `  #${tag}`, `/tags/${slugify(tag)}`)),
          ]

        case 'contact':
          return [
            makeLine('output', '  Contact:'),
            makeLine('blank', ''),
            ...terminalContacts.map((c) =>
              c.href
                ? makeLine('link', `  ${c.label.padEnd(10)} ${c.value}`, c.href)
                : makeLine('output', `  ${c.label.padEnd(10)} ${c.value}`)
            ),
          ]

        default:
          return [
            makeLine('output', `  command not found: ${cmd}`),
            makeLine('output', '  Type "help" for available commands.'),
          ]
      }
    },
    [posts, trendingPosts, tags]
  )

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase()
      if (!trimmed) return

      if (trimmed === 'clear') {
        setLines([])
        setInput('')
        return
      }

      const commandLine = makeLine('command', trimmed)
      const output = buildOutput(trimmed)

      setLines((prev) => [...prev, commandLine, ...output, makeLine('blank', '')])
      setInput('')

      if (trimmed !== commandHistory[commandHistory.length - 1]) {
        setCommandHistory((prev) => [...prev, trimmed])
      }
      setHistoryIndex(-1)
    },
    [buildOutput, commandHistory]
  )

  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      const welcomeOutput = buildOutput('about')
      setLines([makeLine('command', 'about'), ...welcomeOutput, makeLine('blank', '')])
    }
  }, [initialized, buildOutput])

  useEffect(() => {
    scrollToBottom()
  }, [lines, scrollToBottom])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (isComposing.current) return
      executeCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length === 0) return
      const newIndex =
        historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(newIndex)
      setInput(commandHistory[newIndex])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const newIndex = historyIndex + 1
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const trimmed = input.trim().toLowerCase()
      if (!trimmed) return
      const match = Object.keys(COMMANDS).find((c) => c.startsWith(trimmed))
      if (match) setInput(match)
    }
  }

  const focusInput = () => inputRef.current?.focus()

  const renderLine = (line: TerminalLine) => {
    switch (line.type) {
      case 'command':
        return (
          <div key={line.id} className="flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-500 select-none">$</span>
            <span className="text-zinc-900 dark:text-zinc-100">{line.text}</span>
          </div>
        )
      case 'output':
        return (
          <div
            key={line.id}
            className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-words"
          >
            {line.text}
          </div>
        )
      case 'link':
        return (
          <div key={line.id} className="whitespace-pre-wrap break-words">
            <Link
              href={line.href!}
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline transition-colors"
            >
              {line.text}
            </Link>
          </div>
        )
      case 'blank':
        return <div key={line.id} className="h-1" />
      default:
        return null
    }
  }

  return (
    <div className="w-full my-4 rounded-lg overflow-hidden shadow-lg dark:shadow-zinc-950/50 border border-zinc-200 dark:border-zinc-700 flex flex-col h-[480px]">
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 select-none cursor-default flex-shrink-0"
        role="button"
        tabIndex={0}
        onClick={focusInput}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            focusInput()
          }
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500" />
          </div>
        </div>
        <span className="text-xs text-zinc-800 dark:text-zinc-50 font-mono">lapidix@dev ~ $</span>
        <div className="w-[52px]" />
      </div>

      {/* Terminal body */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        ref={scrollRef}
        className="bg-white dark:bg-zinc-900 p-4 font-mono text-sm leading-relaxed flex-1 min-h-[200px] overflow-y-auto cursor-text"
        onClick={focusInput}
      >
        {lines.map(renderLine)}

        {/* Input line */}
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 dark:text-emerald-500 select-none">$</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setHistoryIndex(-1)
              }}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => {
                isComposing.current = true
              }}
              onCompositionEnd={() => {
                isComposing.current = false
              }}
              className="w-full bg-transparent text-transparent outline-none border-none caret-transparent p-0 focus:ring-0"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Terminal input"
            />
            <span className="absolute top-0 left-0 pointer-events-none whitespace-pre" aria-hidden>
              {input ? (
                <>
                  <span className="text-zinc-800 dark:text-zinc-50">{input}</span>
                  <span className="terminal-cursor inline-block w-[8px] h-[1.1em] bg-zinc-800 dark:bg-zinc-100 align-middle ml-px" />
                </>
              ) : (
                <>
                  <span className="terminal-cursor inline-block w-[8px] h-[1.1em] bg-zinc-800 dark:bg-zinc-100 align-middle ml-px" />
                  <span className="text-zinc-400 dark:text-zinc-400 ml-2">
                    Type a command or click one below...
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Suggested commands */}
      <div className="text-zinc-800 dark:text-zinc-50 border-t border-zinc-200 dark:border-zinc-700 px-4 py-2 flex items-center gap-2 flex-wrap flex-shrink-0">
        <span className="text-zinc-800 dark:text-zinc-50 text-xs font-mono select-none mr-1">
          try:
        </span>
        {SUGGESTED_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            className="text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-500 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  )
}
