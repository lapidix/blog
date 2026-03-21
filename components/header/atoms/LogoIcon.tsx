import Logo from '@/data/logo.png'
import Image from 'next/image'

const LogoIcon = () => {
  return (
    <div className="p-1">
      <Image priority src={Logo} alt="Logo" width={40} height={40} />
    </div>
  )
}

export default LogoIcon
