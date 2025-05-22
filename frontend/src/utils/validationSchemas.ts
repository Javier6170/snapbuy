import * as yup from 'yup';

export const deliverySchema = yup.object({
  name: yup
    .string()
    .required('Nombre es obligatorio'),
  address: yup
    .string()
    .required('Dirección es obligatoria'),
  email: yup
    .string()
    .email('Correo inválido')
    .required('Correo es obligatorio'),
});


export const paymentSchema = deliverySchema.concat(
  yup.object({
    cardNumber: yup
      .string()
      .required('Número de tarjeta requerido')
      .matches(/^[0-9]{16}$/, 'Debe tener 16 dígitos'),
    expMonth: yup
      .string()
      .required('Mes requerido')
      .matches(/^(0[1-9]|1[0-2])$/, 'Mes inválido (01–12)'),
    expYear: yup
      .string()
      .required('Año requerido')
      .matches(/^[0-9]{2}$/, 'Debe tener dos dígitos'),
    cvc: yup
      .string()
      .required('CVC requerido')
      .matches(/^[0-9]{3}$/, 'Debe tener 3 dígitos'),
  })
);

export type DeliveryFormData = yup.InferType<typeof deliverySchema>;
export type PaymentFormData = yup.InferType<typeof paymentSchema>;
