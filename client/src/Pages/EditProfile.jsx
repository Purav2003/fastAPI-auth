
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link } from 'react-router-dom'
import Loader from "../Components/Loader"
import Navbar from "../Components/Navbar";
import axios from "axios";

const EditProfile = ({ id }) => {
    const [data, setData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
    });
    const [formDataone, setFormDataone] = useState({
        email: '',
    });

    const handleEmailChange = (e) => {
        setFormData({
            ...formData,
            email: e.target.value,
        });
    };




    const fetchData = async () => {
        const API_URL = `http://localhost:8000/profile/`;
        console.log(API_URL);
        const token = typeof window !== 'undefined' ? window.localStorage.getItem("token") : null;
        console.log(token)
        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${token}`,
                },
            });
            const data_new = await response.json();
            if (data_new.status === "error") {
                toast.error(data_new.message)
            }

            setData(data_new);

            setFormDataone({
                email: data_new.email,
            });
            setFormData({
                email: data_new.email,
            });
            console.log(data_new);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (formData.email === '') {
            toast.error("Email is required")
            return
        }
        if (formData.email === formDataone.email) {
            toast.error("No changes made")
            return
        }
    

        const formDataToSend = new FormData();
     formDataToSend.append('new_email', formData.email);
    
    try {
        const token = window.localStorage.getItem("token");
        const response = axios.put(
            'http://localhost:8000/update-email/',
            { new_email: formData.email }, // Pass the request body properly
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            }
        );

        const data = await response
        console.log(data);

        if (data.status === 200) {
            toast.success(data.data.message);
            // const timer = setTimeout(() => {
            // window.location.replace('/profile');
            // }
            // , 1200);
            fetchData();
            // return () => clearTimeout(timer);
        }
        else {
            toast.error(data.message)
        }
    } catch (err) {
        toast.error(err.response.data.detail)
        console.error(err);
    }
    }



useEffect(() => {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem("token") : null;
    if (!token) {
        window.location.replace('/login');
    }
    fetchData();
}, []);


return (<div className="w-full flex ">
    <Navbar />
    <div className="w-full">
        <div className="min-h-screen flex items-center justify-center bg-white font-sans">
            <Toaster />

            <div className="bg-white w-full max-w-2xl p-8 rounded-md lg:shadow-md">
                <h1 className="lg:text-3xl lg:ml-0 sm:ml-8 mt-12 lg:mt-0 text-xl font-bold text-gray-800 flex items-center mb-6">Edit Your Profile</h1>

                {loading ? <Loader /> : <div className="lg:flex md:flex items-center">



                    <div className="ml-8 w-full mt-8 ">
                        <form>
                            <div>
                                <div className="grid lg:grid-cols-2 md:grid-cols-2  w-full">
                                    <div>

                                        <div className="mb-4">
                                            <label htmlFor="name" className="block text-md font-medium text-gray-600">
                                                Email:
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="w-full"
                                                placeholder="Enter your Email"
                                                value={formData?.email}
                                                onChange={handleEmailChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link to='/profile'>
                                        <button
                                            type="button"
                                            className="w-[1/2] px-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                                        >
                                            Go Back
                                        </button>
                                    </Link>
                                    <button
                                        type="button"
                                        className="w-[1/2] ml-2 px-4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                                        onClick={handleUpdate}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>}
            </div>


        </div ></div>
</div>
);
}

export default EditProfile;