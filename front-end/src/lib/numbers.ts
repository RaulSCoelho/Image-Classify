export function range(length: number): number[]
export function range(start: number, end: number): number[]
export function range(start: number, end?: number) {
  const isSingle = end === undefined
  const isInverted = !isSingle && start > end
  const [actualStart, actualEnd] = isInverted ? [end, start] : [start, end || start]
  const length = isSingle ? actualStart : actualEnd - actualStart + 1

  return Array.from({ length }, (_, index) => {
    if (isSingle) return index
    return isInverted ? actualEnd - index : actualStart + index
  })
}

export function clamp(number: number, min: number = -Infinity, max: number = Infinity) {
  return Math.min(max, Math.max(min, number))
}

export function clampPercentage(value: number, max: number = 100) {
  return clamp(value, 0, max)
}
