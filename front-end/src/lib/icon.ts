import { ForwardRefExoticComponent, ReactSVG, RefAttributes, SVGProps, createElement, forwardRef } from 'react'

import { tv } from '@nextui-org/react'

import { toKebabCase } from './string'

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>
type ComponentAttributes = RefAttributes<SVGSVGElement> & SVGAttributes

export interface IconProps extends ComponentAttributes {
  size?: string | number
  absoluteStrokeWidth?: boolean
}

export type Icon = ForwardRefExoticComponent<IconProps>
export type IconNode = [elementName: keyof ReactSVG, attrs: SVGAttributes][]

const defaultAttrs = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

const icon = tv({})

export function createIcon(
  iconName: string,
  iconNode: IconNode,
  svgAttributes: SVGAttributes & { size?: string | number } = {}
): Icon {
  const Component = forwardRef<SVGSVGElement, IconProps>(
    (
      {
        color = 'currentColor',
        size = svgAttributes.size ?? 24,
        strokeWidth = svgAttributes.strokeWidth ?? defaultAttrs.strokeWidth,
        absoluteStrokeWidth,
        className = '',
        children,
        ...rest
      },
      ref
    ) =>
      createElement(
        'svg',
        {
          ref,
          ...defaultAttrs,
          ...svgAttributes,
          width: size || undefined,
          height: size || undefined,
          stroke: color,
          strokeWidth: absoluteStrokeWidth ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth,
          className: icon({ class: [`nkey-${toKebabCase(iconName)}`, className] }),
          ...rest
        },
        [
          ...iconNode.map(([tag, attrs], i) => createElement(tag, { ...attrs, key: i })),
          ...(Array.isArray(children) ? children : [children])
        ]
      )
  )
  Component.displayName = `${iconName}`
  return Component
}
