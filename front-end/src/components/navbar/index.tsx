'use client'

import { useState } from 'react'
import { FaGithub } from 'react-icons/fa6'

import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarItem
} from '@nextui-org/react'
import NextLink from 'next/link'

import { Image } from '../image'
import { ThemeSwitch } from '../theme-switch'
import { NavLink } from './nav-link'
import { NavSearch } from './nav-search'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'AI Models', href: '/models' },
    { label: 'Predictions', href: '/predictions' }
  ]

  return (
    <NextUINavbar className="bg-background/60 text-foreground" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarBrand className="h-full space-x-2">
        <NavbarMenuToggle className="sm:hidden" />
        <NextLink href="/" className="flex h-full items-center justify-center gap-2">
          <Image src="/logo.png" alt="logo" classNames={{ wrapper: 'h-full w-8' }} fill />
          <p className="font-bold">Image Classify</p>
        </NextLink>
      </NavbarBrand>
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {menuItems.map((item, index) => (
          <NavLink href={item.href} key={`${item.label}-${index}`}>
            {item.label}
          </NavLink>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavLink icon={FaGithub} href="https://github.com/RaulSCoelho/Image-Classify" />
        <NavbarItem className="flex h-full items-center">
          <ThemeSwitch />
        </NavbarItem>
        <NavSearch />
      </NavbarContent>

      <NavbarMenu className="bg-background/60">
        {menuItems.map((item, index) => (
          <NavLink href={item.href} key={`${item.label}-${index}`} isMenu>
            {item.label}
          </NavLink>
        ))}
      </NavbarMenu>
    </NextUINavbar>
  )
}
