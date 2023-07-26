import React from "react";
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="container m-auto mt-4 d-flex flex-column">  
        <h1>PI2IT2</h1>
        <button className="btn btn-primary mt-2" key={"login"} onClick={() => navigate('/signup')}> Signup </button>
        <button className="btn btn-primary mt-2" key={"signup"} onClick={() => navigate('/login')}> Login </button>
      </div>
    </div>
  );
};

export default Home;
