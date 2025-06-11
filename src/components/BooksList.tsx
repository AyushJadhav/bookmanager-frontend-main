import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const BooksList = () => {
    const books = useSelector((state: RootState) => state.books.books);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto my-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Books</h2>
            <ul className="space-y-2">
                {books.map(book => (
                    <li 
                        key={book.id}
                        className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition duration-200"
                    >
                        <h3 className="font-semibold text-lg">{book.title}</h3>
                        <p className="text-gray-600">by {book.author}</p>
                        <p className="text-sm text-gray-500">
                            Published: {new Date(book.publishedDate).toLocaleDateString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BooksList;