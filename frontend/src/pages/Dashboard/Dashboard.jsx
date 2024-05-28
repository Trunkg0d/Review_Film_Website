import React, { useState } from 'react';
import './Dashboard.css';

// http://localhost:3000/user/dashboard

function Dashboard() {

    const test_user = {
        "example": {
            "email": "fastapi@packt.com",
            "password": "strong!!!",
            "img": "/static/img.png",
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
    }
    return (
        <div id="wrapper">
            <div class="profile-masthead self">
                <section class="profile-simple-masthead">
                <div class="container-large masthead-wrapper">
                    <div class="masthead-avatar">
                        <img class="profile-avatar" alt="Trần Ngọc Bảo" src="https://cdn.dribbble.com/users/21017574/avatars/normal/data?1716113406"/>
                    </div>
                </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;