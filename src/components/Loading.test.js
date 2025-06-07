import { render, screen } from '@testing-library/react';
import Loading from './Loading';

test('renders loading text', () => {
  render(<Loading />);
  const loadingElement = screen.getByText(/Loading.../i);
  expect(loadingElement).toBeInTheDocument();
});
