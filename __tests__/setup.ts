import '@testing-library/jest-dom'

import { vi } from 'vitest'

// Mock next/navigation to avoid errors in tests
vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
    }),
    usePathname: () => '/',
}))

// Mock next/cache to avoid errors in tests
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}))
