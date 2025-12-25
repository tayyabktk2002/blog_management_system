'use client'
import { usePathname } from 'next/navigation'
import Navber from './Navber'

const ConditionalNavbar = () => {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register'

  if (isAuthPage) return null
  
  return <Navber />
}

export default ConditionalNavbar