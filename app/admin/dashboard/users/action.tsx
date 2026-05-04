'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Status } from '@/app/generated/prisma/enums'
export async function updateUserStatus(userId: string, status: Status) {
    await prisma.user.update({
        where: { id: userId },
        data: { status },
    })

    revalidatePath('/admin/dashboard/users')
}
