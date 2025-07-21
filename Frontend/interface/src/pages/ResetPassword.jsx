import React, {useState} from "react";
import API from "../services/api";
import { useParams} from 'react-router-dom';


const ResetPassword = () => {
    const {token} = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('')

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await API.post(`/reset-password/${token}`, {password});
            setSuccess(res.data.message || 'Password has been reset successfully');
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || "Password reset failed");
        }
    };

    return(
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-md bg-white">
            <h2 className="text-2xl font-semibold mb-4"> Reset Password</h2>

            {success && <p className="text-green-600 mb-4">{success}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}


            {!submitted && (
                <form onSubmit={handleSubmit} className="space-y-4">  
                <div>
                    <label  className="block mb-2"> New Password:</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label  className="block mb-2"> Confirm Password:</label>
                    <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded" />
                </div>

                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">Update Password</button>
                    
                </form>
            )}

            
        </div>
    );

}

export default ResetPassword;