import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // named import, NOT default
import './Dashboard.css';
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
        <div className="app">
            {message && <div className="message">{message}</div>}

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Add Book</h2>
                    <button style={{ backgroundColor: 'orange' }} onClick={handleLogout}>
                        Logout
                    </button>
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
                    <div className="form-row">
                        <input
                            type="text"
                            name="author"
                            value={newBook.author}
                            onChange={handleInputChange}
                            placeholder="Author"
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        Add
                    </button>
                </form>
            </div>

            <div className="card">
                <h2>Find Book</h2>
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                        type="number"
                        placeholder="Enter Book ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <button type="submit" disabled={isLoading}>
                        Search
                    </button>
                </form>
            </div>

            <div className="card">
                <div className="list-header">
                    <h2>Books</h2>
                    <button onClick={() => {
                        // you can reuse fetchBooks logic here by repeating it inline or extract if needed
                        setIsLoading(true);
                        axios.get(`${apiUrl}/books`)
                            .then((response) => setBooks(response.data))
                            .catch(() => setMessage('Failed to load books'))
                            .finally(() => setIsLoading(false));
                    }} className="refresh" disabled={isLoading}>
                        Refresh
                    </button>
                </div>

                {isLoading ? (
                    <p className="loading">Loading...</p>
                ) : books.length === 0 ? (
                    <p className="no-data">No books found</p>
                ) : (
                    <ul className="book-list">
                        {books.map((book) => (
                            <li key={book.id}>
                                {editingBook && editingBook.id === book.id ? (
                                    <form onSubmit={updateBook} className="simple-edit-form">
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
                                        <div className="button-group">
                                            <button type="submit" className="save-btn" disabled={isLoading}>
                                                Save
                                            </button>
                                            <button type="button" className="cancel-btn" onClick={cancelEditing} disabled={isLoading}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="book-details">
                                            <strong>{book.title}</strong>
                                            <p>
                                                ID: {book.id} | Author: {book.author} | {book.createdAt}
                                            </p>
                                        </div>
                                        <div className="button-group">
                                            <button onClick={() => startEditing(book)} className="edit-btn" disabled={isLoading}>
                                                Edit
                                            </button>
                                            <button onClick={() => deleteBook(book.id)} className="delete" disabled={isLoading}>
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
