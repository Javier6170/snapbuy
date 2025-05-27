import * as yup from 'yup';

export const deliverySchema = yup.object({
  country:        yup.string().required('País requerido'),
  firstName:      yup.string().min(1, 'El primer nombre debe tener al menos 1 caracteres').required('Nombre requerido'),
  lastName:       yup.string().required('Apellido requerido'),
  documentNumber: yup.string().min(6, 'El numero de document debe tener al menos 6 caracteres').required('Número de documento'),
  email:          yup.string().email('Formato de correo inválido').required('Correo electronico requerido'),
  address1:       yup.string().min(5, 'La dirección debe tener al menos 5 caracteres').required('Dirección requerida'),
  address2:       yup.string(), // opcional
  city:           yup.string().required('Ciudad requerida'),
  state:          yup.string().required('Provincia/Estado'),
  postalCode:     yup.string(), // opcional
  phone:          yup.string().min(10, 'El telefono debe tener al menos 10 caracteres').required('Teléfono requerido'),
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
