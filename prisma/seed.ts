import { PrismaClient, Prisma } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({
    adapter,
})

const userData: Prisma.UserCreateInput[] = [
    {
        fullName: 'Admin Libro',
        email: 'admin@school.edu',
        role: 'ADMIN',
        status: 'ACTIVE',
    },
    {
        fullName: 'Jean Etudiant',
        email: 'jean.student@school.edu',
        role: 'USER',
        status: 'ACTIVE',
    },
]

const bookData: Prisma.BookCreateInput[] = [
    {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        description:
            'A story of wealth, love, and the American Dream in the 1920s.',
        totalStock: 5,
        availableStock: 4,
        category: 'Classic Literature',
        coverUrl:
            'https://images.unsplash.com/photo-1543004218-ee1411049753?q=80&w=300',
    },
    {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        description: 'A handbook of agile software craftsmanship.',
        totalStock: 3,
        availableStock: 3,
        category: 'Technology',
        coverUrl:
            'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=300',
    },
]

export async function main() {
    console.log('--- Start Seeding ---')

    // Nettoyage de la base (optionnel, évite les doublons au seed)
    await prisma.borrowing.deleteMany()
    await prisma.book.deleteMany()
    await prisma.user.deleteMany()

    // Création des utilisateurs
    for (const u of userData) {
        const user = await prisma.user.create({ data: u })
        console.log(`Created user: ${user.fullName}`)
    }

    // Création des livres
    for (const b of bookData) {
        const book = await prisma.book.create({ data: b })
        console.log(`Created book: ${book.title}`)
    }

    // Création d'un emprunt de test (Jean emprunte Gatsby)
    const student = await prisma.user.findFirst({ where: { role: 'USER' } })
    const gatsby = await prisma.book.findFirst({
        where: { title: 'The Great Gatsby' },
    })

    if (student && gatsby) {
        await prisma.borrowing.create({
            data: {
                userId: student.id,
                bookId: gatsby.id,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // J+14
                status: 'BORROWED',
            },
        })
        console.log(
            `Created test borrowing: ${student.fullName} borrowed ${gatsby.title}`
        )
    }

    console.log('--- Seeding Finished ---')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
