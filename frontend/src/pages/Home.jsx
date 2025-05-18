import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('id');

    const sortBooks = (booksArray, criterion) => {
        return [...booksArray].sort((a, b) => {
            if (criterion === 'id') {
                return a.id - b.id;
            } else if (criterion === 'title') {
                return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
            } else if (criterion === 'author') {
                return a.author.localeCompare(b.author, undefined, { sensitivity: 'base' });
            }
            return 0;
        });
    };

    useEffect(() => {
        axios.get(`${apiUrl}/books`)
            .then(response => {
                const sorted = sortBooks(response.data, sortBy);
                setBooks(sorted);
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
        return (
            <div style={{
                maxWidth: '900px',
                margin: '40px auto',
                fontFamily: "'Georgia', serif",
                padding: '20px',
                backgroundColor: '#f5f2ea',
                color: '#4b3b2b',
            }}>
                <p>Loading books...</p>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: '900px',
            margin: '40px auto',
            fontFamily: "'Georgia', serif",
            padding: '20px',
            backgroundColor: '#f5f2ea',
            color: '#4b3b2b',
        }}>
            <h1 style={{
                textAlign: 'center',
                marginBottom: '10px',
                color: '#2f4f2f',
                fontSize: '2.5rem',
                fontWeight: 'bold',
            }}>
                Library Books
            </h1>

            {/* Container for sort select and login button */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                    maxWidth: '300px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            >
                <select
                    style={{
                        padding: '8px 12px',
                        fontSize: '1rem',
                        borderRadius: '5px',
                        border: '1px solid #7d6e58',
                        color: '#4b3b2b',
                        backgroundColor: 'white',
                        outline: 'none',
                        cursor: 'pointer',
                        flex: '1',
                        marginRight: '10px',
                    }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="id">Sort by ID</option>
                    <option value="title">Sort by Title</option>
                    <option value="author">Sort by Author</option>
                </select>

                <button
                    onClick={() => navigate('/login')}
                    style={{
                        backgroundColor: '#556b2f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 16px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'background-color 0.3s ease',
                        flexShrink: 0,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#435621')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#556b2f')}
                >
                    Login
                </button>
            </div>

            {books.length === 0 ? (
                <p>No books available.</p>
            ) : (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    justifyContent: 'center',
                }}>
                    {books.map(book => (
                        <div key={book.id} style={{
                            backgroundColor: '#e6dfd5',
                            boxShadow: '0 4px 8px rgba(75, 59, 43, 0.2)',
                            borderRadius: '10px',
                            padding: '20px',
                            width: '220px',
                            cursor: 'default',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            color: '#4b3b2b',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(47, 79, 47, 0.3)';
                                e.currentTarget.style.backgroundColor = '#d3c7b2';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(75, 59, 43, 0.2)';
                                e.currentTarget.style.backgroundColor = '#e6dfd5';
                            }}
                        >
                            <BookOpen size={48} style={{
                                color: '#556b2f',
                                marginBottom: '15px',
                            }} />
                            <div style={{
                                fontSize: '12px',
                                color: '#7d6e58',
                                marginBottom: '8px',
                                fontStyle: 'italic',
                            }}>ID: {book.id}</div>
                            <div style={{
                                fontWeight: '700',
                                fontSize: '18px',
                                marginBottom: '6px',
                                fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
                            }}>{book.title}</div>
                            <div style={{
                                fontSize: '14px',
                                color: '#5a4b3c',
                                fontStyle: 'italic',
                            }}>by {book.author}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
