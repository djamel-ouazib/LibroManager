import ExploreClient from '@/app/dashboard/explore/ExploreClient'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock Card component
vi.mock('@/app/components/ui/Card', () => ({
    default: ({ book }: any) => <div>{book.title}</div>,
}))

describe('ExploreClient', () => {
    const books = [
        {
            id: '1',
            title: 'Clean Code',
            author: 'Robert Martin',
            category: 'Programming',
        },
        {
            id: '2',
            title: 'The Hobbit',
            author: 'Tolkien',
            category: 'Fantasy',
        },
    ]

    const categories = ['Programming', 'Fantasy']
    const wishlistIds: string[] = []

    it('should render the page title', () => {
        render(
            <ExploreClient
                books={books as any}
                categories={categories}
                wishlistIds={wishlistIds}
            />
        )

        expect(screen.getByText('Explore')).toBeInTheDocument()
    })

    it('should display all books initially', () => {
        render(
            <ExploreClient
                books={books as any}
                categories={categories}
                wishlistIds={wishlistIds}
            />
        )

        expect(screen.getByText('Clean Code')).toBeInTheDocument()
        expect(screen.getByText('The Hobbit')).toBeInTheDocument()
    })

    it('should filter books when searching', () => {
        render(
            <ExploreClient
                books={books as any}
                categories={categories}
                wishlistIds={wishlistIds}
            />
        )

        fireEvent.change(
            screen.getByPlaceholderText('Search by title or author...'),
            {
                target: { value: 'Clean' },
            }
        )

        expect(screen.getByText('Clean Code')).toBeInTheDocument()
        expect(screen.queryByText('The Hobbit')).not.toBeInTheDocument()
    })

    it('should filter books by category', () => {
        render(
            <ExploreClient
                books={books as any}
                categories={categories}
                wishlistIds={wishlistIds}
            />
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Programming',
            })
        )

        expect(screen.getByText('Clean Code')).toBeInTheDocument()
        expect(screen.queryByText('The Hobbit')).not.toBeInTheDocument()
    })

    it('should clear the search input', () => {
        render(
            <ExploreClient
                books={books as any}
                categories={categories}
                wishlistIds={wishlistIds}
            />
        )

        const input = screen.getByPlaceholderText(
            'Search by title or author...'
        )

        fireEvent.change(input, {
            target: { value: 'Clean' },
        })

        expect(input).toHaveValue('Clean')

        fireEvent.click(screen.getByRole('button', { name: '' }))

        expect(input).toHaveValue('')
    })

    it('should display "No books found" when search has no result', () => {
        render(
            <ExploreClient
                books={books as any}
                categories={categories}
                wishlistIds={wishlistIds}
            />
        )

        fireEvent.change(
            screen.getByPlaceholderText('Search by title or author...'),
            {
                target: { value: 'Unknown Book' },
            }
        )

        expect(screen.getByText(/No books found/i)).toBeInTheDocument()
    })
})
