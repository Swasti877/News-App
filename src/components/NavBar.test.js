import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from './NavBar';

test('renders NavBar with brand and all navigation links', () => {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>
  );

  // Check for brand
  const brandElement = screen.getByText(/News App/i);
  expect(brandElement).toBeInTheDocument();

  // Check for navigation links
  const navLinks = [
    "Home", "Business", "Entertainment", "General",
    "Health", "Science", "Sports", "Technology", "About"
  ];

  navLinks.forEach(linkText => {
    const linkElement = screen.getByText(new RegExp(linkText, "i"));
    expect(linkElement).toBeInTheDocument();
  });
});
