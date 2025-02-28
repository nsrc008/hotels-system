import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HotelList from '../components/HotelList';
import * as api from '../services/api';
import '@testing-library/jest-dom';

jest.mock('../services/api', () => ({
  getHotels: jest.fn(),
  deleteHotel: jest.fn(),
}));

describe('HotelList', () => {
  const mockHotels = [
    { id: 1, nombre: 'Hotel A', direccion: 'Calle 1', ciudad: 'Ciudad A', nit: '123', numero_habitaciones: 10 },
  ];

  beforeEach(() => {
    (api.getHotels as jest.Mock).mockResolvedValue({ data: mockHotels });
    (api.deleteHotel as jest.Mock).mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza la lista de hoteles al cargar', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <HotelList />
        </MemoryRouter>
      );
      await flushPromises();
    });

    await waitFor(() => {
      expect(screen.getByText('Lista de Hoteles')).toBeInTheDocument();
      expect(screen.getByText('Hotel A')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('abre el modal al hacer clic en Agregar Hotel', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <HotelList />
        </MemoryRouter>
      );
      await flushPromises();
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /agregar hotel/i })).toBeInTheDocument();
    }, { timeout: 2000 });

    fireEvent.click(screen.getByRole('button', { name: /agregar hotel/i }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /agregar hotel/i })).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('muestra confirmación al hacer clic en Eliminar', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <HotelList />
        </MemoryRouter>
      );
      await flushPromises();
    });

    await waitFor(() => {
      expect(screen.getByText('Eliminar')).toBeInTheDocument();
    }, { timeout: 2000 });

    fireEvent.click(screen.getByText('Eliminar'));
    expect(screen.getByText('¿Seguro que quieres eliminar este hotel?')).toBeInTheDocument();
  });

  it('elimina un hotel al confirmar', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <HotelList />
        </MemoryRouter>
      );
      await flushPromises();
    });

    await waitFor(() => {
      expect(screen.getByText('Eliminar')).toBeInTheDocument();
    }, { timeout: 2000 });

    await act(async () => {
      fireEvent.click(screen.getByText('Eliminar'));
      await waitFor(() => {
        expect(screen.getByText('Confirmar')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Confirmar'));
      await flushPromises();
    });

    await waitFor(() => {
      expect(api.deleteHotel).toHaveBeenCalledWith(1);
    }, { timeout: 2000 });
  });
});

// Función auxiliar para esperar promesas pendientes
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));