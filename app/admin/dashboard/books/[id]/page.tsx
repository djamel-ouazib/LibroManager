import deletBook, { getBookById } from '../action' // On va créer cette fonction
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function BookDetailsPage({ params }: PageProps) {
    // 🔥 C'est ici que ça se joue : il faut await params
    const { id } = await params

    // Maintenant id ne sera plus undefined
    const book = await getBookById(id)

    // if (!book) {
    //     notFound()
    // }
    const deleteAction = deletBook.bind(null, id)
    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Bouton Retour */}
            <Link
                href="/admin/dashboard/books"
                className="text-sm text-zinc-500 hover:text-black mb-6 inline-block"
            >
                ← Retour à l'inventaire
            </Link>

            <div className="flex flex-col md:flex-row gap-12 mt-4">
                {/* Image de couverture */}
                <div className="w-full md:w-1/3">
                    <div className="aspect-2/3 relative rounded-2xl overflow-hidden shadow-2xl border dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                        {book.coverUrl ? (
                            <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-zinc-400">
                                Pas de couverture
                            </div>
                        )}
                    </div>
                </div>

                {/* Infos du livre */}
                <div className="flex-1">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs font-bold rounded-full uppercase">
                        {book.category}
                    </span>

                    <h1 className="text-4xl font-black mt-4 text-zinc-900 dark:text-zinc-100">
                        {book.title}
                    </h1>
                    <p className="text-xl text-zinc-500 mt-2">
                        par{' '}
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            {book.author}
                        </span>
                    </p>

                    <div className="grid grid-cols-2 gap-6 mt-8 py-6 border-y border-zinc-100 dark:border-zinc-800">
                        <div>
                            <p className="text-xs text-zinc-400 uppercase font-bold">
                                ISBN
                            </p>
                            <p className="font-mono text-zinc-700 dark:text-zinc-300">
                                {book.isbn}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-400 uppercase font-bold">
                                Disponibilité
                            </p>
                            <p
                                className={`font-bold ${book.availableStock > 0 ? 'text-emerald-500' : 'text-red-500'}`}
                            >
                                {book.availableStock} sur {book.totalStock}{' '}
                                exemplaires
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                            Résumé
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {book.description ||
                                'Aucune description disponible pour ce livre.'}
                        </p>
                    </div>

                    <div className="mt-10 flex gap-4">
                        <button className="px-6 py-3 bg-black dark:bg-white dark:text-black text-white rounded-xl font-bold hover:opacity-80 transition">
                            Modifier le livre
                        </button>
                        <form action={deleteAction}>
                            <button
                                type="submit"
                                className="px-6 py-3 border border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50 transition"
                            >
                                Supprimer
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
