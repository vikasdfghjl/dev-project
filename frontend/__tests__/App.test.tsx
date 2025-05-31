import { render, screen } from '@testing-library/react';
import App from '../App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders the main layout', () => {
    render(<App />);
    // Check for header (role=banner) and sidebar (role=complementary)
    expect(screen.getByRole('banner')).toBeDefined();
    expect(screen.getByRole('complementary')).toBeDefined();
    expect(screen.getByRole('main')).toBeDefined();
  });
});
