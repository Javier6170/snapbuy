import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../app/store'
import { useAppDispatch } from './useAppDispatch'
import { loadProducts } from '../features/products/productSlice'

export function useProducts() {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useSelector((state: RootState) => state.products)
  useEffect(() => {
    dispatch(loadProducts())
  }, [dispatch])
  return { items, loading, error }
}
