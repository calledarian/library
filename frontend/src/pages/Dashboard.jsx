import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // named import, NOT default
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [searchId, setSearchId] = useState('');
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ id: '', title: '', author: '' });
    const [editingBook, setEditingBook] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('token');

        if (!accessToken) {
            navigate('/');
            return;
        }

        try {
            const decodedToken = jwtDecode(accessToken);
            if (decodedToken.exp * 1000 < Date.now()) {
                localStorage.removeItem('token');
                navigate('/');
            }
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }, [navigate]);

    const getAuthConfig = () => {
        const accessToken = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
    };
    const config = getAuthConfig();



    // Fetch books on mount
    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${apiUrl}/books`);
                setBooks(response.data);
            } catch (error) {
                setMessage('Failed to load books');
                console.error('Error fetching books:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, [apiUrl]);

    const showMessage = (text) => {
        setMessage(text);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchId.trim()) getBookById(Number(searchId));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook({ ...newBook, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingBook({ ...editingBook, [name]: value });
    };

    const createBook = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/books`, newBook, config);
            setBooks([...books, response.data]);
            setNewBook({ id: '', title: '', author: '' });
            showMessage('Book added successfully');
        } catch (error) {
            showMessage('Failed to add book');
            console.error('Error creating book:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const startEditing = (book) => {
        setEditingBook({ ...book });
    };

    const cancelEditing = () => {
        setEditingBook(null);
    };

    const updateBook = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.put(`${apiUrl}/books/${editingBook.id}`, editingBook, config);
            setBooks(books.map(book => (book.id === editingBook.id ? response.data : book)));
            setEditingBook(null);
            showMessage('Book updated successfully');
        } catch (error) {
            showMessage('Failed to update book');
            console.error('Error updating book:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteBook = async (bookId) => {
        setIsLoading(true);
        try {
            await axios.delete(`${apiUrl}/books/${bookId}`, config);
            setBooks(books.filter(book => book.id !== bookId));
            showMessage('Book deleted');
        } catch (error) {
            showMessage('Failed to delete book');
            console.error('Error deleting book:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getBookById = async (bookId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/books/${bookId}`);
            setBooks([response.data]);
            setSearchId('');
        } catch (error) {
            showMessage('Book not found');
            console.error('Error finding book:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div
            style={{
                maxWidth: '900px',
                margin: '20px auto',
                fontFamily: 'Arial, sans-serif',
                padding: '10px',
            }}
        >
            {message && (
                <div
                    style={{
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        border: '1px solid #c3e6cb',
                        borderRadius: '5px',
                        padding: '10px',
                        marginBottom: '15px',
                        textAlign: 'center',
                    }}
                >
                    {message}
                </div>
            )}

            {/* Add Book Card */}
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    marginBottom: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px',
                    }}
                >
                    <h2 style={{ margin: 0 }}>Add Book</h2>
                    <button
                        onClick={handleLogout}
                        style={{
                            backgroundColor: 'orange',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '8px 15px',
                            cursor: 'pointer',
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                    >
                        Logout
                    </button>
                </div>

                <form onSubmit={createBook}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <input
                            type="number"
                            name="id"
                            value={newBook.id}
                            onChange={handleInputChange}
                            placeholder="ID"
                            required
                            style={{
                                flex: '1',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                            }}
                        />
                        <input
                            type="text"
                            name="title"
                            value={newBook.title}
                            onChange={handleInputChange}
                            placeholder="Title"
                            required
                            style={{
                                flex: '2',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="text"
                            name="author"
                            value={newBook.author}
                            onChange={handleInputChange}
                            placeholder="Author"
                            required
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Add
                    </button>
                </form>
            </div>

            {/* Find Book Card */}
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    marginBottom: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
            >
                <h2 style={{ marginBottom: '15px' }}>Find Book</h2>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="number"
                        placeholder="Enter Book ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        style={{
                            flex: '1',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            backgroundColor: '#2196F3',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Books List Card */}
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px',
                    }}
                >
                    <h2 style={{ margin: 0 }}>Books</h2>
                    <button
                        onClick={() => {
                            setIsLoading(true);
                            axios
                                .get(`${apiUrl}/books`)
                                .then((response) => setBooks(response.data))
                                .catch(() => setMessage('Failed to load books'))
                                .finally(() => setIsLoading(false));
                        }}
                        disabled={isLoading}
                        style={{
                            backgroundColor: '#555',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '8px 15px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Refresh
                    </button>
                </div>

                {isLoading ? (
                    <p style={{ fontStyle: 'italic', textAlign: 'center' }}>Loading...</p>
                ) : books.length === 0 ? (
                    <p style={{ fontStyle: 'italic', textAlign: 'center' }}>No books found</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {books.map((book) => (
                            <li
                                key={book.id}
                                style={{
                                    borderBottom: '1px solid #ddd',
                                    padding: '10px 0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                {editingBook && editingBook.id === book.id ? (
                                    <form onSubmit={updateBook} style={{ display: 'flex', gap: '10px', flex: 1 }}>
                                        <input
                                            type="text"
                                            name="title"
                                            value={editingBook.title}
                                            onChange={handleEditInputChange}
                                            placeholder="Title"
                                            required
                                            style={{
                                                flex: 2,
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ccc',
                                            }}
                                        />
                                        <input
                                            type="text"
                                            name="author"
                                            value={editingBook.author}
                                            onChange={handleEditInputChange}
                                            placeholder="Author"
                                            required
                                            style={{
                                                flex: 2,
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ccc',
                                            }}
                                        />
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                style={{
                                                    backgroundColor: '#4CAF50',
                                                    color: 'white',
                                                    padding: '6px 12px',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                                }}
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEditing}
                                                disabled={isLoading}
                                                style={{
                                                    backgroundColor: '#f44336',
                                                    color: 'white',
                                                    padding: '6px 12px',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div style={{ flex: 1 }}>
                                            <strong>{book.title}</strong>
                                            <p style={{ margin: '5px 0', color: '#555', fontSize: '14px' }}>
                                                ID: {book.id} | Author: {book.author} | {book.createdAt}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => startEditing(book)}
                                                disabled={isLoading}
                                                style={{
                                                    backgroundColor: '#2196F3',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    padding: '6px 12px',
                                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteBook(book.id)}
                                                disabled={isLoading}
                                                style={{
                                                    backgroundColor: '#f44336',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    padding: '6px 12px',
                                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>

    );
};

export default Dashboard;
