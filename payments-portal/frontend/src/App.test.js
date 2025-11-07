import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header', () => {
  render(<App />);
  // Navbar title
  const titleElement = screen.getByText(/Secure Portal Bank/i);
  expect(titleElement).toBeInTheDocument();
});
