import React from "react";
import './Footer.css';

function Footer() {
    const members = [
        '21120157 - Lê Phạm Hoàng Trung',
        '21120205 - Nguyễn Tạ Bảo',
        '21120415 - Trần Ngọc Bảo',
        '21120527 - Nguyễn Thế Phong',
        '21120554 - Lê Văn Tấn',
    ];
    return (
        <footer id="footer" className="footer">
            <div className="footer-top">
                <div className="container">
                    <div className="row gy-4">
                        <div className="col-lg-5 col-md-12 footer-info">
                            <a href="/" className="logo d-flex align-items-center">
                                <span>Morevie</span>
                            </a>
                            <p>Review App is a web application that provides a platform for users to share their reviews on various products and services.</p>
                            <div className="social-links mt-3">
                                {/* Add your social media links here */}
                                <a href="/" className="facebook"><ion-icon name="logo-facebook"></ion-icon></a>
                                <a href="/" className="instagram"><ion-icon name="logo-instagram"></ion-icon></a>
                                <a href="/" className="linkedin"><ion-icon name="logo-linkedin"></ion-icon></a>
                                <a href="/" className="github"><ion-icon name="logo-github"></ion-icon></a>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-12 footer-links">
                            <h4>Members</h4>
                            <ul>
                                {members.map((member, index) => (
                                    <li key={index}>
                                        <ion-icon name="person-circle-outline"></ion-icon>{' '}
                                        {/* Add your member's role here */}
                                        <a href="/">{member}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-12 footer-contact text-center text-md-start">
                            <h4>Contact Us</h4>
                                <p>
                                    Thành phố Hồ Chí Minh, Việt Nam<br />
                                    <strong>Phone:</strong>+12 34567890 <br />
                                    <strong>Email:</strong> info@example.com <br />
                                </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;