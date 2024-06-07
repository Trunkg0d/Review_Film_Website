import React, { useState, useEffect } from 'react';
import './LoginSignUp.css';
import axios from "axios";
import user_icon from './assets/user.png'
import email_icon from './assets/email.png'
import password_icon from './assets/password.png'
import error_icon from './assets/error.png'; 
import success_icon from './assets/success.png'; 

const LoginSignup = () => {
    const [action, setAction] = useState("Login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isError, setIsError] = useState(false); 
    const [isSuccess, setIsSuccess] = useState(false); 
    const [loadingKey, setLoadingKey] = useState(0);
    const timedelay = 2000; 

    useEffect(() => {
        if (isModalVisible) {
            setTimeout(() => {
                setIsModalVisible(false);
            }, timedelay);
        }
    }, [isModalVisible]);

    const handleSignup = async (event) => {
        
        event.preventDefault(); // Prevent default form submission behavior
        console.log("Email:", email);
        console.log("Password:", password);

        try {
            const response = await axios.post("http://127.0.0.1:8000/user/signup", {
                email: email,
                password: password,
                img: "string",
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
        console.log("Email:", email);
        console.log("Password:", password);

        try {
            const formData = new URLSearchParams();
            formData.append("username", email);
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
            localStorage.setItem("accessToken", accessToken);
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
                {action === "Login" ? <div></div> : <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder='Your Name' />
                </div>}
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder='Your Email' onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Your Password' onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
            {action === "Sign Up" ? <div></div> : <div className="forgot-password">Forgot Password? <span>Click Here!</span></div>}
            {/* {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} */}

            <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} 
                    onClick={(e) => {
                        if (action === "Sign Up") {
                            handleSignup(e);
                        } else {
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
