import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HotelForm from '../components/HotelForm';
import * as api from '../services/api';
import '@testing-library/jest-dom';

jest.mock('../services/api', () => ({
  createHotel: jest.fn(),
}));

describe('HotelForm', () => {
  beforeEach(() => {
    (api.createHotel as jest.Mock).mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza todos los campos y botones', () => {
    render(
      <MemoryRouter>
        <HotelForm />
      </MemoryRouter>
    );
    expect(screen.getByText('Agregar Hotel')).toBeInTheDocument();
    expect(screen.getByText('Nombre:')).toBeInTheDocument();
    expect(screen.getByText('Dirección:')).toBeInTheDocument();
    expect(screen.getByText('Ciudad:')).toBeInTheDocument();
    expect(screen.getByText('NIT:')).toBeInTheDocument();
    expect(screen.getByText('Número de Habitaciones:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Dirección')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ciudad')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('NIT')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Número de Habitaciones')).toBeInTheDocument();
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });

  it('envía el formulario con datos válidos', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <HotelForm />
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Hotel Test' } });
    fireEvent.change(screen.getByPlaceholderText('Dirección'), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByPlaceholderText('Ciudad'), { target: { value: 'Ciudad Test' } });
    fireEvent.change(screen.getByPlaceholderText('NIT'), { target: { value: '456' } });
    fireEvent.change(screen.getByPlaceholderText('Número de Habitaciones'), { target: { value: '20' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Guardar'));
      await flushPromises();
    });

    await waitFor(() => {
      expect(api.createHotel).toHaveBeenCalledWith({
        nombre: 'Hotel Test',
        direccion: 'Calle 123',
        ciudad: 'Ciudad Test',
        nit: '456',
        numero_habitaciones: 20,
      });
    }, { timeout: 2000 });
  });
});

// Función auxiliar para esperar promesas pendientes
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));