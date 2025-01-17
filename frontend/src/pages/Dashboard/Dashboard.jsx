import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import user_icon from './assets/user.png';

function Dashboard() {
  const [userInfo, setUserInfo] = useState({
    user_id: '',
    fullname: '',
    username: '',
    email: '',
    img: '',
    role: 0,
    wish_list: []
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response =await axios.post('http://localhost:8000/user/profile', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
        if (error.response && error.response.status === 401) {
          window.location.href = '/';
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('tokenExpireTime');
    window.location.href = '/'
  };

  const handleImageUser = (imgPath) => {
    return (imgPath === null || imgPath === 'string') ? user_icon : `http://localhost:8000/user/image/${imgPath}`;
  }

  return (
    <div className="wrapper">
      <div className="sidebar">
        <div className="sidebar-container">
          <h4 className="sidebar-title">Account Management</h4>
          <ul className="menu-list">
            <li className="menu-item menu-active">
              <a href="dashboard" className="link">Account Information</a>
            </li>
            <li className="menu-item">
              <a href="safetySettings" className="link">Account Security Setting</a>
            </li>
            <li className="menu-item">
              <a href={`profile/${userInfo.user_id}`} className="link">Profile</a>
            </li>
            <li className="menu-item logout">
              <a href="logout" className="link" onClick={handleLogout}>Log Out</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="content-container">
        <div className="account-info">
          <div className="content-title">Account Information</div>
          <div className="sub-title">Basic Information</div>
          <div className="account-content-container">
            <div className="account-avatar-container">
              <img
                src={handleImageUser(userInfo.img)}
                alt=""
                className="account-avatar-profile"
              />
            </div>
            <div className="account-info-container">
              <div className="account-info-item">
                <span className="account-info-label">Fullname</span>
                <span className="account-info-value">{userInfo.fullname}</span>
              </div>
              <div className="account-info-item">
                <span className="account-info-label">Username</span>
                <span className="account-info-value">{userInfo.username}</span>
              </div>
              <div className="account-info-item">
                <span className="account-info-label">Email</span>
                <span className="account-info-value">{userInfo.email}</span>
              </div>
              <div className="account-info-item">
                <span className="account-info-label">Role</span>
                {userInfo.role === 0 ? (
                  <span className="account-info-value">User</span>
                ) : (
                  <span className="account-info-value">Admin</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
