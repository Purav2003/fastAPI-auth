import React from 'react';
import Navbar from '../Components/Navbar';
import AllUniversities from '../Components/AllUniversities';

const Dashboard = () => {
  return (
    <div>
        <Navbar />
        <div className="items-center justify-center h-screen">
            <h1 className="text-4xl font-bold px-16 ml-4 mt-16">All Universities</h1>
            <AllUniversities />
            </div>
    </div>
  );
}

export default Dashboard;