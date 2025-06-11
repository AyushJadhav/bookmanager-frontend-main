import { createBook } from "../../api/api";
import React from "react";
import { Provider } from "react-redux";
import AddBook from "../../components/AddBook";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../../features/bookReducer";

jest.mock('../../api/api');
jest.mock('../../features/bookReducer', () => ({
    addBook: jest.fn(),
}));

describe('AddBook Component', () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                books: booksReducer,
            },
        });
        store.dispatch = jest.fn();

        // Mock createBook API return
        (createBook as jest.Mock).mockResolvedValue({
            id: 1,
            title: 'Test Book',
            author: 'Test Author',
            publishedDate: '2023-01-01'
        });
    });

    it('clears fields after adding a book', async () => {
        const mockOnBookSaved = jest.fn();

        const { getByPlaceholderText, getByText } = render(
            <Provider store={store}>
                <AddBook selectedBook={null} onBookSaved={mockOnBookSaved} />
            </Provider>
        );

        const titleInput = getByPlaceholderText('Title') as HTMLInputElement;
        const authorInput = getByPlaceholderText('Author') as HTMLInputElement;
        const datePicker = getByPlaceholderText('Published Date') as HTMLInputElement;
        const addButton = getByText('Add Book');

        // Simulate user input
        fireEvent.change(titleInput, { target: { value: 'Test Book' } });
        fireEvent.change(authorInput, { target: { value: 'Test Author' } });
        fireEvent.change(datePicker, { target: { value: '2023-01-01' } });

        // Click Add
        fireEvent.click(addButton);

        // Check that form was reset
        await waitFor(() => {
            expect(mockOnBookSaved).toHaveBeenCalled();
            expect(titleInput.value).toBe('');
            expect(authorInput.value).toBe('');
            expect(datePicker.value).toBe('');
        });
    });
});
