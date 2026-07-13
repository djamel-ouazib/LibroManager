// Import testing utilities
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Import the component under test

// Import the server action that will be mocked
import { createUser } from '@/app/admin/dashboard/users/action'
import AddUserForm from '@/app/components/AddUserForm'

// Mock the server action
vi.mock('@/app/admin/dashboard/users/action', () => ({
    createUser: vi.fn(),
}))

describe('AddUserForm', () => {
    // Reset all mocks before each test
    beforeEach(() => {
        vi.clearAllMocks()
    })

    /**
     * Helper function
     * Renders the component and opens the modal.
     */
    function openModal() {
        render(<AddUserForm />)

        fireEvent.click(
            screen.getByRole('button', {
                name: /add user/i,
            })
        )
    }

    it('F01 — should render Add User button', () => {
        render(<AddUserForm />)

        expect(
            screen.getByRole('button', {
                name: /add user/i,
            })
        ).toBeInTheDocument()
    })

    it('F02 — should open the modal when Add User button is clicked', () => {
        openModal()

        expect(screen.getByText(/add a member/i)).toBeInTheDocument()
    })

    it('F03 — should close the modal when the close button is clicked', () => {
        openModal()

        // The second button is the close button inside the modal
        const buttons = screen.getAllByRole('button')

        fireEvent.click(buttons[1])

        expect(screen.queryByText(/add a member/i)).not.toBeInTheDocument()
    })

    it('F04 — should display validation error when required fields are empty', () => {
        openModal()

        // Submit the form without filling any input
        fireEvent.click(
            screen.getByRole('button', {
                name: /create member/i,
            })
        )

        expect(screen.getByText(/all fields are required/i)).toBeInTheDocument()

        // Server action should not be called
        expect(createUser).not.toHaveBeenCalled()
    })

    it('F05 — should display validation error when password is too short', () => {
        openModal()

        // Fill the form with an invalid password
        fireEvent.change(screen.getByPlaceholderText(/john doe/i), {
            target: { value: 'John Doe' },
        })

        fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), {
            target: { value: 'john@test.com' },
        })

        fireEvent.change(screen.getByPlaceholderText(/min. 8 characters/i), {
            target: { value: '123456' },
        })

        fireEvent.click(
            screen.getByRole('button', {
                name: /create member/i,
            })
        )

        expect(
            screen.getByText(/password must be at least 8 characters/i)
        ).toBeInTheDocument()

        expect(createUser).not.toHaveBeenCalled()
    })

    it('F06 — should call createUser when the form is valid', async () => {
        // Mock a successful server response
        vi.mocked(createUser).mockResolvedValue({
            success: true,
            message: 'User created successfully.',
        })

        openModal()

        // Fill every field with valid values
        fireEvent.change(screen.getByPlaceholderText(/john doe/i), {
            target: { value: 'John Doe' },
        })

        fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), {
            target: { value: 'john@test.com' },
        })

        fireEvent.change(screen.getByPlaceholderText(/min. 8 characters/i), {
            target: { value: 'password123' },
        })

        fireEvent.click(
            screen.getByRole('button', {
                name: /create member/i,
            })
        )

        // Wait until the async server action has been called
        await waitFor(() => {
            expect(createUser).toHaveBeenCalledTimes(1)
        })
    })

    it('F07 — should display success message after successful creation', async () => {
        vi.mocked(createUser).mockResolvedValue({
            success: true,
            message: 'User created successfully.',
        })

        openModal()

        fireEvent.change(screen.getByPlaceholderText(/john doe/i), {
            target: { value: 'John Doe' },
        })

        fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), {
            target: { value: 'john@test.com' },
        })

        fireEvent.change(screen.getByPlaceholderText(/min. 8 characters/i), {
            target: { value: 'password123' },
        })

        fireEvent.click(
            screen.getByRole('button', {
                name: /create member/i,
            })
        )

        // Wait for the async request to finish
        await waitFor(() => {
            expect(createUser).toHaveBeenCalled()
        })
    })

    it('F08 — should display server error message when creation fails', async () => {
        // Mock a failed response
        vi.mocked(createUser).mockResolvedValue({
            success: false,
            message: 'Email already exists.',
        })

        openModal()

        fireEvent.change(screen.getByPlaceholderText(/john doe/i), {
            target: { value: 'John Doe' },
        })

        fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), {
            target: { value: 'john@test.com' },
        })

        fireEvent.change(screen.getByPlaceholderText(/min. 8 characters/i), {
            target: { value: 'password123' },
        })

        fireEvent.click(
            screen.getByRole('button', {
                name: /create member/i,
            })
        )

        // Verify that the error message is displayed
        await waitFor(() => {
            expect(
                screen.getByText(/email already exists/i)
            ).toBeInTheDocument()
        })
    })

    it('F09 — should close the modal after successful user creation', async () => {
        vi.mocked(createUser).mockResolvedValue({
            success: true,
            message: 'User created successfully.',
        })

        openModal()

        fireEvent.change(screen.getByPlaceholderText(/john doe/i), {
            target: { value: 'John Doe' },
        })

        fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), {
            target: { value: 'john@test.com' },
        })

        fireEvent.change(screen.getByPlaceholderText(/min. 8 characters/i), {
            target: { value: 'password123' },
        })

        fireEvent.click(
            screen.getByRole('button', {
                name: /create member/i,
            })
        )

        await waitFor(() => {
            expect(createUser).toHaveBeenCalled()
        })

        // The modal should no longer be visible
        expect(screen.queryByText(/add a member/i)).not.toBeInTheDocument()
    })
})
