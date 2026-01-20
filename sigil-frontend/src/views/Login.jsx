import { useState } from 'react';
import axiosClient from '../services/axios-client';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await axiosClient.get('/sanctum/csrf-cookie'); // Get CSRF cookie

            await axiosClient.post('/api/login', { email, password });

            const userResponse = await axiosClient.get('/api/user');
            console.log('Logged in user:', userResponse.data);
        }catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default LoginPage;