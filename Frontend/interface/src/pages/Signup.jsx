import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
;

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate()
    const [message, setMessage] = useState('');
    const[error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //Handle form submission 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const res = await API.post('/signup', formData);
            if(res.status === 200){
                setMessage('Sign up Successful! You are ready to login.');
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: ""
                });
            }
        } catch(err) {
            setError(err.response?.data?.message || "Signup failed");
        }
            
    };
    
    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
            <div className=" max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800"> Create your Account </h2>

            {message && <p className="text-green-600 mb-4">{message}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium ">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 border rounded"></input>
                </div>

                <div>
                    <label className="block font-medium">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 border rounded"></input>
                </div>

                <div>
                    <label className="block font-medium">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded"></input>
                </div>

                <div>
                    <label className="block font-medium">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded"></input>
                </div>
                <br />

                <button type="submit" className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-600">SignUP</button>
            </form>

            <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
            >
                Login
            </span>
            </p>
            </div>
            

        </div>
    );
};

export default Signup;
