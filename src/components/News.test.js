import { render, screen, waitFor } from '@testing-library/react';
import News from './News';

// Mock global fetch
global.fetch = jest.fn();
// Mock setProgress prop
const mockSetProgress = jest.fn();

// Default props for the News component
const defaultProps = {
    apiKey: 'test-api-key',
    category: 'technology',
    country: 'us',
    pageSize: 6,
    setProgress: mockSetProgress,
};

// Helper function to create mock article data
const createMockArticle = (id, customTitle = `Title ${id}`) => ({
    source: { id: `source-${id}`, name: `Source ${id}` },
    author: `Author ${id}`,
    title: customTitle,
    description: `Description ${id}`,
    url: `http://example.com/article${id}`,
    urlToImage: `http://example.com/image${id}.jpg`,
    publishedAt: new Date().toISOString(),
    content: `Content ${id}`,
});

describe('News component', () => {
    beforeEach(() => {
        fetch.mockClear();
        mockSetProgress.mockClear();
        // Reset document title for each test
        document.title = "News App";
    });

    test('renders loading state initially and fetches articles, then updates title', async () => {
        const mockArticles = [createMockArticle(1), createMockArticle(2)];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ articles: mockArticles, totalResults: mockArticles.length }),
        });

        render(<News {...defaultProps} />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        // await waitFor(() => expect(mockSetProgress).toHaveBeenCalledWith(0)); // setProgress(0) is outside fetch
        expect(mockSetProgress).toHaveBeenCalledWith(0); // Called immediately on mount

        await waitFor(() => expect(mockSetProgress).toHaveBeenCalledWith(30));

        await waitFor(() => expect(screen.getByText('Title 1')).toBeInTheDocument());
        expect(screen.getByText('Description 1')).toBeInTheDocument();
        expect(screen.getByText('Title 2')).toBeInTheDocument();
        expect(screen.getByText('Description 2')).toBeInTheDocument();

        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        await waitFor(() => expect(mockSetProgress).toHaveBeenCalledWith(100));

        // Check document title update
        // Capitalize first letter of category for title
        const expectedTitle = `${defaultProps.category.charAt(0).toUpperCase() + defaultProps.category.slice(1)} - News App`;
        await waitFor(() => expect(document.title).toBe(expectedTitle));
    });

    test('handles API error gracefully during initial load', async () => {
        fetch.mockRejectedValueOnce(new Error('API Error'));

        render(<News {...defaultProps} />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(mockSetProgress).toHaveBeenCalledWith(0);

        // Wait for the fetch to attempt and fail
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
        // setProgress(30) is called before the fetch await
        expect(mockSetProgress).toHaveBeenCalledWith(30);

        // With fetch throwing an error, the catch block in updateNews should be hit.
        // setProgress(100) is called in the finally block of updateNews.
        await waitFor(() => expect(mockSetProgress).toHaveBeenCalledWith(100));

        // Loading indicator should be gone as setProgress(100) implies completion/error handled
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        expect(screen.queryByText(/Title \d/)).not.toBeInTheDocument();
         // Title should remain default or be set to error state if applicable
        // Based on current News.js, title updates only on success.
        const expectedTitleOnError = `${defaultProps.category.charAt(0).toUpperCase() + defaultProps.category.slice(1)} - News App`;
        expect(document.title).toBe(expectedTitleOnError); // It's set before fetch
    });

    test('loads more articles with InfiniteScroll', async () => {
        const initialArticles = [createMockArticle(1, "Initial Article 1")];
        const moreArticles = [createMockArticle(2, "More Article 2")];

        // Mock initial fetch (for updateNews called in useEffect)
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ articles: initialArticles, totalResults: initialArticles.length + moreArticles.length }),
        });

        render(<News {...defaultProps} pageSize={1} />);

        // Wait for initial articles
        await waitFor(() => expect(screen.getByText('Initial Article 1')).toBeInTheDocument());
        expect(screen.queryByText('More Article 2')).not.toBeInTheDocument();
        await waitFor(() => expect(mockSetProgress).toHaveBeenCalledWith(100)); // Initial load complete

        // Mock fetch for more data (for fetchMoreData)
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ articles: moreArticles, totalResults: initialArticles.length + moreArticles.length }),
        });

        // To trigger fetchMoreData, InfiniteScroll's `next` prop needs to be called.
        // This happens when the user scrolls and `hasMore` is true.
        // In testing-library, we can't easily simulate scroll to trigger it directly.
        // However, the `InfiniteScroll` component itself might be testable by
        // finding its `next` prop and calling it if it were exposed or if we could
        // somehow trigger its internal scroll check.

        // For this test, we will assume `fetchMoreData` will be called.
        // The `InfiniteScroll` component's `loader` prop is `this.state.loading && <Loading />`.
        // When `fetchMoreData` is called, it sets `this.setState({loading: true})`
        // then fetches.

        // We need to ensure the conditions for fetchMoreData are met:
        // `articles.length !== totalResults` is true (1 !== 2)
        // So, InfiniteScroll should be ready to fetch more.

        // Since we can't easily "scroll", and `fetchMoreData` is passed as `next`
        // to `InfiniteScroll`, we are testing the component's ability to *provide*
        // `fetchMoreData` correctly and that `fetchMoreData` itself works.
        // The actual triggering by scroll is a responsibility of `react-infinite-scroll-component`.

        // We will wait for the "Loading..." text specific to fetchMoreData.
        // Then check if the new article appears.

        // At this point, `fetchMoreData` has not been called yet.
        // We need a way to trigger it. Let's assume the component's `fetchMoreData`
        // is correctly passed to `InfiniteScroll` and would be called on scroll.
        // To test `fetchMoreData`'s logic, we can somewhat force its conditions.
        // The component will show "Loading..." again when `fetchMoreData` sets loading to true.

        // We expect the second fetch call (for more articles) to happen.
        // After this, the new articles should be on screen.
        await waitFor(() => {
            // Check if the second batch of articles is rendered
            expect(screen.getByText('More Article 2')).toBeInTheDocument();
        }, { timeout: 4500 }); // Wait for the new content

        expect(screen.getByText('Description 2')).toBeInTheDocument();
        // Check that the main loading indicator (from initial load) is not present
        expect(screen.queryByText('News App - Top Headlines')).not.toBeInTheDocument(); // This is title, not loading.

        // `fetchMoreData` also sets loading state. The <Loading/> inside InfiniteScroll is shown if this.state.loading is true.
        // After data is fetched and state updated, this loading should disappear.
        // The test for "Loading..." visibility during fetchMoreData is tricky because it appears and disappears quickly.
        // The crucial part is that new items are loaded.
    });

    test('updates document title correctly for different categories', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ articles: [createMockArticle(1)], totalResults: 1 })
        });
        render(<News {...defaultProps} category="sports" />);
        await waitFor(() => expect(document.title).toBe("Sports - News App"));
    });

    test('handles empty articles array from API', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ articles: [], totalResults: 0 }),
        });
        render(<News {...defaultProps} />);
        await waitFor(() => expect(mockSetProgress).toHaveBeenCalledWith(100));
        expect(screen.queryByText(/Title \d/)).not.toBeInTheDocument();
        // Check that no error is thrown and component renders (e.g., a "no articles" message if implemented, or just nothing)
        // The component currently doesn't show a "no articles" message.
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
});
