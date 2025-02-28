import { render, screen } from '@testing-library/react';
import App from '../App';

// Mockear las solicitudes de api.ts
jest.mock('../services/api', () => ({
  getHotels: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, nombre: 'Hotel A', direccion: 'Calle 1', ciudad: 'Ciudad A', nit: '123', numero_habitaciones: 20 },
      ],
    })
  ),
}));

describe('App', () => {
  it('renders hotel list', async () => {
    render(<App />);
    expect(await screen.findByText(/Hotel A/)).toBeInTheDocument();
  });
});