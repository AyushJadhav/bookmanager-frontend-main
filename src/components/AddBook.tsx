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
                await updateBook(selectedBook.id.toString(), bookInput);
            } else {
                const newBook = await createBook(bookInput);
                dispatch(addBook(newBook));
            }
            onBookSaved();
        } catch (error) {
            console.error('Error saving book:', error);
        }
    };

    return (
        <div className="bg-light p-4 rounded shadow-sm mx-auto my-4" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4 text-center">{selectedBook ? 'Edit Book' : 'Add Book'}</h2>
            <form>
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <DatePicker
                        selected={publishedDate}
                        onChange={(date) => setPublishedDate(date)}
                        placeholderText="Published Date"
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                        showYearDropdown
                        dropdownMode="select"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn btn-primary w-100"
                >
                    {selectedBook ? 'Update Book' : 'Add Book'}
                </button>
            </form>
        </div>
    );
};

export default AddBook;
