import React, {useState} from "react";
import API from "../services/api";


const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const[error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('')

        try {
            const res = await API.post('/forgot-password', {email});
            setMessage(res.data.message || 'Password reset link sent successfully');
            setEmail('');
        } catch(err) {
            setError(err.response?.data?.message || "Password reset failed");
        }
    };

    return(
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-md bg-white">
            <h2 className="text-2xl font-semibold mb-4"> Forgot Password</h2>

            {message && <p className="text-green-600 mb-4">{message}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                

                <div>
                    <label className="block font-medium">Email Address</label>
                    <input type="email" name="email" value={email} className="w-full p-2 border rounded" 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email address"
                    ></input>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-600">Send Reset Link</button>
            </form>
        </div>
    );
}    

export default ForgotPassword;