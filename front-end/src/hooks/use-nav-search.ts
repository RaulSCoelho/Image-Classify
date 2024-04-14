import { navSearchState } from '@/components/navbar/nav-search'
import { useRecoilState } from 'recoil'

import { useFirstRenderEffect } from './use-first-render-effect'

export function useNavSearch() {
  const [searchValue, setSearchValue] = useRecoilState(navSearchState)

  useFirstRenderEffect(() => {
    setSearchValue(prev => ({ ...prev, show: true }))
  })

  return searchValue.value
}
