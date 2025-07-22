import React, { useState } from "react";
import API from "../services/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const res = await API.post('/forgot-password', { email });
            setMessage(res.data.message || 'Password reset link sent successfully');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || "Password reset failed");
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card p-4 shadow" style={{ maxWidth: '450px', width: '100%' }}>
                <h2 className="text-center mb-4">Forgot Password</h2>

                {message && <div className="alert alert-success py-1 text-center">{message}</div>}
                {error && <div className="alert alert-danger py-1 text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email Address:</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            placeholder="Enter your registered email"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
