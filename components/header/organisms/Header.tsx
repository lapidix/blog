/* eslint-disable @next/next/no-img-element */

import { HeaderNavigation } from '@/components/header/molecules/HeaderNavigation'
import siteMetadata from '@/data/siteMetadata'
import Link from '../../common/atoms/Link'
import MobileNav from '../../navigation/organisms/MobileNav'
import LogoIcon from '../atoms/LogoIcon'
import SearchButton from '../molecules/SearchButton'
import ThemeSwitchWrapper from '../molecules/ThemeSwitchWrapper'

const Header = () => {
  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <LogoIcon />
            <span>{siteMetadata.headerTitle}</span>
          </div>
        </Link>
      </div>
      <nav
        className="flex items-center leading-5 gap-x-8"
        role="navigation"
        aria-label="main-navigation"
      >
        <HeaderNavigation />
        <div className="flex items-center space-x-4" role="group" aria-label="사이트 유틸리티">
          <SearchButton />
          <ThemeSwitchWrapper />
          <MobileNav />
        </div>
      </nav>
    </header>
  )
}

export default Header
