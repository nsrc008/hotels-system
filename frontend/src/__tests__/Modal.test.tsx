import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../components/Modal';
import '@testing-library/jest-dom';

describe('Modal', () => {
  it('no renderiza cuando isOpen es false', () => {
    render(<Modal isOpen={false} onClose={() => {}}>Contenido</Modal>);
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });

  it('renderiza contenido y título cuando isOpen es true', () => {
    render(<Modal isOpen={true} onClose={() => {}}>Contenido</Modal>);
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it('cierra el modal al hacer clic en el botón cerrar', () => {
    const mockOnClose = jest.fn();
    render(<Modal isOpen={true} onClose={mockOnClose}>Contenido</Modal>);
    fireEvent.click(screen.getByText('×'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});