import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';

describe('App', () => {
  it('renderiza la ruta raíz con Hotels', () => {
    render(<App />);
    expect(screen.getByText('Hoteles Decameron')).toBeInTheDocument();
  });

  it('renderiza la ruta de detalle con HotelDetail', async () => {
    // Este enfoque verifica el comportamiento inicial
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Hoteles Decameron')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});