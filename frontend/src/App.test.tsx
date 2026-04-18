import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it('renders dashboard route', () => {
    render(<App />);
    expect(screen.getByText(/Dashboard del Reclutador/i)).toBeInTheDocument();
  });

  it('has add candidate button', () => {
    render(<App />);
    expect(screen.getByText(/Añadir Nuevo Candidato/i)).toBeInTheDocument();
  });

  it('has navigation links', () => {
    const { container } = render(<App />);
    const links = container.querySelectorAll('a[href]');
    expect(links.length).toBeGreaterThan(0);
  });
});