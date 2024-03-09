import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import {Link} from 'react-router-dom';
import { Button, Input, Space } from 'antd';
import Navbar from '../Components/Navbar';
const ResetPassword = () => {
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleLoginClick = async (e) => {
        e.preventDefault();
        if (formData.old_password === '' || formData.new_password === '') {
            toast.error("All fields are required");
            return;
        }       
        const token = typeof window !== 'undefined' ? window.localStorage.getItem("token") : null;
        console.log(token);
        try {
            const response = await fetch('http://localhost:8000/reset-password/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();       
            console.log(data);
            if (data.message === "Password reset successful") {
                toast.success("Password Reset Successfully");
                // window.location.replace("/profile")
            } else {
                toast.error(data.detail);
            }
        } catch (err) {         
            toast.error(err.response.data.message)   
            console.error(err);
        }
    };


    return (
        <div className="flex min-h-screen bg-gray-100">
            <Toaster />
            <Navbar />

            {/* <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${helloImage.src})` }}></div> */}
            <div className='w-full min-h-screen items-center flex justify-center'>
                <div className="lg:w-1/2 p-12 items-center p-16 mx-auto bg-white rounded-lg shadow-lg">
                    <h1 className="text-3xl font-extrabold text-gray-800">Reset Password</h1>
                    <form className="mt-8">
                        {/* Email Input */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                            <Input.Password placeholder="Enter Password"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                id="old_password"
                                value={formData.old_password}
                                onChange={handleInputChange}
                            />

                        </div>

                        {/* Password Input */}
                        <div className="mb-4">
                            <label htmlFor="repassword" className="block text-sm font-medium text-gray-600">Retype Password</label>
                            <Input.Password placeholder="Retype Password"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                id="new_password"
                                value={formData.new_password}
                                onChange={handleInputChange}
                            />

                        </div>

                        {/* Login Button */}
                        <div><Link to="/profile">
                            <button
                                type="button"
                                className="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300"
                            >
                                Go Back
                            </button>
                            </Link>
                            <button
                                type="button"
                                onClick={handleLoginClick}
                                className="px-4 ml-8 py-2 text-white bg-green-700 rounded-md hover:bg-green-800 focus:outline-none focus:ring focus:border-green-300"
                            >
                                Reset Password
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;