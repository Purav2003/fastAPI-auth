import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 5;

const AllUniversities = () => {
    const [universities, setUniversities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUniversities = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/universities?page_no=${currentPage}&search_term=${searchTerm}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });
            setUniversities(response.data);
            setLoading(false);
            const totalCount = Number(response.headers['x-total-count']);
            setTotalPages(Math.ceil(totalCount / PAGE_SIZE));
        } catch (error) {
            console.error('Error fetching universities:', error);
        }
    };

    useEffect(() => {
        fetchUniversities();
    }, [currentPage, searchTerm]);

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="p-8">
            <div className="relative lg:mx-12 md:mx-12">
                <button className="absolute inset-y-0 left-2 text-gray-400 px-3 py-2 rounded-l">
                    <FaSearch />
                </button>
                <input
                    type="text"
                    placeholder="Enter University Name"
                    className="border rounded p-2 w-[350px] lg:w-[300px] outline-none rounded-full pl-12 py-3"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            {loading ? (
                <Loader />
            ) : universities?.length > 0 ? (
                <div className="mb-8 grid lg:grid-cols-4 grid-cols-1 md:grid-cols-2">
                    {universities.map((university) => (
                        <div key={university.id} className="items-center mb-4 px-12">
                            <Link to={`/university/${university.id}`}>
                                <img
                                    src={university.image_url}
                                    alt={university.name}
                                    className="w-64 h-64 rounded-md object-cover mt-12 hover:duration-200 hover:cursor-pointer filter hover:brightness-50"
                                />
                            </Link>
                            <div className="mt-3">
                                <p className="font-bold">{university.name}</p>
                                <p className="text-gray-600">{university.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center min-h-[70vh] flex items-center justify-center">No Universities Found</div>
            )}
            {universities?.length > 0 && (
                <div className="flex justify-center">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1} className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
                        Previous
                    </button>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Next
                    </button>
                </div>
            )}

        </div>
    );
};

export default AllUniversities;
