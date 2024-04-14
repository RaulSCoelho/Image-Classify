import { IconBaseProps } from 'react-icons'
import { LuMoon, LuSun } from 'react-icons/lu'

import { useTheme } from '@/providers/theme-provider'
import { tv } from '@nextui-org/react'

const themeSwitch = tv({
  base: 'cursor-pointer text-default-600 dark:text-default-500'
})

export function ThemeSwitch({ size = 24, onClick, className, ...props }: IconBaseProps) {
  const { theme, setTheme } = useTheme()
  const Icon = theme === 'dark' ? LuSun : LuMoon

  function toggleTheme(e: React.MouseEvent<SVGSVGElement>) {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    onClick?.(e)
  }

  return <Icon size={size} className={themeSwitch({ className })} onClick={toggleTheme} {...props} />
}
