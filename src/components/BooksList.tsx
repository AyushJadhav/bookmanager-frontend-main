import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Book } from '../features/bookReducer';

interface BookListProps {
    onEdit: (book: Book) => void;
    onDelete: (id: number) => void;
}

const BooksList: React.FC<BookListProps> = ({ onEdit, onDelete }) => {
    const books = useSelector((state: RootState) => state.books.books);

    return (
        <div className="container my-5">
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="card-title mb-4">Books</h2>
                    <ul className="list-group list-group-flush">
                        {books.map(book => (
                            <li key={book.id} className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-1">{book.title}</h5>
                                        <p className="mb-1 text-muted">by {book.author}</p>
                                        <small className="text-secondary">
                                            Published: {new Date(book.publishedDate).toLocaleDateString()}
                                        </small>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => onEdit(book)}
                                            className="btn btn-sm btn-outline-primary me-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(book.id)}
                                            className="btn btn-sm btn-outline-danger"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BooksList;
