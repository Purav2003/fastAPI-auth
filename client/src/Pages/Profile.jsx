
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link } from 'react-router-dom'
import Loader from "../Components/Loader"
import Navbar from "../Components/Navbar";

const Profile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
  });




  const fetchData = async () => {
    const API_URL = `http://localhost:8000/profile`;
    console.log(API_URL);
    const token = typeof window !== 'undefined' ? window.localStorage.getItem("token") : null;

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${token}`,
        },
      });
      const data_new = await response.json();
      setData(data_new);

      setFormData({
        name: data_new.name,
        email: data_new.email,
        phone: data_new.phone
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };




  useEffect(() => {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem("token") : null;
    if (!token) {
      window.location.replace('/login');
    }

    fetchData();
  }, []);


  return (
    <div className="w-full flex relative ">
      <Navbar />
      <div className="w-full">
        <div className="min-h-screen w-full items-center justify-center bg-white font-sans">

          <Toaster />
          <div className="flex min-h-screen items-center justify-center">
            <div className="mt-8 lg:mt-0 md:mt-0 bg-white w-full max-w-2xl p-8 rounded-md lg:shadow-md">
              <h1 className="lg:text-3xl lg:ml-0 sm:ml-8 mt-12 lg:mt-0 text-xl font-bold text-gray-800 flex items-center mb-6">👨🏻‍💻 User Profile</h1>

              {loading ? <Loader /> : <div className="lg:flex sm:flex items-center space-x-4">
                <div className="lg:flex-1">
                  <div className="lg:flex-1 sm:flex-1 grid ml-4 lg:grid-cols-2 sm:grid-cols-2 w-full">
                    <div>
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-md font-medium text-gray-600">
                          Name:
                        </label>
                        <p className="text-md">
                          {formData?.name}
                        </p>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-md font-medium text-gray-600">
                          Email:
                        </label>
                        <p className="text-md">
                          {formData?.email}
                        </p>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-md font-medium text-gray-600">
                          Phone Number:
                        </label>
                        <p className="text-md">
                          {formData?.phone}
                        </p>
                      </div>

                    </div>
                  </div>
                  <div className="flex ml-4 mt-4">
                    <Link to={`/editProfile`}><button className="px-4 py-2 border border-green-500 bg-green-500 text-white rounded-md">Edit Profile</button></Link>
                    <Link to={`/resetPassword`}><button className="ml-8 px-4 py-2 border border-blue-500 bg-blue-500 text-white rounded-md">Reset Password</button></Link>
                  </div>
                </div>
              </div>}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default Profile;