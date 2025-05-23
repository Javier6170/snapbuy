import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { setCustomerInfo } from './customerSlice';
import { deliverySchema, DeliveryFormData } from '../../utils/validationSchemas';

interface Props {
  onBack(): void;
  onNext(): void;
}

const DeliveryForm: React.FC<Props> = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } =
    useForm<DeliveryFormData>({ resolver: yupResolver(deliverySchema) });

  const submit = (data: DeliveryFormData) => {
    dispatch(setCustomerInfo(data));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium">Nombre completo</label>
        <input {...register('name')}
          className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-300"
          placeholder="Juan Pérez"/>
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Dirección</label>
        <input {...register('address')}
          className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-300"
          placeholder="Calle 123 #45-67"/>
        {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Correo electrónico</label>
        <input {...register('email')}
          className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-300"
          placeholder="correo@ejemplo.com"/>
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack}
          className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          Anterior
        </button>
        <button type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Siguiente
        </button>
      </div>
    </form>
  );
};

export default DeliveryForm;