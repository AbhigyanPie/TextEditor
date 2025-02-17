import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import './style.css';
import backgroundImage from './images/i4.jpg';

function Home() {
  const navigate = useNavigate();

  const createNewDocument = () => {
    const id = uuidV4();
    navigate(`/documents/${id}`);
  };

  return (
    <div className="home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
    {/* <div className="home-container"> */}
      <div className="content">
        <h1>Welcome to the Collaborative Text Editor</h1>
        <button onClick={createNewDocument} className="create-btn">
            Create New Document
        </button>
      </div>
    </div>
  );
}

export default Home;
