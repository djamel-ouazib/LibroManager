import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next-themes
const setThemeMock = vi.fn()

vi.mock('next-themes', () => ({
    useTheme: vi.fn(),
}))

// Mock icons
vi.mock('react-icons/fa6', () => ({
    FaMoon: () => <span data-testid="moon-icon">Moon</span>,
    FaSun: () => <span data-testid="sun-icon">Sun</span>,
}))

import { useTheme } from 'next-themes'
import ThemeToggle from '@/app/components/ThemeToggle'

describe('ThemeToggle', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render placeholder before component is mounted', () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'light',
            resolvedTheme: 'light',
            setTheme: setThemeMock,
        } as any)

        render(<ThemeToggle />)

        // Placeholder is displayed before useEffect runs
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('should display sun icon in light mode', async () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'light',
            resolvedTheme: 'light',
            setTheme: setThemeMock,
        } as any)

        render(<ThemeToggle />)

        // Wait for mounted state
        await waitFor(() => {
            expect(screen.getByRole('button')).toBeInTheDocument()
        })

        expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    })

    it('should display moon icon in dark mode', async () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'dark',
            resolvedTheme: 'dark',
            setTheme: setThemeMock,
        } as any)

        render(<ThemeToggle />)

        await waitFor(() => {
            expect(screen.getByRole('button')).toBeInTheDocument()
        })

        expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    })

    it('should switch theme when button is clicked', async () => {
        vi.mocked(useTheme).mockReturnValue({
            theme: 'light',
            resolvedTheme: 'light',
            setTheme: setThemeMock,
        } as any)

        render(<ThemeToggle />)

        const button = await screen.findByRole('button')

        fireEvent.click(button)

        expect(setThemeMock).toHaveBeenCalledWith('dark')
    })
})
