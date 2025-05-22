// src/components/PaymentModal.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RootState } from '../app/store';
import { setCustomerInfo } from '../features/customer/customerSlice';
import { usePayment } from '../hooks/useWompi';

const BASE_FEE = Number(process.env.REACT_APP_BASE_FEE ?? 3000);
const DELIVERY_FEE = Number(process.env.REACT_APP_DELIVERY_FEE ?? 5000);

const schema = yup.object().shape({
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
    .matches(/^[0-9]{2}$/, 'Debe tener 2 dígitos'),
  cvc: yup
    .string()
    .required('CVC requerido')
    .matches(/^[0-9]{3}$/, 'Debe tener 3 dígitos'),
  name: yup.string().required('Nombre requerido'),
  address: yup.string().required('Dirección requerida'),
  email: yup.string().email('Correo inválido').required('Correo requerido'),
});

type PaymentForm = yup.InferType<typeof schema>;

const PaymentModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { handlePayment, loading, error } = usePayment();
  const product = useSelector((state: RootState) =>
    state.products.items.find(p => p.id === state.cart.productId)
  );
  const quantity = useSelector((state: RootState) => state.cart.quantity);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: PaymentForm) => {
    dispatch(setCustomerInfo({ name: data.name, address: data.address, email: data.email }));
    handlePayment({
      ...data,
      productId: product!.id,
      quantity,
      amountInCents: product!.price * quantity + BASE_FEE + DELIVERY_FEE,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-lg mx-4"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Pago Seguro con Tarjeta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Número de Tarjeta */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Número de tarjeta</label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            {...register('cardNumber')}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>
          )}
        </div>

        {/* Fecha Expiración y CVC */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">MM</label>
            <input
              type="text"
              placeholder="MM"
              {...register('expMonth')}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">YY</label>
            <input
              type="text"
              placeholder="YY"
              {...register('expYear')}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CVC</label>
            <input
              type="text"
              placeholder="123"
              {...register('cvc')}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
        {(errors.expMonth?.message || errors.expYear?.message || errors.cvc?.message) && (
          <p className="text-red-500 text-xs mb-4">
            {errors.expMonth?.message || errors.expYear?.message || errors.cvc?.message}
          </p>
        )}

        {/* Datos de Entrega */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Nombre completo</label>
          <input
            type="text"
            placeholder="Tu nombre"
            {...register('name')}
            className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}

          <label className="block text-sm font-medium mt-4 mb-1">Dirección</label>
          <input
            type="text"
            placeholder="Calle, Ciudad"
            {...register('address')}
            className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}

          <label className="block text-sm font-medium mt-4 mb-1">Correo electrónico</label>
          <input
            type="email"
            placeholder="email@ejemplo.com"
            {...register('email')}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        {/* Error general */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Botones */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Pagar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentModal;
