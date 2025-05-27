// src/features/customer/customerSlice.test.ts
import customerReducer, { setCustomerInfo } from './customerSlice'
import type { DeliveryFormData } from '../../utils/validationSchemas'

describe('customerSlice reducer', () => {
  const initialState: DeliveryFormData = {
    country:        '',
    firstName:      '',
    lastName:       '',
    documentNumber: '',
    email:          '',
    address1:       '',
    address2:       undefined,
    city:           '',
    state:          '',
    postalCode:     undefined,
    phone:          '',
    saveInfo:       false,
    sendSmsOffers:  false,
  }

  it('should return the initial state when passed an empty action', () => {
    const state = customerReducer(undefined, { type: '' })
    expect(state).toEqual(initialState)
  })

  it('should handle setCustomerInfo by replacing the state', () => {
    const newInfo: DeliveryFormData = {
      country:        'Colombia',
      firstName:      'Juan',
      lastName:       'Pérez',
      documentNumber: '12345678',
      email:          'juan@example.com',
      address1:       'Calle 123',
      address2:       'Apto 4',
      city:           'Bogotá',
      state:          'Cundinamarca',
      postalCode:     '110111',
      phone:          '3001234567',
      saveInfo:       true,
      sendSmsOffers:  true,
    }
    const state = customerReducer(initialState, setCustomerInfo(newInfo))
    expect(state).toEqual(newInfo)
  })

  it('should overwrite previous state when setCustomerInfo is dispatched again', () => {
    const firstInfo: DeliveryFormData = { ...initialState, firstName: 'Ana' }
    const secondInfo: DeliveryFormData = { ...initialState, firstName: 'Carlos' }
    const state1 = customerReducer(initialState, setCustomerInfo(firstInfo))
    expect(state1.firstName).toBe('Ana')
    const state2 = customerReducer(state1, setCustomerInfo(secondInfo))
    expect(state2.firstName).toBe('Carlos')
  })
})
