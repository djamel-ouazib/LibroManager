'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Type for the book update payload
interface BookUpdateData {
    title: string
    author: string
    category: string
    totalStock: number | string
    description: string
    coverUrl: string
}

// Type for the Server Action state returned to useActionState
interface ActionState {
    success?: boolean
    error?: string
}

// Create a new book in the database
export async function createBook(
    prevState: ActionState | null,
    formData: FormData
) {
    // Extract and cast form fields
    const title = formData.get('title') as string
    const author = formData.get('author') as string
    const category = formData.get('category') as string
    const isbn = formData.get('isbn') as string
    const totalStock = Number(formData.get('totalStock'))
    const coverUrl = formData.get('coverUrl') as string
    const description = formData.get('description') as string

    // Validate required fields before hitting the database
    if (!title || !author || !isbn) {
        throw new Error('Missing fields')
    }

    // Insert the new book — availableStock starts equal to totalStock
    await prisma.book.create({
        data: {
            title,
            author,
            category,
            isbn,
            totalStock,
            availableStock: totalStock,
            coverUrl,
            description,
        },
    })

    // Revalidate the books list page to reflect the new entry
    revalidatePath('/admin/dashboard/books')
    return { success: true }
}

// Fetch a single book by its ID
export async function getBookById(id: string) {
    try {
        const book = await prisma.book.findUnique({
            where: { id },
        })
        return book
    } catch (error) {
        console.error('Error fetching book:', error)
        return null
    }
}

// Delete a book by its ID and redirect to the books list
export default async function deletBook(id: string) {
    try {
        await prisma.book.delete({
            where: { id },
        })
    } catch (error) {
        console.error('Error deleting book:', error)
    }

    // Revalidate and redirect after deletion
    revalidatePath('/admin/dashboard/books')
    redirect('/admin/dashboard/books')
}

// Update an existing book by its ID
export async function updateBook(id: string, data: BookUpdateData) {
    try {
        await prisma.book.update({
            where: { id },
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
        console.error('Error updating book:', error)
        return { error: 'Failed to update book.' }
    }

    // Revalidate both the detail page and the books list
    revalidatePath(`/admin/dashboard/books/${id}`)
    revalidatePath('/admin/dashboard/books')
}
