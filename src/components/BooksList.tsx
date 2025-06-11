import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Book, setBooks } from '../features/bookReducer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchBooksByDate } from '../api/api';

interface BookListProps {
    onEdit: (book: Book) => void;
    onDelete: (id: number) => void;
}

const BooksList: React.FC<BookListProps> = ({ onEdit, onDelete }) => {
    const books = useSelector((state: RootState) => state.books.books);
  const dispatch = useDispatch();
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const handleFilter = async () => {
  if (!filterDate) return;
  try {
    // Convert date to local yyyy-MM-dd format without time zone shifts
    const localDate = new Date(
      filterDate.getTime() - filterDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split('T')[0];

    const filteredBooks = await fetchBooksByDate(localDate);
    dispatch(setBooks(filteredBooks));
  } catch (err) {
    console.error('Failed to fetch books by date:', err);
  }
};
    return (
    <div className="container my-5">
      <div className="card shadow mb-4">
        <div className="card-body">
          <h2 className="card-title mb-3">Filter Books by Published Date</h2>
          <div className="d-flex align-items-center gap-2">
            <DatePicker
              selected={filterDate}
              onChange={(date) => setFilterDate(date)}
              placeholderText="Select a date"
              className="form-control"
              dateFormat="yyyy-MM-dd"
            />
            <button onClick={handleFilter} className="btn btn-primary">
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">Books</h2>
          <ul className="list-group list-group-flush">
            {books.map((book) => (
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