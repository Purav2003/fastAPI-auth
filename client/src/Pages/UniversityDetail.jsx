// UniversityDetail.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Navbar from '../Components/Navbar';
import Loader from '../Components/Loader';
import Modal from 'react-modal';
import {toast,Toaster} from "react-hot-toast";
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const UniversityDetail = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);

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

    const handleCloseModal = () => {
        setShowModal(false);
        setRating(0);
    };

    const handleShowModal = () => setShowModal(true);

    const handleReviewChange = (e) => {
        setReview(e.target.value);
    };

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || review === "") {
            toast.error("All fields are required!");
            return;
        }
        try {
            const query = window.location.href;

            const id = query.split('/')[4];
            const data = await axios.post(`http://localhost:8000/university/add_review`, {
                star: rating,
                comment: review,
                university_id: id,
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                }
            )
            console.log(data)
            if (data?.data?.status === 200) {
                fetchData();
                toast.success(data?.data?.message);
                setReview("");
                setRating(0);
            }
            else{
                toast.error(data?.data?.message);
                setReview("");
                setRating(0);                
            }
            handleCloseModal();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="w-full h-full">
            <Navbar />
            <Toaster />
            <div className="mx-auto p-6 bg-gray-100 rounded-lg shadow-md h-full">
                {loading ? <Loader /> : (
                    <div className="h-full flex flex-col justify-between">
                        <div>
                            <img src={data.image_url} alt={data.name} className="mb-4 rounded-lg w-full object-contain h-[300px] shadow-md" />
                            <h2 className="text-2xl font-semibold mb-2">{data.name}</h2>
                            <div className="grid grid-cols-2 gap-x-4">
                                <div>
                                    <p className="font-semibold">Location:</p>
                                    <p>{data.location}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Established Year:</p>
                                    <p>{data.established_year}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Total Students:</p>
                                    <p>{data.total_students}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Courses Offered:</p>
                                    <p>{data.courses_offered.join(', ')}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Tuition Fee:</p>
                                    <p>{data.tuition_fee}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Acceptance Rate:</p>
                                    <p>{data.acceptance_rate}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Student Faculty Ratio:</p>
                                    <p>{data.student_faculty_ratio}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Campus Size:</p>
                                    <p>{data.campus_size}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Ranking:</p>
                                    <p>{data.ranking}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Website:</p>
                                    <p><a href={data.website} target='_blank' className="text-blue-500">{data.website}</a></p>
                                </div>
                                <div>
                                    <p className="font-semibold">Google Review:</p>
                                    <p>{data.google_review}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Rating:</p>
                                    <p className='flex items-center'>{data.uniReview} <FaStar className='ml-2 text-yellow-500' /></p>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
                <div className="font-semibold">Review:</div>
                <div className='grid grid-cols-4'>
                    {data?.reviews?.length>0? data?.reviews?.map((rate) => (
                        <div
                            className="rate-comment mt-3 bg-gray-200 ml-4 p-3 overflow-hidden overflow-ellipsis "
                            key={rate.rating}
                        >
                            <span className="font-bold">{rate?.user_name}</span>
                            <span className="flex mt-2">
                                {Array.from({ length: Math.floor(rate?.stars) }, (_, index) => (
                                    <FaStar key={index} className="text-yellow-500 ml-1" />
                                ))}

                                {/* Half star */}
                                {rate?.stars % 1 !== 0 && (
                                    <FaStarHalfAlt className="text-yellow-500 ml-1" />
                                )}

                                {/* Empty stars */}
                                {Array.from({ length: Math.floor(5 - rate?.stars) }, (_, index) => (
                                    <FaRegStar key={index} className="ml-1" />
                                ))}
                            </span>
                            <p className="mt-2">{rate.review}</p>
                        </div>
                    ))
                    :<div className="w-full border min-w-full py-12 flex items-center justify-center">
                        <h2>No reviews yet</h2>
                    </div>
                }

                </div>
                <button
                    className="bg-blue-500 rounded-md px-4 py-2 text-white m-4"
                    onClick={handleShowModal}
                >
                    Add Your Review
                </button>
                <Modal
                    isOpen={showModal}
                    onRequestClose={handleCloseModal}
                    style={customStyles}
                    contentLabel="Add Your Review"
                >
                    <h2 className='my-4'>Add Your Review</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='flex items-center'>
                            <label htmlFor="reviewTextarea" className='font-bold'>Your Review</label>
                            <textarea
                                id="reviewTextarea"
                                rows={2}
                                value={review}
                                className='border border-gray-200 outline-none p-1 ml-4'
                                onChange={handleReviewChange}
                            />
                        </div>
                        <div className='my-2 flex items-center'>
                            <label htmlFor="ratingStars" className='font-bold'>Rating</label>
                            <div className="flex ml-16">
                                {[...Array(5)].map((_, index) => (
                                    <FaStar
                                        key={index}
                                        className="text-yellow-500 cursor-pointer"
                                        onClick={() => handleRatingChange(index + 1)}
                                        style={{ marginRight: "5px" }}
                                        color={rating > index ? "#ffc107" : "#e4e5e9"}
                                    />
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="bg-blue-500 mt-2 text-white rounded-md px-4 py-2">
                            Submit
                        </button>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default UniversityDetail;
