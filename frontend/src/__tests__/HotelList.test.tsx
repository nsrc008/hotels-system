import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HotelList from '../components/HotelList';
import * as api from '../services/api';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para mockearlo
import '@testing-library/jest-dom';

// Mock global de las funciones de la API
jest.mock('../services/api', () => ({
  getHotels: jest.fn(),
  deleteHotel: jest.fn(),
}));

// Mock global de react-router-dom
jest.mock('react-router-dom', () => {
  const actualModule = jest.requireActual('react-router-dom'); // Usamos las funcionalidades reales
  return {
    ...actualModule,
    useNavigate: jest.fn(), // Mockeamos useNavigate como una función vacía
  };
});

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
    });

    await waitFor(() => {
      expect(screen.getByText('Lista de Hoteles')).toBeInTheDocument();
      expect(screen.getByText('Hotel A')).toBeInTheDocument();
      expect(screen.getByText('Calle 1, Ciudad A')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('abre el modal al hacer clic en Agregar Hotel', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <HotelList />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('add-hotel-button')).toBeInTheDocument();
    }, { timeout: 2000 });

    fireEvent.click(screen.getByTestId('add-hotel-button'));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /agregar hotel/i })).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('muestra confirmación al hacer clic en el ícono Eliminar', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <HotelList />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('delete-hotel-1')).toBeInTheDocument();
    }, { timeout: 2000 });

    fireEvent.click(screen.getByTestId('delete-hotel-1'));
    expect(screen.getByText('¿Seguro que quieres eliminar este hotel?')).toBeInTheDocument();
  });

  it('elimina un hotel al confirmar', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <HotelList />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('delete-hotel-1')).toBeInTheDocument();
    }, { timeout: 2000 });

    await act(async () => {
      fireEvent.click(screen.getByTestId('delete-hotel-1'));
      await waitFor(() => {
        expect(screen.getByText('Confirmar')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Confirmar'));
    });

    await waitFor(() => {
      expect(api.deleteHotel).toHaveBeenCalledWith(1);
    }, { timeout: 2000 });
  });

  it('navega a los detalles al hacer clic en la card', async () => {
    const mockNavigate = jest.fn();
    // Sobreescribimos el mock de useNavigate para esta prueba específica
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    await act(async () => {
      render(
        <MemoryRouter>
          <HotelList />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('hotel-card-1')).toBeInTheDocument();
    }, { timeout: 2000 });

    fireEvent.click(screen.getByTestId('hotel-card-1'));
    expect(mockNavigate).toHaveBeenCalledWith('/hoteles/1');
  });
});