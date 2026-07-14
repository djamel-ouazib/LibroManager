import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

// Simple pure component — no Prisma, no Next.js, no auth
function StatCardUI({
    title,
    value,
    isOverdue = false,
}: {
    title: string
    value: number
    isOverdue?: boolean
}) {
    return (
        <div>
            <span>{title}</span>
            <span className={isOverdue ? 'text-red-400' : 'text-black'}>
                {value}
            </span>
        </div>
    )
}

describe('StatCardUI — Frontend Tests', () => {
    // ── TEST 1 — Affiche le titre ──────────────────────────
    it('F01 — should display the stat title', () => {
        render(<StatCardUI title="Total Books" value={42} />)
        expect(screen.getByText('Total Books')).toBeInTheDocument()
    })

    // ── TEST 2 — Affiche la valeur ────────────────────────
    it('F02 — should display the stat value', () => {
        render(<StatCardUI title="Total Books" value={42} />)
        expect(screen.getByText('42')).toBeInTheDocument()
    })

    // ── TEST 3 — Valeur zero ──────────────────────────────
    it('F03 — should display zero value correctly', () => {
        render(<StatCardUI title="Overdue Books" value={0} />)
        expect(screen.getByText('0')).toBeInTheDocument()
    })

    // ── TEST 4 — Classe rouge si overdue ──────────────────
    it('F04 — should apply red class when isOverdue is true', () => {
        render(<StatCardUI title="Overdue Books" value={3} isOverdue={true} />)
        expect(screen.getByText('3')).toHaveClass('text-red-400')
    })

    // ── TEST 5 — Pas de rouge si pas overdue ─────────────
    it('F05 — should NOT apply red class when isOverdue is false', () => {
        render(<StatCardUI title="Total Books" value={42} isOverdue={false} />)
        expect(screen.getByText('42')).not.toHaveClass('text-red-400')
    })

    // ── TEST 6 — Titre et valeur ensemble ────────────────
    it('F06 — should display both title and value together', () => {
        render(<StatCardUI title="Active Borrowings" value={10} />)
        expect(screen.getByText('Active Borrowings')).toBeInTheDocument()
        expect(screen.getByText('10')).toBeInTheDocument()
    })
})
