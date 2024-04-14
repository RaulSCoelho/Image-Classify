import { isArray, isObject } from './assertions'

export function tryParseJSON(value: any): any {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

export function areObjectsEqual(original: any, current: any): boolean {
  if (Array.isArray(original) && Array.isArray(current)) {
    if (original.length !== current.length) {
      return false
    }

    for (let i = 0; i < original.length; i++) {
      if (!areObjectsEqual(original[i], current[i])) {
        return false
      }
    }

    return true
  }

  if (typeof original !== 'object' || typeof current !== 'object' || original === null || current === null) {
    return original === current
  }

  const originalKeys = Object.keys(original)
  const currentKeys = Object.keys(current)

  // Check if the number of keys is different
  if (originalKeys.length !== currentKeys.length) {
    return false
  }

  // Check if each key and its corresponding value has changed
  for (const key of originalKeys) {
    const originalValue = original[key]
    const currentValue = current[key]

    if (currentValue === undefined || typeof originalValue !== typeof currentValue) {
      return false
    }

    if (!areObjectsEqual(originalValue, currentValue)) {
      return false
    }
  }

  return true
}

export function groupBy<T extends { [key: string]: any }, K extends keyof T>(
  array: T[],
  key: K,
  // eslint-disable-next-line no-unused-vars
  initialValue: { [key in T[K]]?: T[] } = {},
  defaultKey?: T[K]
  // eslint-disable-next-line no-unused-vars
): { [key in T[K]]?: T[] } {
  return array.reduce((acc, value) => {
    const keyValue = value[key] || defaultKey!
    acc[keyValue] = acc[keyValue] ?? []
    acc[keyValue]?.push(value)
    return acc
  }, initialValue)
}

export function filter<T extends object>(object: T, filter?: (value: any) => boolean) {
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(object).filter(([_, value]) =>
      filter ? filter(value) : value !== null && value !== undefined && value !== ''
    )
  ) as T
}

export function splitObject<T extends Record<string, any>, K extends keyof T>(
  rest: T,
  keys?: K[],
  addToRest = false
): readonly [Omit<T, K> | T, Pick<T, K>] {
  if (!keys) {
    return [rest, {}] as any
  }

  const result = Object.keys(rest).reduce(
    (acc, key) => {
      const includes = keys.includes(key as K)
      const shouldAddToFirstArray = addToRest || !includes

      // Only include the key in `picked` if it exists in `props`
      if (includes) acc[1][key as K] = rest[key]
      // Remove keys that are in keys prop
      if (shouldAddToFirstArray) acc[0][key as K] = rest[key]

      return acc
    },
    [{}, {}] as [T, T]
  )

  return addToRest ? (result as [T, Pick<T, K>]) : (result as [Omit<T, K>, Pick<T, K>])
}

interface SplitOptions {
  max?: number
  defaultValue?: 'undefined' | 'emptyArray'
}

export function split<T>(
  array: T[],
  chunkSize: number,
  { max = Infinity, defaultValue = 'undefined' }: SplitOptions = {}
) {
  const result = []
  const defaultChunk = defaultValue === 'emptyArray' ? [] : undefined
  let currentIndex = 0

  while (currentIndex < array.length && result.length < Math.min(array.length, max)) {
    const chunk = array.slice(currentIndex, currentIndex + chunkSize)
    result.push(chunk.length <= chunkSize ? chunk : defaultChunk)
    currentIndex += chunkSize
  }

  return result
}

export function cut<T>(array: T[], index: number) {
  if (index === -1) {
    return [array, []]
  }
  return [array.slice(0, index), array.slice(index)]
}

export function find<T, K extends keyof T>(array: T[] | undefined, key: K, value?: T[K] | null) {
  if (!isArray(array)) return undefined
  return array.find(item => item[key] === value)
}

export function len(value?: any) {
  if (isArray(value) || typeof value === 'string') {
    return value.length
  }
  if (isObject(value)) {
    return Object.keys(value).length
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size
  }
  return 0
}
