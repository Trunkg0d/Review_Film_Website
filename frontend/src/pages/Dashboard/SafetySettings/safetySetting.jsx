import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './safetySetting.css';
import change_icon from '../assets/pen.png';
import save_icon from '../assets/save.png';

function SafetySetting() {
  const [userInfo, setUserInfo] = useState({
    fullname: 'Test fullname',
    username: 'Test username',
    email: 'Test email',
    img: '',
    role: 0,
    wish_list: []
  });

  const [isEditing, setIsEditing] = useState({
    fullname: false,
    username: false,
    email: false
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post('http://localhost:8000/user/profile', {}, {
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
    window.location.href = '/'
  };

  const ChangeAvatar = (img) => {
    /*Mở cửa sổ chọn avatar và thay đổi*/
  };

  const startEditing = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleInputChange = (e, field) => {

  };

  const saveChanges = (field) => {
    setIsEditing({ ...isEditing, [field]: false });
  };

  return (
    <div className="wrapper">
      <div className="sidebar">
        <div className="sidebar-container">
          <h4 className="sidebar-title">Quản Lý Tài Khoản</h4>
          <ul className="menu-list">
            <li className="menu-item">
              <a href="dashboard" className="link">Thông tin tài khoản</a>
            </li>
            <li className="menu-item menu-active">
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
          <div className="content-title">Thiết Lập An Toàn Tài Khoản</div>
          <div className="account-content-container">
            <div className="account-avatar-container">
              Chọn để thay đổi ảnh đại diện!
              <img src={`http://localhost:8000/user/image/${userInfo.img}` || 'https://i.pinimg.com/736x/2d/4c/fc/2d4cfc053778ae0de8e8cc853f3abec5.jpg'} alt="" className="account-avatar-profile-change" 
                onClick={ChangeAvatar(userInfo.img)}/>
            </div>
            <div className="account-info-container">
              {['fullname', 'username', 'email', 'mật khẩu'].map((field) => (
                <div key={field} className="account-info-item">
                  <span className="account-info-label">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                  <span className="account-info-value-container">
                    {isEditing[field] ? (
                      <>
                        <img src={save_icon} alt="Save" className="account-info-save" onClick={() => saveChanges(field)} />
                        <input 
                          type="text" 
                          onChange={(e) => handleInputChange(e, field)}
                          placeholder={"Nhập " + field + ' mới'}
                          className="account-info-input"
                        />
                      </>
                    ) : (
                      <>
                        <img src={change_icon} alt="Change" className="account-info-change" onClick={() => startEditing(field)} />
                        <div className="account-info-value">{userInfo[field]}</div>
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SafetySetting;
