import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DeliveryFormData } from '../../utils/validationSchemas'

const initialState: DeliveryFormData = {
  country:       '',
  firstName:     '',
  lastName:      '',
  documentNumber:'',
  email:'',
  address1:      '',
  address2:      undefined,
  city:          '',
  state:         '',
  postalCode:    undefined,
  phone:         '',
  saveInfo:      false,
  sendSmsOffers: false,
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomerInfo(state, action: PayloadAction<DeliveryFormData>) {
      return action.payload
    },
  },
})

export const { setCustomerInfo } = customerSlice.actions
export default customerSlice.reducer
