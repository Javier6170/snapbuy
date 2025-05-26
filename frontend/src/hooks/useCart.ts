import { useSelector } from 'react-redux'
import type { RootState } from '../app/store'
import { shallowEqual } from 'react-redux'


export function useCart() {
  const quantity = useSelector(
    (state: RootState) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
    shallowEqual
  )

  return { quantity }
}
