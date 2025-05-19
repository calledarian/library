import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';


const Dashboard = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [searchId, setSearchId] = useState('');
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ id: '', title: '', author: '', url: '' });
    const [editingBook, setEditingBook] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Helper to get fresh config with current token
    const getAuthConfig = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

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
                navigate('/login');
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            setMessage('');
            try {
                const response = await axios.get(`${apiUrl}/books`, getAuthConfig());
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
        setMessage('');
        try {
            const response = await axios.post(`${apiUrl}/books`, newBook, getAuthConfig());
            setBooks([...books, response.data]);
            setNewBook({ id: '', title: '', author: '', url: '' });
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
        setMessage('');
        try {
            const response = await axios.put(
                `${apiUrl}/books/${editingBook.id}`,
                editingBook,
                getAuthConfig()
            );
            setBooks(books.map((book) => (book.id === editingBook.id ? response.data : book)));
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
        setMessage('');
        try {
            await axios.delete(`${apiUrl}/books/${bookId}`, getAuthConfig());
            setBooks(books.filter((book) => book.id !== bookId));
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
        setMessage('');
        try {
            const response = await axios.get(`${apiUrl}/books/${bookId}`, getAuthConfig());
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

    // The JSX remains mostly the same as your original code
    // (You can add classNames instead of inline styles if you want)

    return (
        <div className="dashboard-container">
            {message && <div className="message-box">{message}</div>}

            {/* Add Book Card */}
            <div className="card add-book-card">
                <div className="card-header">
                    <h2>Add Book</h2>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>

                <form onSubmit={createBook}>
                    <div className="form-row">
                        <input
                            type="number"
                            name="id"
                            value={newBook.id}
                            onChange={handleInputChange}
                            placeholder="ID"
                            required
                        />
                        <input
                            type="text"
                            name="title"
                            value={newBook.title}
                            onChange={handleInputChange}
                            placeholder="Title"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="author"
                            value={newBook.author}
                            onChange={handleInputChange}
                            placeholder="Author"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="url"
                            name="url"
                            value={newBook.url}
                            onChange={handleInputChange}
                            placeholder="URL"
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>Add</button>
                </form>
            </div>

            {/* Find Book Card */}
            <div className="card find-book-card">
                <h2>Find Book</h2>
                <form onSubmit={handleSearchSubmit} className="form-row">
                    <input
                        type="number"
                        placeholder="Enter Book ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <button type="submit" disabled={isLoading}>Search</button>
                </form>
            </div>

            {/* Books List Card */}
            <div className="card books-list-card">
                <div className="card-header">
                    <h2>Books</h2>
                    <button
                        onClick={async () => {
                            setIsLoading(true);
                            setMessage('');
                            try {
                                const response = await axios.get(`${apiUrl}/books`, getAuthConfig());
                                setBooks(response.data);
                            } catch {
                                setMessage('Failed to load books');
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        disabled={isLoading}
                    >
                        Refresh
                    </button>
                </div>

                {isLoading ? (
                    <p className="loading-text">Loading...</p>
                ) : books.length === 0 ? (
                    <p className="no-books-text">No books found</p>
                ) : (
                    <ul className="books-list">
                        {books.map((book) =>
                            editingBook && editingBook.id === book.id ? (
                                <li key={book.id} className="book-item editing">
                                    <form onSubmit={updateBook} className="edit-form">
                                        <input
                                            type="text"
                                            name="title"
                                            value={editingBook.title}
                                            onChange={handleEditInputChange}
                                            placeholder="Title"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="author"
                                            value={editingBook.author}
                                            onChange={handleEditInputChange}
                                            placeholder="Author"
                                            required
                                        />
                                        <div className="edit-buttons">
                                            <button type="submit" disabled={isLoading}>Save</button>
                                            <button type="button" onClick={cancelEditing} disabled={isLoading}>Cancel</button>
                                        </div>
                                    </form>
                                </li>
                            ) : (
                                <li key={book.id} className="book-item">
                                    <div className="book-info">
                                        <strong>{book.title}</strong>
                                        <p>ID: {book.id} | Author: {book.author} | {new Date(book.createdAt).toLocaleDateString()}</p>
                                        <p>
                                            <a href={book.url} target="_blank" rel="noopener noreferrer" className="btn-view-link">
                                                Read More
                                            </a>
                                        </p>
                                    </div>
                                    <div className="book-actions">
                                        <button className="btn-edit" onClick={() => startEditing(book)} disabled={isLoading}>Edit</button>
                                        <button className="btn-delete" onClick={() => deleteBook(book.id)} disabled={isLoading}>×</button>
                                    </div>
                                </li>
                            )
                        )}
                    </ul>
                )}
            </div>
        </div>

    );
};

export default Dashboard;
