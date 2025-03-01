import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import HotelDetail from '../pages/HotelDetail';
import * as api from '../services/api';
import '@testing-library/jest-dom';

// Mock global de las funciones de la API
jest.mock('../services/api', () => ({
  getHotel: jest.fn(),
  deleteHotel: jest.fn(),
  deleteRoomType: jest.fn(),
}));

const mockHotel = {
  id: 1,
  nombre: 'Hotel A',
  direccion: 'Calle 1',
  ciudad: 'Ciudad A',
  nit: '123',
  numero_habitaciones: 20,
  tipos_habitacion: [{ id: 1, tipo: 'ESTANDAR', acomodacion: 'SENCILLA', cantidad: 10 }],
};

// Configura el mock antes de todas las pruebas
beforeAll(() => {
  (api.getHotel as jest.Mock).mockResolvedValue({ data: mockHotel });
  (api.deleteHotel as jest.Mock).mockResolvedValue({});
  (api.deleteRoomType as jest.Mock).mockResolvedValue({});
});

describe('HotelDetail', () => {
  beforeEach(() => {
    // No limpiar mocks aquí para preservar las configuraciones iniciales
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza los detalles del hotel al cargar', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/hoteles/1']}>
          <Routes>
            <Route path="/hoteles/:id" element={<HotelDetail />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(api.getHotel).toHaveBeenCalledWith(1);
      expect(screen.getByText('Hotel A')).toBeInTheDocument();
      // Buscar texto dividido usando una función personalizada
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Dirección: Calle 1';
      })).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Ciudad: Ciudad A';
      })).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'NIT: 123';
      })).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Número de Habitaciones: 20';
      })).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('abre el modal para agregar tipo de habitación', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/hoteles/1']}>
          <Routes>
            <Route path="/hoteles/:id" element={<HotelDetail />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('add-room-type-button')).toBeInTheDocument();
    }, { timeout: 2000 });

    fireEvent.click(screen.getByTestId('add-room-type-button'));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /agregar tipo de habitación/i })).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('elimina un tipo de habitación al confirmar', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/hoteles/1']}>
          <Routes>
            <Route path="/hoteles/:id" element={<HotelDetail />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('delete-room-1')).toBeInTheDocument();
    }, { timeout: 2000 });

    await act(async () => {
      fireEvent.click(screen.getByTestId('delete-room-1'));
      await waitFor(() => {
        expect(screen.getByText('Confirmar')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Confirmar'));
    });

    await waitFor(() => {
      expect(api.deleteRoomType).toHaveBeenCalledWith(1, 1);
    }, { timeout: 2000 });
  });
});