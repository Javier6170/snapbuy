import { useDispatch, UseDispatch } from "react-redux"
import { setTransactionFailed } from "../features/transaction/transactionSlice"; 
import { useState } from "react";



export const usePaymentInfo = () => {
    const dispatch = useDispatch();
    const [error, setError] = useState<string | null>(null);

    const savePayment = async (data: any, customer: any) => {
        try {
            const paymentRes = await fetch(
                `/api/payments`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customerId: customer.id,
                        customerEmail: data.email,
                        amountInCents: data.amountInCents,
                        cardNumber: data.cardNumber,
                        cvc: data.cvc,
                        expMonth: data.expMonth,
                        expYear: data.expYear,
                        name: data.name,

                        documentType: data.documentType,
                        documentNumber: data.documentNumber,
                        installments: data.installments,

                        products: data.products,
                        deliveryInfo: data.deliveryInfo,
                    }),
                }
            );
            return paymentRes;
        } catch (err: any) {
            dispatch(setTransactionFailed({ message: err.message }));
            setError(err.message);
            return false;
        }
    }

    return { savePayment, error };
}