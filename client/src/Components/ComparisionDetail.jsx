import React from 'react';
import { FaStar } from 'react-icons/fa';

const ComparisionDetail = ({university}) => {
    return (
        <div>
            <div>
                <img src={university.image_url} alt={university.name} className="mb-4 rounded-lg shadow-md" />
                <h2 className="text-2xl font-semibold mb-2">{university.name}</h2>
                <div className="grid grid-cols-2 gap-x-4">
                    <div className="font-semibold">Location:</div>
                    <div>{university.location}</div>
                    <div className="font-semibold">Established Year:</div>
                    <div>{university.established_year}</div>
                    <div className="font-semibold">Total Students:</div>
                    <div>{university.total_students}</div>
                    <div className="font-semibold">Courses Offered:</div>
                    <div>{university.courses_offered.join(', ')}</div>
                    <div className="font-semibold">Tuition Fee:</div>
                    <div>{university.tuition_fee}</div>
                    <div className="font-semibold">Acceptance Rate:</div>
                    <div>{university.acceptance_rate}</div>
                    <div className="font-semibold">Student Faculty Ratio:</div>
                    <div>{university.student_faculty_ratio}</div>
                    <div className="font-semibold">Campus Size:</div>
                    <div>{university.campus_size}</div>
                    <div className="font-semibold">Ranking:</div>
                    <div>{university.ranking}</div>
                    <div className="font-semibold">Website:</div>
                    <div><a href={university.website} target='_blank' className="text-blue-500">{university.website}</a></div>
                    <div className="font-semibold">Google Review:</div>
                    <div>{university.google_review}</div>
                    <div className="font-semibold">UniReview:</div>
                    <div className='flex items-center'>{university.uniReview} <FaStar className='ml-1 text-yellow-500'/> <span className='ml-2'>({university.reviews?.length} Reviews)</span></div>
                </div>
            </div>
        </div>
    );
}

export default ComparisionDetail;