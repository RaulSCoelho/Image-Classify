import { atom, useRecoilState } from 'recoil'

import { SearchInput } from '../input/search'

export const navSearchState = atom({
  key: 'navSearchState',
  default: {
    show: false,
    value: ''
  }
})

export function NavSearch() {
  const [searchValue, setSearchValue] = useRecoilState(navSearchState)

  function onValueChange(value: string) {
    setSearchValue(prev => ({ ...prev, value }))
  }

  if (!searchValue.show) return null

  return <SearchInput value={searchValue.value} className="hidden sm:flex" onValueChange={onValueChange} />
}
