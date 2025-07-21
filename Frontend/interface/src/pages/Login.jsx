import {useNavigate} from 'react-router-dom';
import API from "../services/api";
import React, { useState } from "react";
  


const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        
        try {
            const res = await API.post('/login', formData);
            if(res.data?.token){
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/dashboard');
            }
        } catch(err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return(
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-md bg-white">
            <h2 className="text-2xl font-semibold mb-4">Login</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
            

                <div>
                    <label className="block font-medium">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded"></input>
                </div>

                <div>
                    <label className="block font-medium">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded"></input>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-600">Login</button>
            </form>
        </div>
    );  
};

export default Login;