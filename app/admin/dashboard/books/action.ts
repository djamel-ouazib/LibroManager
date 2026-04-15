'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createBook(formData: FormData) {
    const title = formData.get('title') as string
    const author = formData.get('author') as string
    const category = formData.get('category') as string
    const isbn = formData.get('isbn') as string
    const totalStock = Number(formData.get('totalStock'))
    const coverUrl = formData.get('coverUrl') as string
    const description = formData.get('description') as string

    if (!title || !author || !isbn) {
        throw new Error('Missing fields')
    }

    await prisma.book.create({
        data: {
            title,
            author,
            category,
            isbn,
            totalStock,
            availableStock: totalStock, // 🔥 IMPORTANT
            coverUrl,
            description,
        },
    })

    revalidatePath('/admin/dashboard/books')
}

export async function getBookById(id: string) {
    try {
        const book = await prisma.book.findUnique({
            where: { id: id },
        })
        return book
    } catch (error) {
        console.error('Erreur lors de la récupération du livre:', error)
        return null
    }
}

export default async function deletBook(id: string) {
    try {
        await prisma.book.delete({
            where: { id: id },
        })
    } catch (error) {
        console.error('Erreur suppression:', error)
        return { error: 'Impossible de supprimer ce livre.' }
    }
    revalidatePath('/admin/dashboard/books')
    redirect('/admin/dashboard/books')
}

export async function updateBook(id: string, data: any) {
    try {
        await prisma.book.update({
            where: { id: id },
            data: {
                title: data.title,
                author: data.author,
                category: data.category,
                totalStock: Number(data.totalStock),
                description: data.description,
                coverUrl: data.coverUrl,
            },
        })
    } catch (error) {
        console.error('Erreur modification:', error)
        return { error: 'Erreur lors de la mise à jour.' }
    }

    revalidatePath(`/admin/dashboard/books/${id}`)
    revalidatePath('/admin/dashboard/books')
}
