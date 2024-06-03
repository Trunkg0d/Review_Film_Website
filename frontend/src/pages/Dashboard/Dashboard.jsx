import React from 'react';
import './Dashboard.css';

// http://localhost:3000/user/dashboard

function Dashboard() {

    return (
        <div class="wrapper">
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
                    </ul>
                </div>
            </div>
            <div className="content-container">
                <div className="account-info">
                    <div className="content-title">Thông Tin Tài Khoản</div>
                    <div className="sub-title">Thông tin cơ bản</div>
                    <div className="account-content-container">
                        <div className="account-avatar-container">
                            <img src='https://i.pinimg.com/736x/2d/4c/fc/2d4cfc053778ae0de8e8cc853f3abec5.jpg' alt="" className="account-avatar-profile" />
                        </div>
                        <div className="account-info-container">
                            <div className="account-info-item">
                                <span className="account-info-label">Tên người dùng</span>
                                <span className="account-info-value">Robayusi</span>
                            </div>
                            <div className="account-info-item">
                                <span className="account-info-label">Email</span>
                                <span className="account-info-value">something@gmail.com</span>
                            </div>
                            <div className="account-info-item">
                                <span className="account-info-label">Vai trò</span>
                                {0 === 0 ? (
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
};

export default Dashboard;