// src/components/PaymentModal.tsx
import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller, Resolver } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { RootState } from '../app/store';
import { usePayment } from '../hooks/useWompi';
import mastercardLogo from '../assets/mastercard.svg';
import visaLogo from '../assets/visa.svg';
import amexLogo from '../assets/americanexpress.svg';


const BASE_FEE = Number(process.env.REACT_APP_BASE_FEE ?? 3000);
const DELIVERY_FEE = Number(process.env.REACT_APP_DELIVERY_FEE ?? 5000);

// --- Validación con Yup ---
const schema = yup.object({
  cardNumber: yup.string().required('Número de tarjeta requerido').matches(/^[0-9]{16}$/, 'Debe tener 16 dígitos'),
  expMonth: yup.string().required('Mes requerido'),
  expYear: yup.string().required('Año requerido'),
  cvc: yup.string().required('CVC requerido').matches(/^[0-9]{3,4}$/, '3 o 4 dígitos'),
  name: yup.string().required('Nombre en tarjeta requerido'),
  idType: yup.string().required('Tipo de documento requerido'),
  idNumber: yup.string().required('Número de documento requerido'),
  installments: yup.string().required('Debes seleccionar número de cuotas'),
  acceptTerms: yup.boolean().oneOf([true], 'Debes aceptar el reglamento'),
  acceptData: yup.boolean().oneOf([true], 'Debes autorizar tratamiento de datos'),
}).required();

type FormData = yup.InferType<typeof schema>;

// Detección de marca de tarjeta
const detectBrand = (num: string) => {
  if (/^4/.test(num)) return 'visa';
  if (/^5[1-5]/.test(num)) return 'mastercard';
  if (/^3[47]/.test(num)) return 'amex';
  return null;
};

const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString().slice(-2));



// Overlay de carga
const LoadingOverlay: React.FC = () => (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-2">
      <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <span>Procesando pago...</span>
    </div>
  </div>
);

const PaymentModal: React.FC<{ onBack: () => void; onNext: () => void }> = ({ onBack, onNext }) => {
  const { handlePayment, loading } = usePayment();
  const customer = useSelector((s: RootState) => s.customer);
  const {
    address1,
    address2,
    city,
    state: region,
    postalCode,
    country,
    phone,
    email,
    firstName,
    lastName,
  } = customer;

  const deliveryInfo = {
    addressLine1: address1,
    addressLine2: address2,
    city,
    state: region,
    postalCode: postalCode || '',
    country,
    phone,
  };

  const cartItems = useSelector((s: RootState) => s.cart.items);
  const products = useSelector((s: RootState) => s.products.items);

  if (!cartItems.length) throw new Error('Carrito vacío');

  const itemsWithDetails = cartItems
    .map(ci => {
      const prod = products.find(p => p.id === ci.productId);
      return prod ? { id: prod.id, price: prod.price, quantity: ci.quantity } : null;
    })
    .filter(Boolean) as Array<{ id: string; price: number; quantity: number }>;

  const subtotal = itemsWithDetails.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const totalInPesos = subtotal + BASE_FEE + DELIVERY_FEE;
  const amountInCents = totalInPesos * 100;

  const formResolver = yupResolver(schema) as Resolver<FormData>;
  const { control, register, handleSubmit, watch, formState: { errors } } =
    useForm<FormData>({
      resolver: formResolver,
      defaultValues: {
        cardNumber: '',
        expMonth: '',
        expYear: '',
        cvc: '',
        name: '',
        idType: '',
        idNumber: '',
        installments: '',
        acceptTerms: false,
        acceptData: false,
      }
    });

  const selectedInstallments = Number(watch('installments')) || 0;


  const rawCard = watch('cardNumber');
  const brand = detectBrand(rawCard);

  useEffect(() => {
    const onUnload = (e: BeforeUnloadEvent) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [loading]);

  const onSubmit: SubmitHandler<FormData> = data =>
    handlePayment({
      cardNumber: data.cardNumber,
      expMonth: data.expMonth,
      expYear: data.expYear,
      cvc: data.cvc,
      name: data.name,
      address: customer.address1,
      email: customer.email,
      amountInCents,
      products: itemsWithDetails.map(it => ({ productId: it.id, quantity: it.quantity })),
      documentType: data.idType,
      documentNumber: data.idNumber,
      installments: Number(data.installments),
      deliveryInfo,
    }).finally(onNext);

  const iconClass = (ic: string) =>
    `h-6 transition-opacity ${brand === ic ? 'opacity-100' : 'opacity-30'}`;

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className="flex items-center justify-center gap-2 mb-6 text-green-600">
        <h2 className="text-2xl font-bold">Pago seguro</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-4 justify-center mb-4">
          <img src={visaLogo} alt="Visa" className={iconClass('visa')} />
          <img src={mastercardLogo} alt="Mastercard" className={iconClass('mastercard')} />
          <img src={amexLogo} alt="Amex" className={iconClass('amex')} />
        </div>

        <Controller
          name="cardNumber"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => {
            const raw = value.replace(/\D/g, '').slice(0, 16);
            const display = raw.match(/.{1,4}/g)?.join(' ') || '';
            return (
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                  Número de tarjeta
                </label>
                <input
                  id="cardNumber"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="•••• •••• •••• ••••"
                  value={display}
                  onChange={e => onChange(e.currentTarget.value.replace(/\s+/g, ''))}
                  onBlur={onBlur}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>
                )}
              </div>
            );
          }}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mes</label>
            <Controller
              name="expMonth"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  autoComplete="cc-exp-month"
                  className="w-full border rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Mes</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              )}
            />
            {errors.expMonth && <p className="text-red-500 text-xs mt-1">{errors.expMonth.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Año</label>
            <Controller
              name="expYear"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  autoComplete="cc-exp-year"
                  className="w-full border rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Año</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              )}
            />
            {errors.expYear && <p className="text-red-500 text-xs mt-1">{errors.expYear.message}</p>}
          </div>
          <div className="col-span-2 relative">
            <label htmlFor="cvc" className="block text-sm font-medium mb-1">
              CVC
              <span title="Código de seguridad en reverso" className="ml-1 text-gray-400 cursor-help">?</span>
            </label>
            <input
              id="cvc"
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={4}
              {...register('cvc')}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Nombre en tarjeta ocupa las dos columnas */}
          <div className="col-span-2">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre en tarjeta
            </label>
            <input
              id="name"
              placeholder="JUAN PEREZ"
              autoComplete="cc-name"
              {...register('name')}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 uppercase"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Tipo de documento */}
          <div>
            <label htmlFor="idType" className="block text-sm font-medium mb-1">
              Tipo doc.
            </label>
            <Controller
              name="idType"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full border rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Seleccione</option>
                  <option value="CC">Cédula ciudadanía</option>
                  <option value="CE">Cédula extranjería</option>
                  <option value="TI">Tarjeta identidad</option>
                </select>
              )}
            />
            {errors.idType && <p className="text-red-500 text-xs mt-1">{errors.idType.message}</p>}
          </div>

          {/* Número de documento */}
          <div>
            <label htmlFor="idNumber" className="block text-sm font-medium mb-1">
              Número doc.
            </label>
            <input
              id="idNumber"
              autoComplete="id-number"
              {...register('idNumber')}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 uppercase"
            />
            {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber.message}</p>}
          </div>
        </div>


        <div>
          <label htmlFor="installments" className="block text-sm font-medium mb-1">
            Cuotas
          </label>
          <Controller
            name="installments"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="installments"
                className="w-full border rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Seleccione</option>
                {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            )}
          />
          {errors.installments && (
            <p className="text-red-500 text-xs mt-1">
              {errors.installments.message}
            </p>
          )}

          
        </div>




        <div className="space-y-2">
          <div className="flex items-center">
            <input id="acceptTerms" type="checkbox" {...register('acceptTerms')} className="mr-2" />
            <label htmlFor="acceptTerms" className="text-sm">Acepto el reglamento</label>
          </div>
          {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms.message}</p>}
          <div className="flex items-center">
            <input id="acceptData" type="checkbox" {...register('acceptData')} className="mr-2" />
            <label htmlFor="acceptData" className="text-sm">Autorizo tratamiento datos</label>
          </div>
          {errors.acceptData && <p className="text-red-500 text-xs">{errors.acceptData.message}</p>}
        </div>

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
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Pagar con tarjeta de credito'}
          </button>
        </div>
      </form>
    </>
  );
};

export default React.memo(PaymentModal);
