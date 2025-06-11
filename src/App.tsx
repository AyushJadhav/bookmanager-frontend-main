import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBooks } from './features/bookReducer';
import BooksList from './components/BooksList';
import AddBook from './components/AddBook';
import { fetchBooks, deleteBook } from './api/api';
import { Book } from './features/bookReducer';

const App: React.FC = () => {
    const dispatch = useDispatch();
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const loadBooks = async () => {
        const books = await fetchBooks();
        dispatch(setBooks(books));
    };

    useEffect(() => {
        loadBooks();
    }, [dispatch]);

    const handleEdit = (book: Book) => {
        setSelectedBook(book);
    };

    const handleDelete = async (id: number) => {
        await deleteBook(id);
        loadBooks();
    };

    const handleBookSaved = () => {
        loadBooks();
        setSelectedBook(null); // clear edit mode
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Book Management</h1>
                
                {/* Add/Edit Form */}
                <AddBook selectedBook={selectedBook} onBookSaved={handleBookSaved} />
                
                {/* Book List */}
                <BooksList onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </div>
    );
};

export default App;
