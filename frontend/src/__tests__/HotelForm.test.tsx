import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HotelForm from '../components/HotelForm';
import * as api from '../services/api';
import '@testing-library/jest-dom';

// Mock global de las funciones de la API
jest.mock('../services/api', () => ({
  createHotel: jest.fn(),
  updateHotel: jest.fn(), // Añadimos el mock para updateHotel
}));

describe('HotelForm', () => {
  beforeEach(() => {
    (api.createHotel as jest.Mock).mockResolvedValue({});
    (api.updateHotel as jest.Mock).mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza todos los campos y botones en modo agregar', () => {
    render(
      <MemoryRouter>
        <HotelForm />
      </MemoryRouter>
    );

    expect(screen.getByText('Agregar Hotel')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Dirección')).toBeInTheDocument();
    expect(screen.getByText('Ciudad')).toBeInTheDocument();
    expect(screen.getByText('NIT')).toBeInTheDocument();
    expect(screen.getByText('Número de Habitaciones')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese el nombre del hotel')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese la dirección del hotel')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese la ciudad')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese el NIT del hotel')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese el número de habitaciones')).toBeInTheDocument();
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });

  it('envía el formulario con datos válidos en modo agregar', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <HotelForm />
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByPlaceholderText('Ingrese el nombre del hotel'), { target: { value: 'Hotel Test' } });
    fireEvent.change(screen.getByPlaceholderText('Ingrese la dirección del hotel'), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByPlaceholderText('Ingrese la ciudad'), { target: { value: 'Ciudad Test' } });
    fireEvent.change(screen.getByPlaceholderText('Ingrese el NIT del hotel'), { target: { value: '456' } });
    fireEvent.change(screen.getByPlaceholderText('Ingrese el número de habitaciones'), { target: { value: '20' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Guardar'));
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

  it('renderiza datos existentes y envía actualización en modo editar', async () => {
    const mockHotel = {
      id: 1,
      nombre: 'Hotel Edit',
      direccion: 'Calle Edit',
      ciudad: 'Ciudad Edit',
      nit: '789',
      numero_habitaciones: 30,
    };

    await act(async () => {
      render(
        <MemoryRouter>
          <HotelForm hotel={mockHotel} />
        </MemoryRouter>
      );
    });

    // Verifica que los campos se llenen con los datos del hotel
    await waitFor(() => {
      expect(screen.getByText('Editar Hotel')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Hotel Edit')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Calle Edit')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Ciudad Edit')).toBeInTheDocument();
      expect(screen.getByDisplayValue('789')).toBeInTheDocument();
      expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Modifica un campo y envía el formulario
    fireEvent.change(screen.getByPlaceholderText('Ingrese el nombre del hotel'), { target: { value: 'Hotel Updated' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Guardar'));
    });

    await waitFor(() => {
      expect(api.updateHotel).toHaveBeenCalledWith(1, {
        nombre: 'Hotel Updated',
        direccion: 'Calle Edit',
        ciudad: 'Ciudad Edit',
        nit: '789',
        numero_habitaciones: 30,
      });
    }, { timeout: 2000 });
  });
});