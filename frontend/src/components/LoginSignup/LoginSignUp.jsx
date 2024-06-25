import React, { useState, useEffect } from 'react';
import './LoginSignUp.css';
import axios from "axios";
import user_icon from './assets/user.png';
import email_icon from './assets/email.png';
import password_icon from './assets/password.png';
import error_icon from './assets/error.png'; 
import success_icon from './assets/success.png'; 

const LoginSignup = () => {
    const [action, setAction] = useState("Login");
    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isError, setIsError] = useState(false); 
    const [isSuccess, setIsSuccess] = useState(false); 
    const [loadingKey, setLoadingKey] = useState(0);
    const [formError, setformError] = useState(""); // State for password mismatch error
    const timedelay = 2000; 

    useEffect(() => {
        if (isModalVisible) {
            setTimeout(() => {
                setIsModalVisible(false);
            }, timedelay);
        }
    }, [isModalVisible]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (action === 'Sign Up') {
                handleSignup(event);
            } else {
                handleSignIn(event);
            }
        } 
    }

    const handleSignup = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        
        // Check if passwords match
        if (password !== rePassword) {
            setformError("Passwords do NOT match. Please try again!");
            return;
        }

        if (!fullname || !username || !email || !password || !rePassword) {
            setformError("You must fill in all fields.");
            return;
        }

        
        
        try {
            const usernameCheck = await axios.post("http://127.0.0.1:8000/user/checkUsername", {
                "username": username
            });

            if (usernameCheck.data.message === "Existed") {
                setformError("Username already exists.");
                return;
            }

            const emailCheck = await axios.post("http://127.0.0.1:8000/user/checkEmail", {
                "email": email
            });

            if (emailCheck.data.message === "Existed") {
                setformError("Email already exists.");
                return;
            }


            const response = await axios.post("http://127.0.0.1:8000/user/signup", {
                fullname: fullname,
                username: username,
                email: email,
                password: password,
                img: null,
                role: 0
            });
            console.log("Response from FastAPI backend:", response.data);
            setModalMessage("Sign Up Successful");
            setIsError(false);
            setIsSuccess(true);
            setLoadingKey(prevKey => prevKey + 1);
            setIsModalVisible(true);
            setTimeout(() => {
                window.location.href = '/login';
            }, timedelay);
        } catch (error) {
            console.error("Error:", error);
            setModalMessage("Sign Up Failed. Please try again!");
            setIsError(true);
            setIsSuccess(false);
            setLoadingKey(prevKey => prevKey + 1);
            setIsModalVisible(true);
            setTimeout(() => {
                setIsModalVisible(false);
            }, timedelay);
        }
    };

    const handleSignIn = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        console.log("Username:", username);
        console.log("Password:", password);

        try {
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);

            const response = await axios.post(
                "http://127.0.0.1:8000/user/signin",
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            console.log("Response from API:", response.data);
            const accessToken = response.data.access_token;
            const expireTime = new Date().getTime() + 3600 * 1000;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("tokenExpireTime", expireTime);
            const fetchRole = async () => {
                try {
                    const token = localStorage.getItem('accessToken');
                    const response_role = await axios.post('http://localhost:8000/user/profile', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                    });
                    // setUserInfo(response.data);
                    localStorage.setItem("role", response_role.data.role)
                    localStorage.setItem("username", response_role.data.username)
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    // Handle error, e.g., redirect to login if unauthorized
                    if (error.response_role && error.response_role.status === 401) {
                    window.location.href = '/';
                    }
                }
            }
            fetchRole();
            setModalMessage("Login Successful! Your home page will be loading shortly.");
            setIsError(false);
            setIsSuccess(true);
            setLoadingKey(prevKey => prevKey + 1);
            setIsModalVisible(true);
            setTimeout(() => {
                window.location.href = '/'
            }, timedelay);
        } catch (error) {
            console.error("Error:", error);
            setModalMessage("Email or Password is incorrect, please try again!");
            setIsError(true);
            setIsSuccess(false);
            setLoadingKey(prevKey => prevKey + 1);
            setIsModalVisible(true);
            setTimeout(() => {
                setIsModalVisible(false);
            }, timedelay);
        }
    };

    const handleRePasswordChange = (e) => {
        setRePassword(e.target.value);
        setformError(""); // Clear error message and styling when re-enter password changes
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setformError(""); // Clear error message and styling when re-enter password changes
    };

    const handleFullnameChange = (e) => {
        setFullname(e.target.value);
        setformError(""); // Clear error message and styling when re-enter password changes
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setformError(""); // Clear error message and styling when re-enter password changes
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setformError(""); // Clear error message and styling when re-enter password changes
    };
    return (
        <div className='container-login'>
            <div className={`modal-overlay ${isModalVisible ? 'show' : ''}`}>
                <div className='modal'>
                    {isError && <img src={error_icon} alt="Error" className='error-icon' />} 
                    {isSuccess && <img src={success_icon} alt="Success" className='success-icon' />} 
                    <div className='modal-message'>{modalMessage}</div>
                    <div className='loading-bar' key={loadingKey}></div>
                </div>
            </div>
            <div className='header-login'>
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action === "Login" ? null : (
                    <>
                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input 
                                type="text" 
                                placeholder='Your Name' 
                                onChange={handleFullnameChange} 
                                onKeyDown={handleKeyPress} />
                        </div>
                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input 
                                type="text" 
                                placeholder='Your Username' 
                                onChange={handleUsernameChange} 
                                onKeyDown={handleKeyPress} />
                        </div>
                        <div className="input">
                            <img src={email_icon} alt="" />
                            <input 
                                type="text" 
                                placeholder='Your Email' 
                                onChange={handleEmailChange} 
                                onKeyDown={handleKeyPress} />
                        </div>
                    </>
                )}
                {action === "Sign Up" ? null : (
                    <>
                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input 
                                type="text" 
                                placeholder='Your username or email' 
                                onChange={handleUsernameChange} 
                                onKeyDown={handleKeyPress} />
                        </div>
                    </>
                )}
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input 
                        type="password" 
                        placeholder='Your Password' 
                        onChange={handlePasswordChange} 
                        onKeyDown={handleKeyPress} />
                </div>
                {action === "Login" ? null : (
                    <div className="input">
                        <img src={password_icon} alt="" />
                        <input 
                            type="password" 
                            placeholder='Re-enter Your Password' 
                            onChange={handleRePasswordChange} 
                            onKeyDown={handleKeyPress} 
                            className={formError ? 'input-error' : ''} // Apply red border if error
                        />
                    </div>
                )}
            </div>
            {formError && <p className="error-message">{formError}</p>} {/* Display password mismatch error */}
            {action === "Login" ? <div className="forgot-password">Forgot Password? <span>Click Here!</span></div> : null}

            <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} 
                    onClick={(e) => {
                        if (action === "Sign Up") {
                            handleSignup(e);
                        } else {
                            handleRePasswordChange(e);
                            setAction("Sign Up");
                        }
                    }}>
                    Sign Up
                </div>
                <div className={action === "Sign Up" ? "submit gray" : "submit"} 
                    onClick={(e) => {
                        if (action === "Login") {
                            handleSignIn(e);
                        } else {
                            handleRePasswordChange(e);
                            setAction("Login");
                        }
                    }}>
                    Login
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;