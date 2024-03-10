import React, { useState, useEffect, SyntheticEvent } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import axios from "axios";
const ForgotPasswordEmail = () => {
    const [formData, setFormData] = useState({
        email: '',
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleLoginClick = async (e) => {
        e.preventDefault();
        if (formData.email === '') {
            toast.error("Email is required");
            return;
        }
        typeof window !== 'undefined' ? window.localStorage.setItem("ForgotEmail", formData.email) : ""
        typeof window !== 'undefined' ? window.localStorage.setItem("otpVerified", "false") : ""
        try {
            const response = await axios.post(`http://localhost:8000/forgot-password`, { email: formData.email });
            console.log(response);

            if (response.status === 200) {
                toast.success(response.data.message);
                window.location.replace('/forgot-password/validation');
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response.data.detail);
            console.error(err);
        }
    };

    useEffect(() => {
        typeof window !== 'undefined' ? window.localStorage.clear() : ""
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Toaster />
            <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />

            {/* <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${helloImage.src})` }}></div> */}
            <div className='w-full min-h-screen items-center flex justify-center'>
                <div className="lg:w-1/2 p-12 items-center p-16 mx-auto bg-white rounded-lg shadow-lg">
                    <h1 className="text-3xl font-extrabold text-gray-800">Forgot Password</h1>
                    <form className="mt-8">
                        {/* Email Input */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {/* Password Input */}


                        {/* Login Button */}
                        <Link to="/login">
                            <button
                                type="button"
                                className="px-4 py-2 text-white bg-green-700 rounded-md hover:bg-green-800 focus:outline-none focus:ring focus:border-green-300"
                            >
                                Go Back
                            </button>
                        </Link>
                        <button
                            type="button"
                            onClick={handleLoginClick}
                            className="ml-4 px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300"
                        >
                            Send OTP
                        </button>


                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordEmail;
