import { len } from './utils'

export type Dict<T = any> = Record<string, T>

export const isServer = typeof window === 'undefined'

export const isArray = <T>(value: any): value is Array<T> => Array.isArray(value)

export const isEmptyArray = (value: any) => !isArray(value) || len(value) === 0

export const isObject = (value: any): value is Dict => value !== null && !isArray(value) && typeof value === 'object'

export const isFunction = <T extends Function = Function>(value: any): value is T => typeof value === 'function'

export const isNumeric = (value?: string | number) => value !== '' && value !== null && !isNaN(Number(value))

export function isLengthInRange(array: any, { min, max, equal }: { min?: number; max?: number; equal?: boolean }) {
  const length = len(array)

  // Greater than or equal to min
  if (min !== undefined && max === undefined) {
    return equal ? length >= min : length > min
  }

  // Between min and max
  if (min !== undefined && max !== undefined) {
    const isBigger = equal ? length >= min : length > min
    const isSmaller = equal ? length <= max : length < max
    return isBigger && isSmaller
  }

  // Less than max
  if (min === undefined && max !== undefined) {
    return equal ? length <= max : length < max
  }

  return isArray(array)
}
