import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBook } from '../features/bookReducer';
import { createBook } from '../api/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddBook = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publishedDate, setPublishedDate] = useState<Date | null>(null);

    const handleAddBook = async () => {
        if (!publishedDate) return;
        
        const newBook = await createBook({
            title,
            author,
            publishedDate: publishedDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
        });
        dispatch(addBook(newBook));
        setTitle('');
        setAuthor('');
        setPublishedDate(null);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto my-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add Book</h2>
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
                    onClick={handleAddBook}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                >
                    Add Book
                </button>
            </div>
        </div>
    );
};

export default AddBook;