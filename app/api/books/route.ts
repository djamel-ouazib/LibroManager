import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const books = await prisma.book.findMany()
        return NextResponse.json(books)
    } catch (error) {
        return NextResponse.json([], { status: 500 })
    }
}
