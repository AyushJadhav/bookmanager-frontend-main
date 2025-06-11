import {Book} from '../features/bookReducer';

const GRAPHQL_URL = 'http://localhost:8080/graphql';

export const fetchBooks = async (): Promise<Book[]> => {
    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `{
        findAllBooks {
          id
          title
          author
          publishedDate
        }
      }`,
        }),
    });

    const {data} = await response.json();
    return data.findAllBooks;
};

export const fetchBookById = async (id: number): Promise<Book> => {
    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `{
        findBookById {
          id
          title
          author
          publishedDate
        }
      }`,
            variables: {id: id},
        }),
    });

    const {data} = await response.json();
    return data.findBookById;
};

export const createBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `mutation($book: BookInput!) {
        createBook(book: $book) {
          id
          title
          author
          publishedDate
        }
      }`,
            variables: {book},
        }),
    });

    const resJson = await response.json();
    console.log('createBook response:', resJson); // 👈 log this

    if (resJson.errors) {
        throw new Error(resJson.errors.map((e: any) => e.message).join(', '));
    }

    return resJson.data.createBook;
};

export const deleteBook = async (id: string | number): Promise<boolean> => {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation DeleteBook($id: ID!) {
          deleteBook(id: $id)
        }
      `,
      variables: { id: id.toString() },  // always convert to string here
    }),
  });

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors.map((e: any) => e.message).join(', '));
  }

  return json.data.deleteBook;
};


export const updateBook = async (id: string, book: Omit<Book, 'id'>): Promise<Book> => {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation UpdateBook($id: ID!, $book: BookInput!) {
          updateBook(id: $id, book: $book) {
            id
            title
            author
            publishedDate
          }
        }
      `,
      variables: { id, book },
    }),
  });

  const resJson = await response.json();

  if (resJson.errors) {
    throw new Error(resJson.errors.map((e: any) => e.message).join(', '));
  }

  return resJson.data.updateBook;
};