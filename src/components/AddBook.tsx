import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBook } from '../features/bookReducer';
import { createBook, updateBook } from '../api/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Book } from '../features/bookReducer';

interface AddBookProps {
    selectedBook: Book | null;
    onBookSaved: () => void;
}

const AddBook: React.FC<AddBookProps> = ({ selectedBook, onBookSaved }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publishedDate, setPublishedDate] = useState<Date | null>(null);

    // Prefill form if editing
    useEffect(() => {
        if (selectedBook) {
            setTitle(selectedBook.title);
            setAuthor(selectedBook.author);
            setPublishedDate(new Date(selectedBook.publishedDate));
        } else {
            setTitle('');
            setAuthor('');
            setPublishedDate(null);
        }
    }, [selectedBook]);

    const handleSubmit = async () => {
        if (!publishedDate) return;

        const bookInput = {
            title,
            author,
            publishedDate: publishedDate.toISOString().split('T')[0]
        };

        try {
            if (selectedBook) {
            await updateBook(selectedBook.id.toString(), bookInput); // convert id to string here
        } else {
            const newBook = await createBook(bookInput);
            dispatch(addBook(newBook)); // add to Redux only when creating
        }

            // Reset form and notify parent
            onBookSaved();
        } catch (error) {
            console.error('Error saving book:', error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto my-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
                {selectedBook ? 'Edit Book' : 'Add Book'}
            </h2>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <DatePicker
                    selected={publishedDate}
                    onChange={(date) => setPublishedDate(date)}
                    placeholderText="Published Date"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dateFormat="yyyy-MM-dd"
                    showYearDropdown
                    dropdownMode="select"
                />
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                >
                    {selectedBook ? 'Update Book' : 'Add Book'}
                </button>
            </div>
        </div>
    );
};

export default AddBook;
