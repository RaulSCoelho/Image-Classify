import { atom, useRecoilState } from 'recoil'

import { SearchInput } from '../input/search'

export const navSearchState = atom({
  key: 'navSearchState',
  default: ''
})

export function NavSearch() {
  const [searchValue, setSearchValue] = useRecoilState(navSearchState)

  return <SearchInput value={searchValue} className="hidden sm:flex" onValueChange={setSearchValue} />
}
