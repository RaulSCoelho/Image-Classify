import { Link, LinkProps, NavbarItem, NavbarMenuItem } from '@nextui-org/react'
import { usePathname } from 'next/navigation'

export function NavLink({ children, href, color, isMenu, ...props }: LinkProps & { isMenu?: boolean }) {
  const pathname = usePathname()
  const Item = isMenu ? NavbarMenuItem : NavbarItem
  const isActive = pathname === href

  return (
    <Item isActive={isActive}>
      <Link href={href} color={color || isActive ? 'primary' : 'foreground'} {...props}>
        {children}
      </Link>
    </Item>
  )
}
