import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import user_icon from './assets/user.png';

function Dashboard() {
  const [userInfo, setUserInfo] = useState({
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
        // Handle error, e.g., redirect to login if unauthorized
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

  const avatarUrl = userInfo.img 
    ? `http://localhost:8000/user/image/${userInfo.img}`
    : {user_icon};

  return (
    <div className="wrapper">
      <div className="sidebar">
        <div className="sidebar-container">
          <h4 className="sidebar-title">Quản Lý Tài Khoản</h4>
          <ul className="menu-list">
            <li className="menu-item menu-active">
              <a href="dashboard" className="link">Thông tin tài khoản</a>
            </li>
            <li className="menu-item">
              <a href="safetySettings" className="link">Thiết lập an toàn tài khoản</a>
            </li>
            <li className="menu-item">
              <a href="personalReviews" className="link">Các bài review phim</a>
            </li>
            <li className="menu-item logout">
              <a href="logout" className="link" onClick={handleLogout}>Đăng xuất tài khoản</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="content-container">
        <div className="account-info">
          <div className="content-title">Thông Tin Tài Khoản</div>
          <div className="sub-title">Thông tin cơ bản</div>
          <div className="account-content-container">
            <div className="account-avatar-container">
              <img
                src={avatarUrl}
                alt=""
                className="account-avatar-profile"
              />
            </div>
            <div className="account-info-container">
              <div className="account-info-item">
                <span className="account-info-label">Tên người dùng</span>
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
                <span className="account-info-label">Vai trò</span>
                {userInfo.role === 0 ? (
                  <span className="account-info-value">Người dùng</span>
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
