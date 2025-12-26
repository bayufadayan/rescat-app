import axios from 'axios';

// Configure axios instance with credentials for Laravel session auth
const axiosInstance = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Set XSRF token from cookie for CSRF protection
axiosInstance.interceptors.request.use((config) => {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
    
    if (token) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
    
    return config;
});

export default axiosInstance;
