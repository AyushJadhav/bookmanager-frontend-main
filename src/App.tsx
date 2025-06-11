import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setBooks } from './features/bookReducer';
import BooksList from './components/BooksList';
import AddBook from './components/AddBook';
import { fetchBooks } from './api/api';

const App: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const loadBooks = async () => {
            const books = await fetchBooks();
            dispatch(setBooks(books));
        };

        loadBooks();
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Book Management</h1>
                <AddBook />
                <BooksList />
            </div>
        </div>
    );
};

export default App;