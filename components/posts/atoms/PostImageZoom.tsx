'use client'

import {
  CSSProperties,
  ReactNode,
  TransitionEvent as ReactTransitionEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

type Rect = { top: number; left: number; width: number; height: number }

const TRANSITION_MS = 300
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'

const computeFinalRect = (naturalW: number, naturalH: number, fallback: Rect): Rect => {
  const maxW = window.innerWidth * 0.9
  const maxH = window.innerHeight * 0.9
  let w = naturalW
  let h = naturalH
  if (!w || !h) {
    w = fallback.width
    h = fallback.height
  }
  const scale = Math.min(maxW / w, maxH / h)
  const finalW = w * scale
  const finalH = h * scale
  return {
    width: finalW,
    height: finalH,
    top: (window.innerHeight - finalH) / 2,
    left: (window.innerWidth - finalW) / 2,
  }
}

type Props = {
  children: ReactNode
  className?: string
}

const PostImageZoom = ({ children, className }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sourceImgRef = useRef<HTMLImageElement | null>(null)
  const prevOverflow = useRef('')
  const prevPaddingRight = useRef('')

  const [mounted, setMounted] = useState(false)
  const [src, setSrc] = useState<string | null>(null)
  const [alt, setAlt] = useState<string>('')
  const [originRect, setOriginRect] = useState<Rect | null>(null)
  const [finalRect, setFinalRect] = useState<Rect | null>(null)
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const lockScroll = useCallback(() => {
    const sbW = window.innerWidth - document.documentElement.clientWidth
    prevOverflow.current = document.body.style.overflow
    prevPaddingRight.current = document.body.style.paddingRight
    if (sbW > 0) document.body.style.paddingRight = `${sbW}px`
    document.body.style.overflow = 'hidden'
  }, [])

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = prevOverflow.current
    document.body.style.paddingRight = prevPaddingRight.current
  }, [])

  const close = useCallback(() => {
    setClosing(true)
    setOpen(false)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null
      if (!target) return
      const img = target.closest('img') as HTMLImageElement | null
      if (!img || !el.contains(img)) return
      if (img.closest('a')) return

      const imgSrc = img.currentSrc || img.src
      if (!imgSrc) return

      const rect = img.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      ev.preventDefault()

      const o: Rect = { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
      const f = computeFinalRect(img.naturalWidth, img.naturalHeight, o)

      sourceImgRef.current = img
      img.style.visibility = 'hidden'

      setSrc(imgSrc)
      setAlt(img.alt || '')
      setOriginRect(o)
      setFinalRect(f)
      setClosing(false)
      lockScroll()

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setOpen(true))
      })
    }

    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [lockScroll])

  useEffect(() => {
    if (!src) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [src, close])

  const onTransitionEnd = useCallback(
    (e: ReactTransitionEvent<HTMLImageElement>) => {
      if (e.propertyName !== 'transform') return
      if (!closing) return

      const img = sourceImgRef.current
      if (img) {
        img.style.visibility = ''
        try {
          img.focus({ preventScroll: true })
        } catch {
          // ignore: img may not be focusable
        }
      }
      sourceImgRef.current = null
      setSrc(null)
      setAlt('')
      setOriginRect(null)
      setFinalRect(null)
      setClosing(false)
      unlockScroll()
    },
    [closing, unlockScroll]
  )

  const overlayImgStyle: CSSProperties | undefined =
    originRect && finalRect
      ? {
          position: 'fixed',
          top: finalRect.top,
          left: finalRect.left,
          width: finalRect.width,
          height: finalRect.height,
          transformOrigin: 'top left',
          transform: open
            ? 'translate(0px, 0px) scale(1)'
            : `translate(${originRect.left - finalRect.left}px, ${
                originRect.top - finalRect.top
              }px) scale(${originRect.width / finalRect.width})`,
          transition: `transform ${TRANSITION_MS}ms ${EASING}`,
          cursor: 'zoom-out',
          willChange: 'transform',
          objectFit: 'contain',
          maxWidth: 'none',
          maxHeight: 'none',
          margin: 0,
          padding: 0,
          userSelect: 'none',
        }
      : undefined

  const wrapperClassName =
    `${className ?? ''} [&_img]:cursor-zoom-in [&_img]:rounded-md [&_img]:shadow-md [&_img]:ring-1 [&_img]:ring-black/5 dark:[&_img]:ring-white/25 dark:[&_img]:shadow-[0_10px_30px_rgba(255,255,255,0.12),0_0_0_1px_rgba(255,255,255,0.05)]`.trim()

  return (
    <>
      <div ref={containerRef} className={wrapperClassName}>
        {children}
      </div>
      {mounted && src && overlayImgStyle
        ? createPortal(
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions
            <div
              role="dialog"
              aria-modal="true"
              aria-label={alt || 'Zoomed image'}
              onClick={close}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.85)',
                WebkitBackdropFilter: 'blur(4px)',
                backdropFilter: 'blur(4px)',
                zIndex: 9999,
                opacity: open ? 1 : 0,
                transition: `opacity ${TRANSITION_MS}ms ${EASING}`,
                cursor: 'zoom-out',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
              <img
                src={src}
                alt={alt}
                draggable={false}
                onClick={(e) => {
                  e.stopPropagation()
                  close()
                }}
                onTransitionEnd={onTransitionEnd}
                style={overlayImgStyle}
              />
            </div>,
            document.body
          )
        : null}
    </>
  )
}

export default PostImageZoom
