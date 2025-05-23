// src/features/payment/PaymentForm.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import type { RootState } from '../app/store'
import { setCustomerInfo } from '../features/customer/customerSlice'
import { usePayment } from '../hooks/useWompi'
import mastercardLogo from '../assets/mastercard.svg'
import visaLogo       from '../assets/visa.svg'
import amexLogo       from '../assets/americanexpress.svg'

const BASE_FEE     = Number(process.env.REACT_APP_BASE_FEE    ?? 3000)
const DELIVERY_FEE = Number(process.env.REACT_APP_DELIVERY_FEE?? 5000)

const schema = yup.object({
  cardNumber: yup
    .string()
    .required('Número de tarjeta requerido')
    .matches(/^[0-9]{0,16}$/, 'Solo dígitos')
    .min(16, 'Debe tener 16 dígitos'),
  expMonth: yup
    .string()
    .required('Mes requerido')
    .matches(/^(0[1-9]|1[0-2])$/, 'MM inválido'),
  expYear: yup
    .string()
    .required('Año requerido')
    .matches(/^[0-9]{2}$/, 'YY inválido'),
  cvc: yup
    .string()
    .required('CVC requerido')
    .matches(/^[0-9]{3,4}$/, '3 o 4 dígitos'),
  name:    yup.string().required('Nombre requerido'),
  address: yup.string().required('Dirección requerida'),
  email:   yup.string().email('Correo inválido').required('Correo requerido'),
}).required()

type FormData = yup.InferType<typeof schema>

interface PaymentFormProps {
  onBack: () => void
  onNext: () => void
}

const detectBrand = (num: string) => {
  if (/^4/.test(num)) return 'visa'
  if (/^5[1-5]/.test(num)) return 'mastercard'
  if (/^3[47]/.test(num)) return 'amex'
  return null
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onBack, onNext }) => {
  const dispatch = useDispatch()
  const { handlePayment, loading, error } = usePayment()
  const product  = useSelector((s: RootState) => s.products.items.find(p => p.id === s.cart.productId))!
  const quantity = useSelector((s: RootState) => s.cart.quantity)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const cardNumber = watch('cardNumber') ?? ''
  const brand = detectBrand(cardNumber)

  const onSubmit = (data: FormData) => {
    dispatch(setCustomerInfo({
      name:    data.name,
      address: data.address,
      email:   data.email,
    }))
    handlePayment({
      cardNumber:    data.cardNumber,
      expMonth:      data.expMonth,
      expYear:       data.expYear,
      cvc:           data.cvc,
      name:          data.name,
      address:       data.address,
      email:         data.email,
      productId:     product.id,
      quantity,
      amountInCents: product.price * quantity + BASE_FEE + DELIVERY_FEE,
    }).finally(onNext)
  }

  const iconClass = (icon: string) =>
    `h-6 transition-opacity ${brand === icon ? 'opacity-100' : 'opacity-30'}`

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-semibold">2. Datos de pago</h2>

      <div className="flex gap-4 mb-4">
        <img src={visaLogo}       alt="Visa"       className={iconClass('visa')} />
        <img src={mastercardLogo} alt="Mastercard" className={iconClass('mastercard')} />
        <img src={amexLogo}       alt="Amex"       className={iconClass('amex')} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Número de tarjeta</label>
        <input
          type="text"
          maxLength={16}
          placeholder="1234 5678 9012 3456"
          {...register('cardNumber')}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Mes</label>
          <input
            type="text"
            maxLength={2}
            placeholder="MM"
            {...register('expMonth')}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.expMonth && <p className="text-red-500 text-xs mt-1">{errors.expMonth.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Año</label>
          <input
            type="text"
            maxLength={2}
            placeholder="YY"
            {...register('expYear')}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.expYear && <p className="text-red-500 text-xs mt-1">{errors.expYear.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CVC</label>
          <input
            type="text"
            maxLength={4}
            placeholder="123"
            {...register('cvc')}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nombre en tarjeta</label>
        <input
          type="text"
          placeholder="Tu nombre"
          {...register('name')}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Dirección</label>
        <input
          type="text"
          placeholder="Calle, ciudad"
          {...register('address')}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Correo electrónico</label>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          {...register('email')}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          ← Volver
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Procesando...' : 'Pagar'}
        </button>
      </div>
    </form>
  )
}

export default PaymentForm
