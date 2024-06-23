import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './safetySetting.css';
import change_icon from '../assets/pen.png';
import save_icon from '../assets/save.png';
import user_icon from '../assets/user.png';
import UploadModal from '../../../components/Upload/Upload';

function SafetySetting() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
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

  const [SSModalVisible, setSSModalVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pendingField, setPendingField] = useState(null);
  const [newValues, setNewValues] = useState({});

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

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleUploadSuccess = async () => {
    setIsUploadModalOpen(false);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('http://localhost:8000/user/profile', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching updated user info:', error);
    }
  };

  const startEditing = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleInputChange = (e, field) => {
    setNewValues({ ...newValues, [field]: e.target.value });
  };

  const saveChanges = (field) => {
    setPendingField(field);
    setSSModalVisible(true);
  };

  const confirmAndSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put('http://localhost:8000/user/profile', {
        ...newValues,
        confirm_password: confirmPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserInfo({ ...userInfo, ...newValues });
      setSSModalVisible(false);
      setConfirmPassword('');
      setIsEditing({ ...isEditing, [pendingField]: false });
    } catch (error) {
      console.error('Error saving changes:', error);
    }
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
              <img src={`http://localhost:8000/user/image/${userInfo.img}` || {user_icon}} alt="" className="account-avatar-profile-change" 
                onClick={openUploadModal}/>
            </div>
            <div className="account-info-container">
              {['fullname', 'username', 'email', 'password'].map((field) => (
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
      {SSModalVisible && (
        <div className="SSmodal">
          <div className="SSmodal-content">
            <h4>Enter your password to process the change</h4>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <button onClick={confirmAndSave}>Confirm</button>
            <button onClick={() => setSSModalVisible(false)}>Cancel</button>
          </div>
        </div>
      )}
      {isUploadModalOpen && <UploadModal onClose={closeUploadModal} onSuccess={handleUploadSuccess} />}
    </div>
  );
}

export default SafetySetting;
