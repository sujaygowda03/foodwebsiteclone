import React from 'react';
import { Link } from 'react-router-dom';
import './TopBar.css';
import { useAuth } from '../context/AuthContext';

const TopBar = () => {
  const username = localStorage.getItem('username');
  const { isLoggedIn } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <section className="topBarSection">
      <div className="companyTitle">
        <Link to='/' className='link'>
          <h2>QUICK</h2>
        </Link>
      </div>
      <div className="userAuth">
        {username ? (
          <>
            <span>Hi, {username}</span>
            <button className="logoutButton" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to='/login' className='link'>
            Login / SignUp
          </Link>
        )}
      </div>
    </section>
  );
};

export default TopBar;