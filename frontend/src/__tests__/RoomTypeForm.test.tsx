import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import RoomTypeForm from '../components/RoomTypeForm';
import * as api from '../services/api';
import '@testing-library/jest-dom';

jest.mock('../services/api', () => ({
  createRoomType: jest.fn(),
  updateRoomType: jest.fn(),
}));

describe('RoomTypeForm', () => {
  const mockOnSave = jest.fn();

  beforeEach(() => {
    (api.createRoomType as jest.Mock).mockResolvedValue({});
    (api.updateRoomType as jest.Mock).mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el formulario para agregar tipo de habitación', () => {
    render(<RoomTypeForm hotelId={1} onSave={mockOnSave} />);
    expect(screen.getByText('Agregar Tipo de Habitación')).toBeInTheDocument();
    expect(screen.getByText('Tipo:')).toBeInTheDocument();
    expect(screen.getByText('Acomodación:')).toBeInTheDocument();
    expect(screen.getByText('Cantidad:')).toBeInTheDocument();
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2); // Tipo y Acomodación
    expect(screen.getByPlaceholderText('Cantidad')).toBeInTheDocument();
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });

  it('renderiza el formulario para editar tipo de habitación', () => {
    render(<RoomTypeForm hotelId={1} roomType={{ id: 1, tipo: 'SUITE', acomodacion: 'DOBLE', cantidad: 5 }} onSave={mockOnSave} />);
    expect(screen.getByText('Editar Tipo de Habitación')).toBeInTheDocument();
    const selects = screen.getAllByRole('combobox');
    expect(selects[0]).toHaveValue('SUITE'); // Tipo
    expect(selects[1]).toHaveValue('DOBLE'); // Acomodación
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  it('envía datos para crear un tipo de habitación', async () => {
    await act(async () => {
      render(<RoomTypeForm hotelId={1} onSave={mockOnSave} />);
    });

    fireEvent.change(screen.getByPlaceholderText('Cantidad'), { target: { value: '10' } });
    await act(async () => {
      fireEvent.click(screen.getByText('Guardar'));
      await flushPromises();
    });

    await waitFor(() => {
      expect(api.createRoomType).toHaveBeenCalledWith(1, {
        tipo: 'ESTANDAR',
        acomodacion: 'SENCILLA',
        cantidad: 10,
      });
      expect(mockOnSave).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('actualiza las acomodaciones según el tipo', async () => {
    await act(async () => {
      render(<RoomTypeForm hotelId={1} onSave={mockOnSave} />);
    });

    const typeSelect = screen.getAllByRole('combobox')[0]; // Primer combobox es "Tipo"
    fireEvent.change(typeSelect, { target: { value: 'JUNIOR' } });
    expect(screen.getByRole('option', { name: 'Triple' })).toBeInTheDocument();
    expect(screen.queryByText('Sencilla')).not.toBeInTheDocument();
  });
});

// Función auxiliar para esperar promesas pendientes
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));