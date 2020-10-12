import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders loading tag', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/loading/i);
  expect(linkElement).toBeInTheDocument();
});
