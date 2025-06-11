import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import BooksList from '../../components/BooksList';
import booksReducer from '../../features/bookReducer';

describe('BooksList', () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                books: booksReducer,
            },
            preloadedState: {
                books: {
                    books: [
                        { id: 1, title: 'Book One', author: 'Author One', publishedDate: '2021-01-01' },
                        { id: 2, title: 'Book Two', author: 'Author Two', publishedDate: '2022-02-02' },
                    ],
                },
            },
        });
    });

    it('renders the list of books with edit and delete buttons', () => {
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();

        const { getByText } = render(
            <Provider store={store}>
                <BooksList onEdit={mockOnEdit} onDelete={mockOnDelete} />
            </Provider>
        );

        // Check that book titles and authors are rendered
        expect(getByText('Books')).toBeInTheDocument();
        expect(getByText('Book One')).toBeInTheDocument();
        expect(getByText('by Author One')).toBeInTheDocument();
        expect(getByText('Published: 1/1/2021')).toBeInTheDocument(); // depends on locale
        expect(getByText('Book Two')).toBeInTheDocument();

        // Check Edit/Delete buttons exist
        expect(getByText('Edit')).toBeInTheDocument();
        expect(getByText('Delete')).toBeInTheDocument();
    });

    it('calls onEdit and onDelete when buttons are clicked', () => {
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();

        const { getAllByText } = render(
            <Provider store={store}>
                <BooksList onEdit={mockOnEdit} onDelete={mockOnDelete} />
            </Provider>
        );

        // Get all Edit/Delete buttons (should be 2 of each)
        const editButtons = getAllByText('Edit');
        const deleteButtons = getAllByText('Delete');

        fireEvent.click(editButtons[0]);
        fireEvent.click(deleteButtons[1]);

        expect(mockOnEdit).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });
});
