import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock useFormStatus from react-dom
vi.mock('react-dom', () => ({
    useFormStatus: vi.fn(),
}))

import { useFormStatus } from 'react-dom'
import SubmitButton from '@/app/components/submitButton'

describe('SubmitButton', () => {
    it('should display Add Book when form is not pending', () => {
        // Mock pending state false
        vi.mocked(useFormStatus).mockReturnValue({
            pending: false,
        } as any)

        render(<SubmitButton />)

        expect(
            screen.getByRole('button', { name: /add book/i })
        ).toBeInTheDocument()
    })

    it('should display Adding when form is pending', () => {
        // Mock pending state true
        vi.mocked(useFormStatus).mockReturnValue({
            pending: true,
        } as any)

        render(<SubmitButton />)

        expect(screen.getByText(/adding/i)).toBeInTheDocument()
    })

    it('should disable button when pending is true', () => {
        // Mock pending state true
        vi.mocked(useFormStatus).mockReturnValue({
            pending: true,
        } as any)

        render(<SubmitButton />)

        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should enable button when pending is false', () => {
        // Mock pending state false
        vi.mocked(useFormStatus).mockReturnValue({
            pending: false,
        } as any)

        render(<SubmitButton />)

        expect(screen.getByRole('button')).not.toBeDisabled()
    })
})
