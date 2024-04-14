import { len } from './object'

export function joinPaths(baseURL: string | number, ...paths: (string | number)[]): string {
  return [baseURL, ...paths]
    .map((path, index) => {
      path = String(path)
      // Remove leading and trailing slashes from each path segment (except for the first segment)
      if (index !== 0) {
        path = path.replace(/^\//, '').replace(/\/$/, '')
      }
      // For the first segment, only remove the trailing slash
      else {
        path = path.replace(/\/$/, '')
      }
      return path
    })
    .join('/')
}

export function matchFirstSegment(route1?: string, route2?: string) {
  if (!route1 || !route2) return false

  const regex = /^(?:\/)?([^\/]+)/
  const match1 = route1.match(regex)
  const match2 = route2.match(regex)
  return match1 && match2 && match1[1] === match2[1]
}

export function arePathsEqual(...paths: string[]) {
  if (len(paths) < 2) return false

  const firstPath = trimSlashes(paths[0])

  return paths.every(path => trimSlashes(path) === firstPath)
}

export function trimSlashes(path: string) {
  return path.replace(/^\/+|\/+$/g, '')
}
