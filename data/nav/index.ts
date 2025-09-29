export const headerNavLinks = [
  { href: '/', title: 'Home' },
  { href: '/posts', title: 'Posts' },
  { href: '/reflections', title: 'Reflections' },
  // { href: '/tags', title: 'Tags' },
  // { href: '/projects', title: 'Projects' },
  // { href: '/about', title: 'About' },
  { href: 'https://resume.lapidix.dev', title: 'Resume' },
]

export interface HeaderNavLink {
  href: string
  title: string
}
