import React from 'react';
import './Dashboard.css';

// http://localhost:3000/user/dashboard

function Dashboard() {

    const test_user = {
            "name": "Robayusi",
            "email": "f****pi@packt.com",
            "password": '********',
            "img": "https://i.pinimg.com/736x/2d/4c/fc/2d4cfc053778ae0de8e8cc853f3abec5.jpg",
            "role": 0,
            "wish_list": [
                            {
                            "_id": "5eb7cf5a86d9755df3a6c593",
                            "title": "FastAPI BookLaunch",
                            "image": "https://linktomyimage.com/image.png",
                            "description": "We will be discussing the contents of the FastAPI book in this event.Ensure to come with your own copy to win gifts!",
                            "tags": ["comedy", "korean", "18+"],
                            "language": "Vietnamese",
                            "runtime": 60,
                            "average_rating": 4.5
                            }
                          ]
    }

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
                            <img src={test_user['img']} alt="" className="account-avatar-profile" />
                        </div>
                        <div className="account-info-container">
                            <div className="account-info-item">
                                <span className="account-info-label">Tên người dùng</span>
                                <span className="account-info-value">{test_user['name']}</span>
                            </div>
                            <div className="account-info-item">
                                <span className="account-info-label">Email</span>
                                <span className="account-info-value">{test_user['email']}</span>
                            </div>
                            <div className="account-info-item">
                                <span className="account-info-label">Vai trò</span>
                                {test_user['role'] === 0 ? (
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