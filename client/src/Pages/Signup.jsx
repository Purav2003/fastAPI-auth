import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import axios from "axios";

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        repassword: '',
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleLoginClick = async (e) => {
        e.preventDefault();
        if (formData.email === '' || formData.password === '') {
            toast.error("All fields are required");
            return;
        }
        if(formData.password !== formData.repassword){
            toast.error("Password Do not Match")
            return;
        }
        const formDataToSend = new FormData();
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        
        console.log(formDataToSend)
        try {
            const response = await axios.post('http://localhost:8000/register/',formData);

            const data = await response;
            console.log(data);            
            if (data.status === 200) {
                window.location.replace('/login');
            } 
        } catch (err) {
            console.error(err);
            toast.error(err.response.data.detail);
        }
    };


    return (
        <div className="flex min-h-screen bg-gray-100">
            <Toaster />
            <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />

            {/* <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${helloImage.src})` }}></div> */}
            <div className='w-full min-h-screen items-center flex justify-center'>
                <div className="lg:w-1/2 p-12 items-center p-16 mx-auto bg-white rounded-lg shadow-lg">
                    <h1 className="text-3xl font-extrabold text-gray-800">Signup</h1>
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
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Retype Password</label>
                            <input
                                type="password"
                                id="repassword"
                                value={formData.repassword}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                                placeholder="Retype your password"
                                required
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleLoginClick}
                            className="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300"
                        >
                            Singup
                        </button>
                       
                       

                        {/* Signup Link */}
                        <div className='w-full justify-between flex'>
                            <div className="mt-2 text-sm text-gray-600">
                                <span>Already a user?</span>
                                <Link to="/login" className="ml-1 font-bold underline">Login</Link>
                            </div>                            
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
