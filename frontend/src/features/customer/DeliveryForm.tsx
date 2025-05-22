// src/features/customer/DeliveryForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { setCustomerInfo } from './customerSlice';
import { deliverySchema, DeliveryFormData } from '../../utils/validationSchemas';

const DeliveryForm: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryFormData>({
    resolver: yupResolver(deliverySchema),
  });

  const onSubmit = (data: DeliveryFormData) => {
    dispatch(setCustomerInfo(data));
    onNext(); // avanza al resumen
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Información de entrega</h2>

      <div className="mb-3">
        <label className="block mb-1">Nombre</label>
        <input {...register('name')} className="input w-full" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div className="mb-3">
        <label className="block mb-1">Dirección</label>
        <input {...register('address')} className="input w-full" />
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
      </div>

      <div className="mb-3">
        <label className="block mb-1">Correo electrónico</label>
        <input {...register('email')} className="input w-full" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <button type="submit" className="btn-primary w-full mt-4">
        Continuar
      </button>
    </form>
  );
};

export default DeliveryForm;
