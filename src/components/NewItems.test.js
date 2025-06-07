import { render, screen } from '@testing-library/react';
import NewItems from './NewItems';

describe('NewItems Component', () => {
  const defaultProps = {
    title: "Test Title",
    description: "Test Description that is long enough to be truncated eventually. This is a test description.",
    imgURL: "http://example.com/image.jpg",
    newsURL: "http://example.com/news",
    author: "Test Author",
    date: "2023-10-27T10:00:00Z",
    source: "Test Source"
  };

  const defaultImageUrl = "https://techcrunch.com/wp-content/uploads/2022/01/dumb-car2.jpg?w=711";

  test('renders with all props', () => {
    render(<NewItems {...defaultProps} />);

    expect(screen.getByText(defaultProps.title.length > 88 ? defaultProps.title.slice(0,88) + "..." : defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description.length > 88 ? defaultProps.description.slice(0,88) + "..." : defaultProps.description)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', defaultProps.imgURL);
    expect(screen.getByText(`By ${defaultProps.author}`)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.source)).toBeInTheDocument();
    // Check date - assuming it's formatted as "new Date(date).toGMTString()" in the component
    // This might need adjustment based on actual date formatting in NewItems.js
    expect(screen.getByText(new Date(defaultProps.date).toGMTString())).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Read More/i })).toHaveAttribute('href', defaultProps.newsURL);
  });

  test('renders with default image when imgURL is null', () => {
    render(<NewItems {...defaultProps} imgURL={null} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', defaultImageUrl);
  });

  test('renders "Unknown" author when author is null', () => {
    render(<NewItems {...defaultProps} author={null} />);
    expect(screen.getByText(/By Unknown/i)).toBeInTheDocument();
  });

  test('renders "Unknown" author when author is empty string', () => {
    render(<NewItems {...defaultProps} author={""} />);
    expect(screen.getByText(/By Unknown/i)).toBeInTheDocument();
  });

  test('truncates long title', () => {
    const longTitle = "This is a very long title that definitely exceeds the eighty-eight character limit to test truncation.";
    render(<NewItems {...defaultProps} title={longTitle} />);
    expect(screen.getByText(longTitle.slice(0, 88) + "...")).toBeInTheDocument();
  });

  test('truncates long description', () => {
    const longDescription = "This is a very long description that definitely exceeds the eighty-eight character limit to test truncation. We need to make sure this works as expected, so adding more text here.";
    render(<NewItems {...defaultProps} description={longDescription} />);
    expect(screen.getByText(longDescription.slice(0, 88) + "...")).toBeInTheDocument();
  });

  test('does not truncate short title', () => {
    const shortTitle = "Short Title";
    render(<NewItems {...defaultProps} title={shortTitle} />);
    expect(screen.getByText(shortTitle)).toBeInTheDocument();
  });

  test('does not truncate short description', () => {
    const shortDescription = "Short Description.";
    render(<NewItems {...defaultProps} description={shortDescription} />);
    expect(screen.getByText(shortDescription)).toBeInTheDocument();
  });

  test('handles missing title gracefully (null)', () => {
    render(<NewItems {...defaultProps} title={null} />);
    // Assuming it renders an empty string or specific placeholder.
    // If it's designed to hide the element or show specific text, adjust the assertion.
    // For this example, let's assume it renders an empty title string (or the logic within the component handles it)
    // and we check that the component doesn't crash and other elements are still there.
    expect(screen.getByText(defaultProps.description.slice(0,88) + "...")).toBeInTheDocument(); // Check another element
  });

  test('handles missing description gracefully (null)', () => {
    render(<NewItems {...defaultProps} description={null} />);
    // Similar to title, adjust based on actual component behavior.
    // Let's assume it renders an empty description string.
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument(); // Check another element
  });

  test('handles empty string title gracefully', () => {
    render(<NewItems {...defaultProps} title="" />);
    // Check that it doesn't crash and other elements are present
    expect(screen.getByText(defaultProps.description.slice(0,88) + "...")).toBeInTheDocument();
  });

  test('handles empty string description gracefully', () => {
    render(<NewItems {...defaultProps} description="" />);
    // Check that it doesn't crash and other elements are present
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });
});
