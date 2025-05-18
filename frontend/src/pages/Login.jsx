import axios from "axios";
import { useState } from "react";


export default function Login() {

    const apiUrl = process.env.REACT_APP_API_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${apiUrl}/login`, {
                email,
                password,
            });

            const { accessToken } = response.data;
            localStorage.setItem("token", accessToken);


            console.log("Login successful");

            window.location.href = "/dashboard";

        } catch (error) {
            console.error("Login failed", error);
            setError("Login failed");
        }
    }


    return (<div>
        <form
            onSubmit={handleLogin}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '70vh',
                backgroundColor: '#e6f4ea', // light greenish background
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '320px',
                }}
            >
                <h1 style={{ marginBottom: '20px', fontWeight: '600', color: '#2a6f35' }}>Login</h1>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
                    <label htmlFor="email" style={{ fontWeight: '500', color: '#3a7d44' }}>
                        Email
                    </label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #a8d5a3',
                            fontSize: '16px',
                            outline: 'none',
                            transition: 'border-color 0.3s',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#4caf50')}
                        onBlur={(e) => (e.target.style.borderColor = '#a8d5a3')}
                    />

                    <label htmlFor="password" style={{ fontWeight: '500', color: '#3a7d44' }}>
                        Password
                    </label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                        style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #a8d5a3',
                            fontSize: '16px',
                            outline: 'none',
                            transition: 'border-color 0.3s',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#4caf50')}
                        onBlur={(e) => (e.target.style.borderColor = '#a8d5a3')}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        marginTop: '20px',
                        padding: '12px 25px',
                        backgroundColor: '#4caf50',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#388e3c')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#4caf50')}
                >
                    Login
                </button>

                {error && (
                    <p style={{ color: 'red', marginTop: '15px', fontWeight: '500' }}>{error}</p>
                )}
            </div>
        </form>

    </div >);
}