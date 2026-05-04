import AddUserForm from '@/app/components/AddUserForm'
import UserRow from '@/app/components/UserRow'
import prisma from '@/lib/prisma'

export default async function Users() {
    const users = await prisma.user.findMany({
        where: {
            role: 'USER',
        },
        include: {
            borrowings: {
                where: {
                    status: 'BORROWED', // seulement les livres en possession
                },
                include: {
                    book: true, // les détails du livre
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="p-6  bg-white dark:bg-neutral-800 w-full border dark:border-zinc-800 border-zinc-300 rounded-2xl">
            <div className="font-semibold text-[18px]">
                Total users : {users.length}
            </div>

            <AddUserForm />

            <div className=" p-3  my-9 ">
                <div className="py-3 ">
                    <ul className="flex items-start font-semibold justify-between">
                        <li>FullName</li>
                        <li>Email</li>
                        <li>Status</li>
                    </ul>
                </div>
                {users.map((user) => (
                    <UserRow key={user.id} user={user} />
                ))}
            </div>
        </div>
    )
}
