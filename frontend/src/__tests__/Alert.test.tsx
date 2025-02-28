import { render, screen, fireEvent } from '@testing-library/react';
import Alert from '../components/Alert';
import '@testing-library/jest-dom';

describe('Alert', () => {
  it('no renderiza cuando isOpen es false', () => {
    render(<Alert isOpen={false} onClose={() => {}} message="Test" />);
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });

  it('renderiza mensaje de error cuando isConfirmation es false', () => {
    render(<Alert isOpen={true} onClose={() => {}} message="Error occurred" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    expect(screen.getByText('Cerrar')).toBeInTheDocument();
  });

  it('renderiza confirmación cuando isConfirmation es true', () => {
    const mockOnConfirm = jest.fn();
    render(<Alert isOpen={true} onClose={() => {}} message="Confirm?" onConfirm={mockOnConfirm} isConfirmation={true} />);
    expect(screen.getByText('Confirmación')).toBeInTheDocument();
    expect(screen.getByText('Confirm?')).toBeInTheDocument();
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('llama a onConfirm al confirmar', () => {
    const mockOnConfirm = jest.fn();
    render(<Alert isOpen={true} onClose={() => {}} message="Confirm?" onConfirm={mockOnConfirm} isConfirmation={true} />);
    fireEvent.click(screen.getByText('Confirmar'));
    expect(mockOnConfirm).toHaveBeenCalled();
  });
});