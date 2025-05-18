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
        <form onSubmit={handleLogin} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <h1>Login</h1>
            <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }} >
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" placeholder="email" required />
                <label htmlFor="password">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="password" required />
            </div>
            <button type="submit" style={{ marginLeft: "10px", padding: "10px 20px" }}>Login!</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form >
    </div >);
}