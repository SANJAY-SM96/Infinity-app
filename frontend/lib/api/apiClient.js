import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
    // Check if we're running on localhost (development)
    const isLocalhost = typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === ''
    );

    const isDev = process.env.NODE_ENV === 'development';
    const isProd = process.env.NODE_ENV === 'production';

    // In development mode, use Next.js rewrites (relative URL)
    if (isDev && isLocalhost) {
        const apiUrl = '/api';
        console.log('[API Client] Using Next.js rewrites for API (relative URL):', apiUrl);
        return apiUrl;
    }

    // In production, use NEXT_PUBLIC_API_URL if set
    if (isProd) {
        const envUrl = process.env.NEXT_PUBLIC_API_URL;
        if (envUrl) {
            let url = envUrl.trim();
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = `https://${url}`;
            }
            if (!url.endsWith('/api')) {
                url = url.endsWith('/') ? `${url}api` : `${url}/api`;
            }
            return url;
        }
        const prodUrl = 'https://www.api.infinitywebtechnology.com/api';
        return prodUrl;
    }

    // Fallback
    return 'http://localhost:5000/api';
};

const apiBaseURL = getApiUrl();

const api = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    validateStatus: function (status) {
        return status >= 200 && status < 300;
    },
    transformRequest: [(data, headers) => {
        if (data && typeof data === 'object' && !(data instanceof FormData) && !(data instanceof URLSearchParams)) {
            const contentType = headers['Content-Type'] || headers['content-type'];
            if (!contentType || contentType.includes('application/json')) {
                return JSON.stringify(data);
            }
        }
        return data;
    }],
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        if ((config.method === 'post' || config.method === 'put' || config.method === 'patch') && config.data) {
            if (!config.headers['Content-Type'] || config.headers['Content-Type'] === 'application/json') {
                config.headers['Content-Type'] = 'application/json';
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.code === 'ERR_NETWORK' || error.message?.includes('NetworkError')) {
            // Handle network errors
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.replace('/login');
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
