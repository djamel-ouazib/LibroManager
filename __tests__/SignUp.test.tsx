import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignUp from '@/app/(auth)/signup/page'
import { authClient } from '@/lib/auth-client'

// Mock router
const push = vi.fn()

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push,
    }),
}))

// Mock Link
vi.mock('next/link', () => ({
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

// Mock Better Auth
vi.mock('@/lib/auth-client', () => ({
    authClient: {
        signUp: {
            email: vi.fn(),
        },
        signIn: {
            social: vi.fn(),
        },
    },
}))

describe('SignUp', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    /**
     * F1 — The sign up page should render correctly.
     */
    it('F1 — should render the page', () => {
        render(<SignUp />)

        expect(screen.getByText('Sign up LibroManager')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Djamel Ouazib')).toBeInTheDocument()
        expect(
            screen.getByPlaceholderText('dj.ouazib@gmail.com')
        ).toBeInTheDocument()
        expect(
            screen.getByPlaceholderText('Enter yout password')
        ).toBeInTheDocument()
    })

    /**
     * F2 — Inputs should update correctly.
     */
    it('F2 — should update inputs', () => {
        render(<SignUp />)

        const name = screen.getByPlaceholderText(
            'Djamel Ouazib'
        ) as HTMLInputElement

        const email = screen.getByPlaceholderText(
            'dj.ouazib@gmail.com'
        ) as HTMLInputElement

        const password = screen.getByPlaceholderText(
            'Enter yout password'
        ) as HTMLInputElement

        fireEvent.change(name, {
            target: { value: 'John Doe' },
        })

        fireEvent.change(email, {
            target: { value: 'john@test.com' },
        })

        fireEvent.change(password, {
            target: { value: 'password123' },
        })

        expect(name.value).toBe('John Doe')
        expect(email.value).toBe('john@test.com')
        expect(password.value).toBe('password123')
    })

    /**
     * F3 — Clicking SignUp should call Better Auth.
     */
    it('F3 — should call signUp.email', async () => {
        vi.mocked(authClient.signUp.email).mockResolvedValue({
            data: {},
            error: null,
        } as any)

        render(<SignUp />)

        fireEvent.change(screen.getByPlaceholderText('Djamel Ouazib'), {
            target: { value: 'John Doe' },
        })

        fireEvent.change(screen.getByPlaceholderText('dj.ouazib@gmail.com'), {
            target: { value: 'john@test.com' },
        })

        fireEvent.change(screen.getByPlaceholderText('Enter yout password'), {
            target: { value: 'password123' },
        })

        fireEvent.click(screen.getByText('SingUp'))

        await waitFor(() => {
            expect(authClient.signUp.email).toHaveBeenCalled()
        })
    })

    /**
     * F4 — Clicking Google button should start Google authentication.
     */
    it('F4 — should call Google sign in', async () => {
        vi.mocked(authClient.signIn.social).mockResolvedValue({} as any)

        render(<SignUp />)

        fireEvent.click(screen.getByText('Continue with Google'))

        await waitFor(() => {
            expect(authClient.signIn.social).toHaveBeenCalledWith({
                provider: 'google',
            })
        })
    })
})
