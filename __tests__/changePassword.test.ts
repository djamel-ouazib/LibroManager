import { describe, it, expect, vi, beforeEach } from 'vitest'
import { changePassword } from '@/app/dashboard/settings/action'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            changePassword: vi.fn(),
        },
    },
}))

vi.mock('next/headers', () => ({
    headers: vi.fn(),
}))

describe('changePassword server action', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should change password successfully', async () => {
        vi.mocked(auth.api.changePassword).mockResolvedValue({
            success: true,
        } as never)

        vi.mocked(headers).mockResolvedValue(new Headers() as never)

        const result = await changePassword('oldPassword123', 'newPassword123')

        expect(auth.api.changePassword).toHaveBeenCalled()

        expect(result).toEqual({
            success: true,
            message: 'Password changed successfully',
        })
    })

    it('should return error when current password is wrong', async () => {
        vi.mocked(auth.api.changePassword).mockRejectedValue(
            new Error('Invalid password')
        )

        vi.mocked(headers).mockResolvedValue(new Headers() as never)

        const result = await changePassword('wrongPassword', 'newPassword123')

        expect(result).toEqual({
            success: false,
            message: 'Current password is incorrect',
        })
    })
})
