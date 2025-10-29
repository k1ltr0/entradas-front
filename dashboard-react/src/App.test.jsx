import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  },
  writable: true,
});

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Since the app redirects to login when no token, we should find login elements
    expect(screen.getByRole('heading', { name: /Sign in/i })).toBeInTheDocument();
  });
});
