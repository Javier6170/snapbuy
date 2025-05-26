import * as yup from 'yup';

export const deliverySchema = yup.object({
  country:        yup.string().required('País requerido'),
  firstName:      yup.string().required('Nombre requerido'),
  lastName:       yup.string().required('Apellido requerido'),
  documentNumber: yup.string().required('Número de documento'),
  email: yup.string().required('Correo electronico requerido'),
  address1:       yup.string().required('Dirección requerida'),
  address2:       yup.string(), // opcional
  city:           yup.string().required('Ciudad requerida'),
  state:          yup.string().required('Provincia/Estado'),
  postalCode:     yup.string(), // opcional
  phone:          yup.string().required('Teléfono requerido'),
  saveInfo:       yup.boolean(),
  sendSmsOffers:  yup.boolean(),
}).required();

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
