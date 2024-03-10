import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Loader from '../Components/Loader';
const UniversityDetail = () => {
    const [data, setData] = useState(null);
    const [loading,setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const query = window.location.href;
            const id = query.split('/')[4];
            const response = await axios.get(`http://localhost:8000/university/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching university data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
        <Navbar />
        <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            {loading? <Loader />: (
                <div>
                    <img src={data.image_url} alt={data.name} className="mb-4 rounded-lg shadow-md" />
                    <h2 className="text-2xl font-semibold mb-2">{data.name}</h2>
                    <div className="grid grid-cols-2 gap-x-4">
                        <div className="font-semibold">Location:</div>
                        <div>{data.location}</div>
                        <div className="font-semibold">Established Year:</div>
                        <div>{data.established_year}</div>
                        <div className="font-semibold">Total Students:</div>
                        <div>{data.total_students}</div>
                        <div className="font-semibold">Courses Offered:</div>
                        <div>{data.courses_offered.join(', ')}</div>
                        <div className="font-semibold">Tuition Fee:</div>
                        <div>{data.tuition_fee}</div>
                        <div className="font-semibold">Acceptance Rate:</div>
                        <div>{data.acceptance_rate}</div>
                        <div className="font-semibold">Student Faculty Ratio:</div>
                        <div>{data.student_faculty_ratio}</div>
                        <div className="font-semibold">Campus Size:</div>
                        <div>{data.campus_size}</div>
                        <div className="font-semibold">Ranking:</div>
                        <div>{data.ranking}</div>
                        <div className="font-semibold">Website:</div>
                        <div><a href={data.website} target='_blank' className="text-blue-500">{data.website}</a></div>
                        <div className="font-semibold">Google Review:</div>
                        <div>{data.google_review}</div>
                        <div className="font-semibold">UniReview:</div>
                        <div>{data.uniReview}</div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default UniversityDetail;
