import LoansClient from '@/app/dashboard/loans/LoansClient'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('LoansClient component', () => {
    const loans = [
        {
            id: '1',
            status: 'BORROWED',
            borrowDate: new Date('2026-07-01'),
            dueDate: new Date('2026-07-15'),
            returnDate: null,

            book: {
                id: 'book-1',
                title: 'Clean Code',
                author: 'Robert Martin',
                coverUrl: '',
            },
        },
        {
            id: '2',
            status: 'RETURNED',
            borrowDate: new Date('2026-06-01'),
            dueDate: new Date('2026-06-15'),
            returnDate: new Date('2026-06-10'),

            book: {
                id: 'book-2',
                title: 'The Hobbit',
                author: 'Tolkien',
                coverUrl: '',
            },
        },
    ] as any

    it('should render page title', () => {
        render(<LoansClient loans={loans} />)

        expect(screen.getByText('My Loans')).toBeInTheDocument()
    })

    it('should display all loans', () => {
        render(<LoansClient loans={loans} />)

        expect(screen.getByText('Clean Code')).toBeInTheDocument()

        expect(screen.getByText('The Hobbit')).toBeInTheDocument()
    })

    it('should search loans by book title', () => {
        render(<LoansClient loans={loans} />)

        const input = screen.getByPlaceholderText(
            'Search by book title or author...'
        )

        fireEvent.change(input, {
            target: {
                value: 'Clean',
            },
        })

        expect(screen.getByText('Clean Code')).toBeInTheDocument()

        expect(screen.queryByText('The Hobbit')).not.toBeInTheDocument()
    })

    it('should filter loans by status', () => {
        render(<LoansClient loans={loans} />)

        fireEvent.click(
            screen.getByRole('button', {
                name: 'RETURNED',
            })
        )

        expect(screen.getByText('The Hobbit')).toBeInTheDocument()

        expect(screen.queryByText('Clean Code')).not.toBeInTheDocument()
    })

    it('should clear filters', () => {
        render(<LoansClient loans={loans} />)

        const input = screen.getByPlaceholderText(
            'Search by book title or author...'
        )

        fireEvent.change(input, {
            target: {
                value: 'Unknown',
            },
        })

        expect(
            screen.getByText('No loans match your search')
        ).toBeInTheDocument()

        fireEvent.click(screen.getByText('Clear filters'))

        expect(screen.getByText('Clean Code')).toBeInTheDocument()
    })

    it('should display empty state when no loans exist', () => {
        render(<LoansClient loans={[]} />)

        expect(
            screen.getByText("You haven't borrowed any books yet")
        ).toBeInTheDocument()
    })
})
