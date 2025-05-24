import React, { useEffect } from 'react'
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
    .matches(/^[0-9]{16}$/, 'Debe tener 16 dígitos'),
  expMonth: yup
    .string()
    .required('Mes requerido')
    .matches(/^(0[1-9]|1[0-2])$/, 'Mes inválido'),
  expYear: yup
    .string()
    .required('Año requerido')
    .matches(/^[0-9]{2}$/, 'Año inválido'),
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

// ✅ Overlay de carga
const LoadingOverlay: React.FC = () => (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-2">
      <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <span>Procesando pago...</span>
    </div>
  </div>
)

const PaymentForm: React.FC<PaymentFormProps> = ({ onBack, onNext }) => {
  const dispatch = useDispatch()
  const { handlePayment, loading, error } = usePayment()

  const cartItems = useSelector((s: RootState) => s.cart.items)
  const products  = useSelector((s: RootState) => s.products.items)

  if (cartItems.length === 0) throw new Error('Carrito vacío')

  const itemsWithDetails = cartItems
    .map(ci => {
      const product = products.find(p => p.id === ci.productId)
      return product ? { ...product, quantity: ci.quantity } : null
    })
    .filter(Boolean) as Array<{ id: string, price: number, quantity: number }>

  const subtotal = itemsWithDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const totalInPesos = subtotal + BASE_FEE + DELIVERY_FEE
  const amountInCents = totalInPesos * 100

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) })

  const cardNumber = watch('cardNumber') ?? ''
  const brand = detectBrand(cardNumber)

  // ⛔ Bloquear recarga durante loading
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (loading) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [loading])

  const onSubmit = (data: FormData) => {
    dispatch(setCustomerInfo({
      name:    data.name,
      address: data.address,
      email:   data.email,
    }))

    handlePayment({
      cardNumber: data.cardNumber,
      expMonth:   data.expMonth,
      expYear:    data.expYear,
      cvc:        data.cvc,
      name:       data.name,
      address:    data.address,
      email:      data.email,
      amountInCents,
      products: itemsWithDetails.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    }).finally(onNext)
  }

  const iconClass = (icon: string) =>
    `h-6 transition-opacity ${brand === icon ? 'opacity-100' : 'opacity-30'}`

  return (
    <>
      {loading && <LoadingOverlay />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-semibold">3. Pago con tarjeta</h2>

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
            {...register('cardNumber')}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="1234567812345678"
          />
          {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {['expMonth','expYear','cvc'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1">
                {field === 'expMonth' ? 'Mes' : field === 'expYear' ? 'Año' : 'CVC'}
              </label>
              <input
                type="text"
                maxLength={field === 'cvc' ? 4 : 2}
                {...register(field as keyof FormData)}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors[field as keyof FormData] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field as keyof FormData]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        {(['name','address','email'] as (keyof FormData)[]).map(key => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">
              {key === 'name' ? 'Nombre en tarjeta' : key === 'address' ? 'Dirección' : 'Correo electrónico'}
            </label>
            <input
              type={key === 'email' ? 'email' : 'text'}
              {...register(key)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]?.message}</p>}
          </div>
        ))}

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
    </>
  )
}

export default PaymentForm
