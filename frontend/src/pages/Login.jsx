import axios from "axios";
import { useState } from "react";
import "../styles/Login.css";

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
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-box">
                <h1 className="login-title">Login</h1>
                <div className="login-form">
                    <label htmlFor="email" className="login-label">Email</label>
                    <input
                        className="login-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                    />

                    <label htmlFor="password" className="login-label">Password</label>
                    <input
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <button type="submit" className="login-button">Login</button>

                {error && <p className="login-error">{error}</p>}
            </form>
        </div>
    );
}
