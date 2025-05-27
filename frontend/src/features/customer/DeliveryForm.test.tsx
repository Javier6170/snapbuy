// src/features/customer/DeliveryForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeliveryForm from './DeliveryForm';
import { setCustomerInfo } from './customerSlice';
import * as redux from 'react-redux';
import { deliverySchema, DeliveryFormData } from '../../utils/validationSchemas';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('DeliveryForm component', () => {
  const mockDispatch = jest.fn();
  const mockOnBack = jest.fn();
  const mockOnNext = jest.fn();

  beforeEach(() => {
    (redux.useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  it('renders all fields and back button', () => {
    render(<DeliveryForm onBack={mockOnBack} onNext={mockOnNext} />);
    expect(screen.getByRole('heading', { name: /Información de entrega/i })).toBeInTheDocument();
    // Check presence of a few fields
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/País \/ Región/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/No\. de Documento/i)).toBeInTheDocument();
    // Back button
    expect(screen.getByRole('button', { name: /Anterior/i })).toBeInTheDocument();
  });

  it('calls onBack when clicking the back button', () => {
    render(<DeliveryForm onBack={mockOnBack} onNext={mockOnNext} />);
    fireEvent.click(screen.getByRole('button', { name: /Anterior/i }));
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<DeliveryForm onBack={mockOnBack} onNext={mockOnNext} />);
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));
    await waitFor(() => {
      // should show at least one required-field error
      expect(screen.getByText(/Correo electrónico requerido|Correo electrónico es obligatorio|/i)).toBeInTheDocument();
    });
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('dispatches setCustomerInfo and calls onNext when form is valid', async () => {
    render(<DeliveryForm onBack={mockOnBack} onNext={mockOnNext} />);
    // Fill in valid data
    const validData: DeliveryFormData = {
      email: 'test@example.com',
      country: 'Colombia',
      firstName: 'Juan',
      lastName: 'Pérez',
      documentNumber: '12345678',
      address1: 'Calle 123',
      address2: 'Apto 4',
      city: 'Bogotá',
      state: 'Cundinamarca',
      postalCode: '110111',
      phone: '3001234567',
      saveInfo: false,
      sendSmsOffers: false,
    };
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: validData.email } });
    fireEvent.change(screen.getByLabelText(/País \/ Región/i), { target: { value: validData.country } });
    fireEvent.change(screen.getByLabelText(/^Nombre$/i), { target: { value: validData.firstName } });
    fireEvent.change(screen.getByLabelText(/Apellidos/i), { target: { value: validData.lastName } });
    fireEvent.change(screen.getByLabelText(/No\. de Documento/i), {
      target: { value: validData.documentNumber },
    });
    fireEvent.change(screen.getByLabelText(/Dirección$/i), { target: { value: validData.address1 } });
    fireEvent.change(screen.getByLabelText(/Casa, apto/i), { target: { value: validData.address2! } });
    fireEvent.change(screen.getByLabelText(/Ciudad/i), { target: { value: validData.city } });
    fireEvent.change(screen.getByLabelText(/Provincia \/ Estado/i), { target: { value: validData.state } });
    fireEvent.change(screen.getByLabelText(/Código postal/i), { target: { value: validData.postalCode! } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: validData.phone } });

    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    await waitFor(() => {
      // dispatch with the valid data
      expect(mockDispatch).toHaveBeenCalledWith(setCustomerInfo(validData));
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(mockOnNext).toHaveBeenCalled();
    });
  });
});
