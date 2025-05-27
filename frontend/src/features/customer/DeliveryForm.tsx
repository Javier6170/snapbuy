// src/features/customer/DeliveryForm.tsx
import React from 'react'
import { useForm, SubmitHandler, Resolver } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import { setCustomerInfo } from './customerSlice'
import { deliverySchema, DeliveryFormData } from '../../utils/validationSchemas'

interface Props {
  onBack(): void
  onNext(): void
}

const countries = ['Colombia', 'México', 'España']
const states = ['Antioquia', 'Cundinamarca', 'Valle del Cauca']

const DeliveryForm: React.FC<Props> = ({ onBack, onNext }) => {
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<DeliveryFormData>({
    resolver: yupResolver(deliverySchema) as Resolver<DeliveryFormData>,
    mode: 'onBlur'
  })

  const onSubmit: SubmitHandler<DeliveryFormData> = (data) => {
    dispatch(setCustomerInfo(data))
    onNext()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">2. Información de entrega</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Correo electrónico */}
        <div>
          <label htmlFor="delivery_email" className="block text-sm font-medium">Correo electrónico</label>
          <input
            id="delivery_email"
            type="email"
            {...register('email')}
            placeholder="correo@ejemplo.com"
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* País / Región */}
        <div>
          <label htmlFor="delivery_country" className="block text-sm font-medium">País / Región</label>
          <select
            id="delivery_country"
            {...register('country')}
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Seleccione</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
        </div>

        {/* Nombre y Apellidos */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="delivery_firstName" className="block text-sm font-medium">Nombre</label>
            <input
              id="delivery_firstName"
              {...register('firstName')}
              placeholder="Juan"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label htmlFor="delivery_lastName" className="block text-sm font-medium">Apellidos</label>
            <input
              id="delivery_lastName"
              {...register('lastName')}
              placeholder="Pérez"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Documento */}
        <div>
          <label htmlFor="delivery_documentNumber" className="block text-sm font-medium">No. de Documento</label>
          <input
            id="delivery_documentNumber"
            {...register('documentNumber')}
            placeholder="123456789"
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          />
          {errors.documentNumber && <p className="text-red-500 text-xs mt-1">{errors.documentNumber.message}</p>}
        </div>

        {/* Dirección */}
        <div>
          <label htmlFor="delivery_address1" className="block text-sm font-medium">Dirección</label>
          <input
            id="delivery_address1"
            {...register('address1')}
            placeholder="Calle 123 #45-67"
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          />
          {errors.address1 && <p className="text-red-500 text-xs mt-1">{errors.address1.message}</p>}
        </div>
        <div>
          <label htmlFor="delivery_address2" className="block text-sm font-medium">Casa, apto, etc. (opcional)</label>
          <input
            id="delivery_address2"
            {...register('address2')}
            placeholder="Apto 302"
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Ciudad / Estado / Código postal */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="delivery_city" className="block text-sm font-medium">Ciudad</label>
            <input
              id="delivery_city"
              {...register('city')}
              placeholder="Medellín"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label htmlFor="delivery_state" className="block text-sm font-medium">Provincia / Estado</label>
            <select
              id="delivery_state"
              {...register('state')}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Seleccione</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
          </div>
          <div>
            <label htmlFor="delivery_postalCode" className="block text-sm font-medium">Código postal (opcional)</label>
            <input
              id="delivery_postalCode"
              {...register('postalCode')}
              placeholder="630001"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="delivery_phone" className="block text-sm font-medium">Teléfono</label>
          <input
            id="delivery_phone"
            {...register('phone')}
            placeholder="+57 3001234567"
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            ← Anterior
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      </form>
    </div>
  )
}

export default DeliveryForm
