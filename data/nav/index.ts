export const headerNavLinks = [
  { href: '/', title: 'Home' },
  { href: '/posts', title: 'Articles' },
  { href: '/retrospections', title: 'Retrospections' },
  // { href: '/tags', title: 'Tags' },
  // { href: '/projects', title: 'Projects' },
  // { href: '/about', title: 'About' },
  { href: 'https://resume.lapidix.dev', title: 'Resume' },
]

export interface HeaderNavLink {
  href: string
  title: string
}
