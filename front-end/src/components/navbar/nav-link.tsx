import { Link, LinkProps, NavbarItem, NavbarMenuItem, useNavbarContext } from '@nextui-org/react'
import { PressEvent } from '@react-types/shared'
import { usePathname } from 'next/navigation'

export function NavLink({ children, href, color, isMenu, onPress, ...props }: LinkProps & { isMenu?: boolean }) {
  const { setIsMenuOpen } = useNavbarContext()
  const pathname = usePathname()
  const Item = isMenu ? NavbarMenuItem : NavbarItem
  const isActive = pathname === href

  function handlePress(e: PressEvent) {
    onPress?.(e)
    setIsMenuOpen(false)
  }

  return (
    <Item isActive={isActive}>
      <Link href={href} color={color || isActive ? 'primary' : 'foreground'} onPress={handlePress} {...props}>
        {children}
      </Link>
    </Item>
  )
}
