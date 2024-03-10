import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
// Component for the popup
const Popup = ({ universities, onSelect }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Select University</h2>
        <ul>
          {universities.map((university, index) => (
            <li key={index} className="cursor-pointer" onClick={() => onSelect(university)}>
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
          <div>
          <img src={selectedUniversity.box1.image_url} alt={selectedUniversity.box1.name} className="mb-4 rounded-lg shadow-md" />
          <h2 className="text-2xl font-semibold mb-2">{selectedUniversity.box1.name}</h2>
          <div className="grid grid-cols-2 gap-x-4">
              <div className="font-semibold">Location:</div>
              <div>{selectedUniversity.box1.location}</div>
              <div className="font-semibold">Established Year:</div>
              <div>{selectedUniversity.box1.established_year}</div>
              <div className="font-semibold">Total Students:</div>
              <div>{selectedUniversity.box1.total_students}</div>
              <div className="font-semibold">Courses Offered:</div>
              <div>{selectedUniversity.box1.courses_offered.join(', ')}</div>
              <div className="font-semibold">Tuition Fee:</div>
              <div>{selectedUniversity.box1.tuition_fee}</div>
              <div className="font-semibold">Acceptance Rate:</div>
              <div>{selectedUniversity.box1.acceptance_rate}</div>
              <div className="font-semibold">Student Faculty Ratio:</div>
              <div>{selectedUniversity.box1.student_faculty_ratio}</div>
              <div className="font-semibold">Campus Size:</div>
              <div>{selectedUniversity.box1.campus_size}</div>
              <div className="font-semibold">Ranking:</div>
              <div>{selectedUniversity.box1.ranking}</div>
              <div className="font-semibold">Website:</div>
              <div><a href={selectedUniversity.box1.website} target='_blank' className="text-blue-500">{selectedUniversity.box1.website}</a></div>
              <div className="font-semibold">Google Review:</div>
              <div>{selectedUniversity.box1.google_review}</div>
              <div className="font-semibold">UniReview:</div>
              <div>{selectedUniversity.box1.uniReview}</div>
          </div>
      </div>
        )}
      </div>

      {/* Giant Box 2 */}
      <div className="w-1/2 p-8 border border-gray-300 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">University 2</h2>
        <button onClick={() => handleAddUniClick('box2')} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Add Uni</button><br /><br></br>
        {selectedUniversity.box2 && (
          <div>
          <img src={selectedUniversity.box2.image_url} alt={selectedUniversity.box2.name} className="mb-4 rounded-lg shadow-md" />
          <h2 className="text-2xl font-semibold mb-2">{selectedUniversity.box2.name}</h2>
          <div className="grid grid-cols-2 gap-x-4">
              <div className="font-semibold">Location:</div>
              <div>{selectedUniversity.box2.location}</div>
              <div className="font-semibold">Established Year:</div>
              <div>{selectedUniversity.box2.established_year}</div>
              <div className="font-semibold">Total Students:</div>
              <div>{selectedUniversity.box2.total_students}</div>
              <div className="font-semibold">Courses Offered:</div>
              <div>{selectedUniversity.box2.courses_offered.join(', ')}</div>
              <div className="font-semibold">Tuition Fee:</div>
              <div>{selectedUniversity.box2.tuition_fee}</div>
              <div className="font-semibold">Acceptance Rate:</div>
              <div>{selectedUniversity.box2.acceptance_rate}</div>
              <div className="font-semibold">Student Faculty Ratio:</div>
              <div>{selectedUniversity.box2.student_faculty_ratio}</div>
              <div className="font-semibold">Campus Size:</div>
              <div>{selectedUniversity.box2.campus_size}</div>
              <div className="font-semibold">Ranking:</div>
              <div>{selectedUniversity.box2.ranking}</div>
              <div className="font-semibold">Website:</div>
              <div><a href={selectedUniversity.box2.website} target='_blank' className="text-blue-500">{selectedUniversity.box2.website}</a></div>
              <div className="font-semibold">Google Review:</div>
              <div>{selectedUniversity.box2.google_review}</div>
              <div className="font-semibold">UniReview:</div>
              <div>{selectedUniversity.box2.uniReview}</div>
          </div>
      </div>
        )}
      </div>

      {showPopup && <Popup universities={universities} onSelect={handleUniversitySelect} />}
    </div>
    </>
  );
};

export default ComparisonPage;
