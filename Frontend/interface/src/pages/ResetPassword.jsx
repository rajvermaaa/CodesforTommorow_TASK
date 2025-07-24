import React, { useState } from "react";
import API from "../services/api";
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await API.post(`/reset-password/${token}`, {
                        newPassword: password,
                        confirmPassword
                        });
            setSuccess(res.data.message || 'Password has been reset successfully');
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || "Password reset failed");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow p-4" style={{ maxWidth: '450px', width: '100%' }}>
                <h2 className="text-center mb-4">Reset Password</h2>

                {success && <div className="alert alert-success py-1 text-center">{success}</div>}
                {error && <div className="alert alert-danger py-1 text-center">{error}</div>}

                {!submitted && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">New Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Confirm Password:</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Update Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
