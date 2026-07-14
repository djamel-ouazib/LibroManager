import Table from '@/app/components/Table'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Table component', () => {
    // Reset global mocks before each test
    beforeEach(() => {
        vi.unstubAllGlobals()
    })

    it('should display loading state while fetching books', () => {
        // Mock fetch with a pending request
        vi.stubGlobal(
            'fetch',
            vi.fn(() => new Promise(() => {}))
        )

        render(<Table />)

        // Check if loading spinner is displayed
        expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('should display books after successful fetch', async () => {
        // Fake API response
        const books = [
            {
                id: '1',
                title: 'Atomic Habits',
                author: 'James Clear',
                category: 'Self-development',
                totalStock: 10,
                availableStock: 5,
            },
        ]

        // Mock fetch API
        vi.stubGlobal(
            'fetch',
            vi.fn(() =>
                Promise.resolve({
                    json: async () => books,
                })
            )
        )

        render(<Table />)

        // Wait until the book title appears
        expect(await screen.findByText('Atomic Habits')).toBeInTheDocument()

        // Check author is displayed
        expect(screen.getByText('James Clear')).toBeInTheDocument()

        // Check category is displayed
        expect(screen.getByText('Self-development')).toBeInTheDocument()
    })

    it('should display stock values correctly', async () => {
        const books = [
            {
                id: '2',
                title: 'Clean Code',
                author: 'Robert Martin',
                category: 'Programming',
                totalStock: 20,
                availableStock: 0,
            },
        ]

        // Mock API response
        vi.stubGlobal(
            'fetch',
            vi.fn(() =>
                Promise.resolve({
                    json: async () => books,
                })
            )
        )

        render(<Table />)

        // Wait until data is rendered
        await waitFor(() => {
            expect(screen.getByText('20')).toBeInTheDocument()

            expect(screen.getByText('0')).toBeInTheDocument()
        })
    })

    it('should create a link to the book details page', async () => {
        const books = [
            {
                id: '123',
                title: 'The Pragmatic Programmer',
                author: 'Andrew Hunt',
                category: 'Programming',
                totalStock: 3,
                availableStock: 2,
            },
        ]

        // Mock API response
        vi.stubGlobal(
            'fetch',
            vi.fn(() =>
                Promise.resolve({
                    json: async () => books,
                })
            )
        )

        render(<Table />)

        // Find book title
        const bookTitle = await screen.findByText('The Pragmatic Programmer')

        // Check generated Next.js Link URL
        expect(bookTitle.closest('a')).toHaveAttribute(
            'href',
            '/admin/dashboard/books/123'
        )
    })

    it('should call the books API endpoint', async () => {
        const fetchMock = vi.fn(() =>
            Promise.resolve({
                json: async () => [],
            })
        )

        vi.stubGlobal('fetch', fetchMock)

        render(<Table />)

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith('/api/books')
        })
    })
})
