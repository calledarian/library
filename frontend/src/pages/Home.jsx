import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('id');

    const sortBooks = (booksArray, criterion) => {
        return [...booksArray].sort((a, b) => {
            if (criterion === 'id') return a.id - b.id;
            if (criterion === 'title') return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
            if (criterion === 'author') return a.author.localeCompare(b.author, undefined, { sensitivity: 'base' });
            return 0;
        });
    };

    useEffect(() => {
        axios.get(`${apiUrl}/books`)
            .then(response => {
                setBooks(sortBooks(response.data, sortBy));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                setLoading(false);
            });
    }, [apiUrl, sortBy]);

    useEffect(() => {
        setBooks(prevBooks => sortBooks(prevBooks, sortBy));
    }, [sortBy]);

    if (loading) {
        return <div className="home-container"><p>Loading books...</p></div>;
    }

    return (
        <div className="home-container">
            <h1 className="home-title">Library Books</h1>

            <div className="sort-login-container">
                <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="id">Sort by ID</option>
                    <option value="title">Sort by Title</option>
                    <option value="author">Sort by Author</option>
                </select>

                <button
                    className="login-button"
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>
            </div>

            {books.length === 0 ? (
                <p>No books available.</p>
            ) : (
                <div className="books-grid">
                    {books.map(book => (
                        <div
                            key={book.id}
                            className="book-card"
                            onClick={() => window.open(book.url, '_blank')}
                        >
                            <BookOpen size={48} className="book-icon" />
                            <div className="book-id">ID: {book.id}</div>
                            <div className="book-title">{book.title}</div>
                            <div className="book-author">by {book.author}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
