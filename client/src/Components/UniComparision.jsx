import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import ComparisionDetail from './ComparisionDetail';
import { IoIosClose } from "react-icons/io";

// Component for the popup
const Popup = ({ universities, onSelect, setShowPopup }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUniversities, setFilteredUniversities] = useState(universities);
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
      };
    useEffect(() => {
        setFilteredUniversities(universities.filter(university =>
            university.name.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    }, [searchQuery, universities]);   
    return (
        <div className="fixed top-10 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg">
                <div className='flex justify-between items-center'>
                    <h2 className="text-xl font-semibold mb-4">Select University</h2>
                    <h2 className='text-2xl hover:cursor-pointer font-semibold mb-4 ml-4' onClick={() => setShowPopup(false)}><IoIosClose /></h2>
                </div>
                <div>
                    <input type="text" onChange={handleSearchChange} placeholder="Search University" className="border rounded p-2 w-full outline-none rounded-md pl-4 py-3" />
                </div>
                <br></br>

                <ul>
                    {filteredUniversities.map((university, index) => (
                        <li key={index} className="cursor-pointer py-2 overflow-auto" onClick={() => onSelect(university)}>
                            {university.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// Component for the giant boxes
const ComparisonPage = () => {
    const [universities, setUniversities] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedUniversity, setSelectedUniversity] = useState({
        box1: null,
        box2: null,
    });

    useEffect(() => {
        // Fetch universities from API
        axios.get('http://localhost:8000/universities', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setUniversities(response.data);
            })
            .catch(error => {
                console.error('Error fetching universities:', error);
            });
    }, []);

    const handleAddUniClick = (boxNumber) => {
        setShowPopup(true);
        setSelectedUniversity(prevState => ({
            ...prevState,
            [boxNumber]: null,
        }));
    };

    const handleUniversitySelect = (university) => {
        const boxNumber = selectedUniversity.box1 ? 'box2' : 'box1';
        setSelectedUniversity(prevState => ({
            ...prevState,
            [boxNumber]: university,
        }));
        setShowPopup(false);
    };

    return (
        <>
            <Navbar /><br></br>
            <div className="flex justify-between">
                {/* Giant Box 1 */}
                <div className="w-1/2 p-8 border border-gray-300 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">University 1</h2>
                    <button onClick={() => handleAddUniClick('box1')} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Add Uni</button><br></br><br></br>
                    {selectedUniversity.box1 && (
                        <ComparisionDetail university={selectedUniversity.box1} />
                    )}
                </div>

                {/* Giant Box 2 */}
                <div className="w-1/2 p-8 border border-gray-300 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">University 2</h2>
                    <button onClick={() => handleAddUniClick('box2')} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Add Uni</button><br /><br></br>
                    {selectedUniversity.box2 && (
                        <ComparisionDetail university={selectedUniversity.box2} />
                    )}
                </div>

                {showPopup && <Popup universities={universities} onSelect={handleUniversitySelect} setShowPopup={setShowPopup} />}
            </div>
        </>
    );
};

export default ComparisonPage;
