// src/features/customer/DeliveryForm.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import { setCustomerInfo } from './customerSlice'
import { deliverySchema, DeliveryFormData } from '../../utils/validationSchemas'

interface Props {
  onBack(): void
  onNext(): void
}

const DeliveryForm: React.FC<Props> = ({ onBack, onNext }) => {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<DeliveryFormData>({
    resolver: yupResolver(deliverySchema),
    mode: 'onTouched'
  })

  const submit = (data: DeliveryFormData) => {
    dispatch(setCustomerInfo(data))
    onNext()
  }

  return (
    <div >
      {/* Título */}
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">2. Información de entrega</h2>
        <p className="text-gray-600 mt-1">
          Completa los datos para la entrega de tu pedido
        </p>
      </header>

      <form onSubmit={handleSubmit(submit)} className="space-y-5">
        {/* Nombre completo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre completo
          </label>
          <input
            {...register('name')}
            placeholder="Juan Pérez"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            {...register('address')}
            placeholder="Calle 123 #45-67"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* Correo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            type="email"
            {...register('email')}
            placeholder="correo@ejemplo.com"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            ← Anterior
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Siguiente →
          </button>
        </div>
      </form>
    </div>
  )
}

export default DeliveryForm
