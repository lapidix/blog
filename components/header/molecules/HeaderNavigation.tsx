'use client'
import NavigationButton from '@/components/common/molecules/NavigationButton'
import { headerNavLinks } from '@/data/nav'
import { usePathname } from 'next/navigation'

export const HeaderNavigation = () => {
  const pathname = usePathname()
  return (
    <nav
      className="flex items-center leading-5 gap-x-8"
      role="navigation"
      aria-label="main-navigation"
    >
      {headerNavLinks
        .filter((link) => link.href !== '/')
        .map((link) => (
          <div key={link.title} className="hidden sm:flex font-medium items-start">
            <NavigationButton
              href={link.href}
              title={link.title}
              color="slate"
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              <p className="font-medium text-gray-900 dark:text-gray-100">{link.title}</p>
            </NavigationButton>
          </div>
        ))}
    </nav>
  )
}
