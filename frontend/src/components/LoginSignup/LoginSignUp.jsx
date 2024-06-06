import React, { useState } from 'react';
import './LoginSignUp.css';
import axios from "axios";
import user_icon from './assets/user.png'
import email_icon from './assets/email.png'
import password_icon from './assets/password.png'
import { useNavigate } from 'react-router-dom'

const LoginSignup = () => {

    const [action, setAction] = useState("Login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const handleSignup = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        // You can now use 'email' and 'password' state variables here
        console.log("Email:", email);
        console.log("Password:", password);

        try {
            const response = await axios.post("http://127.0.0.1:8000/user/signup", {
                email: email,
                password: password,
                img: "string",
                role: 0
            });
            // Handle the response from the backend as needed
            console.log("Response from FastAPI backend:", response.data);
            navigate('/');
        } catch (error) {
            // Handle any errors that occur during the request
            console.error("Error:", error);

        }
    };


    // Add for me an output of front end, show "Email or password is incorrect, please try again" when the Login catch error, and If login ok redirect to home page link please
    const handleSignIn = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        // You can now use 'email' and 'password' state variables here
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

            // Handle the response from the backend as neede
            console.log("Response from API:", response.data);
            const accessToken = response.data.access_token;
            localStorage.setItem("accessToken", accessToken);
            navigate('/');
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("Email or Password is incorrect, please try again!")
        }
    };
    return (
        <div className='container-login'>
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
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={(e) => { handleSignup(e); setAction("Sign Up") }}>Sign Up</div>
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={(e) => { handleSignIn(e); setAction("Login") }}>Login</div>
            </div>
        </div>
    );
};

export default LoginSignup;