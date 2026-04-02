import { HeaderNavLink } from '@/data/nav'
import Link from 'next/link'

const NavigationMenuButton = ({
  link,
  onToggleNav,
}: {
  link: HeaderNavLink
  onToggleNav: () => void
}) => {
  return (
    <div key={link.title} className="px-6 py-4">
      <Link
        href={link.href}
        className="text-xl font-bold tracking-widest text-zinc-900 dark:text-zinc-100"
        onClick={onToggleNav}
      >
        {link.title}
      </Link>
    </div>
  )
}

export default NavigationMenuButton
