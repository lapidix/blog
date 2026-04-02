'use client'

import { headerNavLinks } from '@/data/nav'
import { ctm } from 'app/utils/style'
import { useState } from 'react'
import CloseIcon from '../atoms/CloseIcon'
import ToggleIcon from '../atoms/ToggleIcon'
import NavigationMenuButton from '../molecules/NavigationMenuButton'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto'
      } else {
        // Prevent scrolling
        document.body.style.overflow = 'hidden'
      }
      return !status
    })
  }

  return (
    <>
      <button aria-label="Toggle Menu" onClick={onToggleNav} className="sm:hidden">
        <ToggleIcon />
      </button>
      {navShow && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div className="fixed inset-0 z-[9]" onClick={onToggleNav} />
      )}
      <div
        className={ctm(
          `fixed right-0 top-0 z-10 h-full w-2/3 transform opacity-90 dark:opacity-[0.90] bg-zinc-50 duration-300 ease-in-out dark:bg-zinc-800`,
          navShow ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex justify-end">
          <button className="mr-6 mt-8 h-6 w-8" aria-label="Toggle Menu" onClick={onToggleNav}>
            <CloseIcon />
          </button>
        </div>

        <nav className="fixed mt-6 h-full">
          {headerNavLinks.map((link) => (
            <NavigationMenuButton key={link.title} link={link} onToggleNav={onToggleNav} />
          ))}
        </nav>
      </div>
    </>
  )
}

export default MobileNav
