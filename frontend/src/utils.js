// main.js hoặc app.js
function checkAndRemoveExpiredToken() {
    const token = localStorage.getItem('accessToken');
    const expireTime = localStorage.getItem('tokenExpireTime');

    if (!token || !expireTime) {
        return false;
    }

    const currentTime = new Date().getTime();
    if (currentTime > expireTime) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenExpireTime');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        alert("Session expired. Please login again.");
        window.location.href = '/login'; 
        return false;
    }

    return true; 
}

document.addEventListener('DOMContentLoaded', (event) => {
    checkAndRemoveExpiredToken();
    setInterval(checkAndRemoveExpiredToken, 60000);
});
