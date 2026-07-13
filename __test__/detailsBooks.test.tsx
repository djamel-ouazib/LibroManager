import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DetailsBook from '../app/components/detailsBooks'
import type { Book } from '../app/generated/prisma/client'

// Mock authClient to avoid real session calls during tests
vi.mock('@/lib/auth-client', () => ({
    authClient: {
        useSession: () => ({
            data: {
                user: { id: 'user-123', name: 'Test User' },
            },
        }),
    },
}))

// Mock borrowBook Server Action
vi.mock('@/app/dashboard/explore/actions', () => ({
    borrowBook: vi.fn().mockResolvedValue({
        success: true,
        message: 'Book borrowed successfully!',
    }),
}))

// Mock book data matching Prisma Book type
const mockBook: Book = {
    id: 'book-1',
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-0-7352-1018-3',
    description: 'A great book about habits.',
    coverUrl: null,
    category: 'Self-development',
    totalStock: 5,
    availableStock: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
}

// Helper to render the modal in open state
const renderModal = (overrides = {}) => {
    const setShowBook = vi.fn()
    render(
        <DetailsBook
            showBook={true}
            setShowBook={setShowBook}
            book={{ ...mockBook, ...overrides }}
        />
    )
    return { setShowBook }
}

describe('DetailsBook — Frontend Component Tests', () => {
    // ── TEST 1 — Modal fermé ───────────────────────────────
    it('F01 — should not render when showBook is false', () => {
        render(
            <DetailsBook
                showBook={false}
                setShowBook={vi.fn()}
                book={mockBook}
            />
        )
        expect(screen.queryByText('Atomic Habits')).not.toBeInTheDocument()
    })

    // ── TEST 2 — Affichage titre et auteur ────────────────
    it('F02 — should display book title and author when open', () => {
        renderModal()
        expect(screen.getByText('Atomic Habits')).toBeInTheDocument()
        expect(screen.getByText('James Clear')).toBeInTheDocument()
    })

    // ── TEST 3 — Badge categorie ───────────────────────────
    it('F03 — should display book category badge', () => {
        renderModal()
        expect(screen.getByText('Self-development')).toBeInTheDocument()
    })

    // ── TEST 4 — Disponibilite affichee ───────────────────
    it('F04 — should display availability when stock is available', () => {
        renderModal()
        expect(screen.getByText('3 of 5 available')).toBeInTheDocument()
    })

    // ── TEST 5 — Stock epuise ──────────────────────────────
    it('F05 — should display out of stock when no stock', () => {
        renderModal({ availableStock: 0 })
        expect(screen.getByText('Out of stock')).toBeInTheDocument()
    })

    // ── TEST 6 — Bouton Borrow desactive si epuise ────────
    it('F06 — should disable Borrow button when out of stock', () => {
        renderModal({ availableStock: 0 })
        const borrowButton = screen.getByRole('button', {
            name: /borrow book/i,
        })
        expect(borrowButton).toBeDisabled()
    })

    // ── TEST 7 — Bouton Borrow actif si disponible ────────
    it('F07 — should enable Borrow button when stock is available', () => {
        renderModal()
        const borrowButton = screen.getByRole('button', {
            name: /borrow book/i,
        })
        expect(borrowButton).not.toBeDisabled()
    })

    // ── TEST 8 — Fermeture au clic Cancel ─────────────────
    it('F08 — should call setShowBook(false) when Cancel is clicked', () => {
        const { setShowBook } = renderModal()
        fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
        expect(setShowBook).toHaveBeenCalledWith(false)
    })

    // ── TEST 9 — Description du livre ─────────────────────
    it('F09 — should display book description', () => {
        renderModal()
        expect(
            screen.getByText('A great book about habits.')
        ).toBeInTheDocument()
    })

    // ── TEST 10 — Description absente ─────────────────────
    it('F10 — should display fallback when description is null', () => {
        renderModal({ description: null })
        expect(
            screen.getByText('No description available.')
        ).toBeInTheDocument()
    })

    // ── TEST 11 — ISBN affiche ────────────────────────────
    it('F11 — should display book ISBN', () => {
        renderModal()
        expect(screen.getByText('978-0-7352-1018-3')).toBeInTheDocument()
    })

    // ── TEST 12 — Pas de couverture ───────────────────────
    it('F12 — should display fallback when no cover image', () => {
        renderModal({ coverUrl: null })
        expect(screen.getByText('No cover available')).toBeInTheDocument()
    })
})
