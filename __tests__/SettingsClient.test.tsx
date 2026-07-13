import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SettingsClient from '@/app/dashboard/settings/SettingsClient'
import { changePassword } from '@/app/dashboard/settings/action'

vi.mock('@/app/dashboard/settings/action', () => ({
    changePassword: vi.fn(),
}))

describe('SettingsClient', () => {
    const user = {
        name: 'Djamel Ouazib',
        email: 'djamel@test.com',
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should display user information', () => {
        render(<SettingsClient user={user} />)

        expect(screen.getByText('Djamel Ouazib')).toBeInTheDocument()

        expect(screen.getByText('djamel@test.com')).toBeInTheDocument()
    })

    it('should show error when passwords do not match', () => {
        render(<SettingsClient user={user} />)

        fireEvent.change(
            screen.getByPlaceholderText('Enter your current password'),
            {
                target: {
                    value: 'oldpassword',
                },
            }
        )

        fireEvent.change(
            screen.getByPlaceholderText('Enter your new password'),
            {
                target: {
                    value: 'newpassword123',
                },
            }
        )

        fireEvent.change(
            screen.getByPlaceholderText('Confirm your new password'),
            {
                target: {
                    value: 'differentpassword',
                },
            }
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: /Save New Password/i,
            })
        )

        expect(
            screen.getByText('New passwords do not match.')
        ).toBeInTheDocument()
    })

    it('should show error when password is less than 8 characters', () => {
        render(<SettingsClient user={user} />)

        fireEvent.change(
            screen.getByPlaceholderText('Enter your current password'),
            {
                target: {
                    value: 'oldpassword',
                },
            }
        )

        fireEvent.change(
            screen.getByPlaceholderText('Enter your new password'),
            {
                target: {
                    value: '123',
                },
            }
        )

        fireEvent.change(
            screen.getByPlaceholderText('Confirm your new password'),
            {
                target: {
                    value: '123',
                },
            }
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: /Save New Password/i,
            })
        )

        expect(
            screen.getByText('New password must be at least 8 characters.')
        ).toBeInTheDocument()
    })

    it('should call changePassword when form is valid', async () => {
        vi.mocked(changePassword).mockResolvedValue({
            success: true,
            message: 'Password changed successfully',
        })

        render(<SettingsClient user={user} />)

        fireEvent.change(
            screen.getByPlaceholderText('Enter your current password'),
            {
                target: {
                    value: 'oldpassword',
                },
            }
        )

        fireEvent.change(
            screen.getByPlaceholderText('Enter your new password'),
            {
                target: {
                    value: 'newpassword123',
                },
            }
        )

        fireEvent.change(
            screen.getByPlaceholderText('Confirm your new password'),
            {
                target: {
                    value: 'newpassword123',
                },
            }
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: /Save New Password/i,
            })
        )

        await waitFor(() => {
            expect(changePassword).toHaveBeenCalledWith(
                'oldpassword',
                'newpassword123'
            )
        })

        expect(
            screen.getByText('Password changed successfully')
        ).toBeInTheDocument()
    })
})
