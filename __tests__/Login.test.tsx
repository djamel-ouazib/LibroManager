import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { authClient } from '@/lib/auth-client'
import Login from '@/app/(auth)/login/page'

// Mock Next Router
const push = vi.fn()

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push,
    }),
}))

// Mock Next Link
vi.mock('next/link', () => ({
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

// Mock Better Auth
vi.mock('@/lib/auth-client', () => ({
    authClient: {
        signIn: {
            email: vi.fn(),
        },
    },
}))

describe('Login', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    /**
     * F1 — The login page should render correctly.
     */
    it('F1 — should render the login page', () => {
        render(<Login />)

        expect(screen.getByText('Welcome Back')).toBeInTheDocument()
        expect(
            screen.getByPlaceholderText('dj.ouazib@gmail.com')
        ).toBeInTheDocument()
        expect(
            screen.getByPlaceholderText('Enter yout password')
        ).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    /**
     * F2 — The user should be able to type in both inputs.
     */
    it('F2 — should update email and password inputs', () => {
        render(<Login />)

        const email = screen.getByPlaceholderText(
            'dj.ouazib@gmail.com'
        ) as HTMLInputElement

        const password = screen.getByPlaceholderText(
            'Enter yout password'
        ) as HTMLInputElement

        fireEvent.change(email, {
            target: { value: 'john@test.com' },
        })

        fireEvent.change(password, {
            target: { value: 'password123' },
        })

        expect(email.value).toBe('john@test.com')
        expect(password.value).toBe('password123')
    })

    /**
     * F3 — An error message should be displayed when authentication fails.
     */
    it('F3 — should display an error message', async () => {
        vi.mocked(authClient.signIn.email).mockResolvedValue({
            data: null,
            error: {
                message: 'Invalid credentials',
            },
        } as any)

        render(<Login />)

        fireEvent.change(screen.getByPlaceholderText('dj.ouazib@gmail.com'), {
            target: {
                value: 'user@test.com',
            },
        })

        fireEvent.change(screen.getByPlaceholderText('Enter yout password'), {
            target: {
                value: 'password123',
            },
        })

        fireEvent.click(screen.getByRole('button'))

        await waitFor(() => {
            expect(
                screen.getByText('Email ou mot de passe incorrect.')
            ).toBeInTheDocument()
        })
    })

    /**
     * F4 — An admin user should be redirected to the admin dashboard.
     */
    it('F4 — should redirect an admin to /admin/dashboard', async () => {
        vi.mocked(authClient.signIn.email).mockResolvedValue({
            data: {
                user: {
                    role: 'ADMIN',
                },
            },
            error: null,
        } as any)

        render(<Login />)

        fireEvent.change(screen.getByPlaceholderText('dj.ouazib@gmail.com'), {
            target: {
                value: 'admin@test.com',
            },
        })

        fireEvent.change(screen.getByPlaceholderText('Enter yout password'), {
            target: {
                value: 'password123',
            },
        })

        fireEvent.click(screen.getByRole('button'))

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/admin/dashboard')
        })
    })

    /**
     * F5 — A regular user should be redirected to the user dashboard.
     */
    it('F5 — should redirect a user to /dashboard', async () => {
        vi.mocked(authClient.signIn.email).mockResolvedValue({
            data: {
                user: {
                    role: 'USER',
                },
            },
            error: null,
        } as any)

        render(<Login />)

        fireEvent.change(screen.getByPlaceholderText('dj.ouazib@gmail.com'), {
            target: {
                value: 'user@test.com',
            },
        })

        fireEvent.change(screen.getByPlaceholderText('Enter yout password'), {
            target: {
                value: 'password123',
            },
        })

        fireEvent.click(screen.getByRole('button'))

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/dashboard')
        })
    })
})
