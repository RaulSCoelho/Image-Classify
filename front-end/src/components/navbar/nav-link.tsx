import { Link, LinkProps, NavbarItem, NavbarMenuItem, useNavbarContext } from '@nextui-org/react'
import { usePathname } from 'next/navigation'

export function NavLink({ children, href, color, isMenu, onClick, ...props }: LinkProps & { isMenu?: boolean }) {
  const { setIsMenuOpen } = useNavbarContext()
  const pathname = usePathname()
  const Item = isMenu ? NavbarMenuItem : NavbarItem
  const isActive = pathname === href

  function handleClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    onClick?.(e)
    setIsMenuOpen(false)
  }

  return (
    <Item isActive={isActive}>
      <Link href={href} color={color || isActive ? 'primary' : 'foreground'} onClick={handleClick} {...props}>
        {children}
      </Link>
    </Item>
  )
}
