import {Book } from '../features/bookReducer';

const GRAPHQL_URL = 'http://localhost:8080/graphql';


export interface BookInput {
  title: string;
  author: string;
  publishedDate: string;
}

export const fetchBooks = async (): Promise<Book[]> => {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        {
          findAllBooks {
            id
            title
            author {
              id
              name
            }
            publishedDate
          }
        }
      `,
    }),
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors.map((e: any) => e.message).join(', '));
  return data.findAllBooks;
};

export const fetchBookById = async (id: number): Promise<Book> => {
    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
  query: `
    query ($id: ID!) {
      findBookById(id: $id) {
        id
        title
        author {
          id
          name
        }
        publishedDate
      }
    }
  `,
  variables: { id },
}),
    });

    const {data} = await response.json();
    return data.findBookById;
};

export const createBook = async (book: BookInput): Promise<Book> => {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation($book: BookInput!) {
          createBook(book: $book) {
            id
            title
            author {
              id
              name
            }
            publishedDate
          }
        }
      `,
      variables: { book },
    }),
  });

  const resText = await response.text();
try {
  const resJson = JSON.parse(resText);
  return resJson.data.createBook; // or relevant field
} catch {
  console.error('Response not JSON:', resText);
  throw new Error('Unexpected response from server');
}
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


export const updateBook = async (id: string, book: BookInput): Promise<Book> => {
  const response = await fetch(GRAPHQL_URL, {  // <-- Use full URL here
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation($id: ID!, $book: BookInput!) {
          updateBook(id: $id, book: $book) {
            id
            title
            author {
              id
              name
            }
            publishedDate
          }
        }
      `,
      variables: { id, book },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Network error: ${response.status} - ${errorText}`);
  }

  const resJson = await response.json();

  if (resJson.errors) {
    throw new Error(resJson.errors.map((e: any) => e.message).join(', '));
  }

  return resJson.data.updateBook;
};

export const fetchBooksByDate = async (date: string): Promise<Book[]> => {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
  query($publishedDate: String!) {
    findBooksByDate(publishedDate: $publishedDate) {
      id
      title
      author {
        id
        name
      }
      publishedDate
    }
  }
`,
      variables: { publishedDate: date },
    }),
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors.map((e: any) => e.message).join(', '));
  return data.findBooksByDate;
};