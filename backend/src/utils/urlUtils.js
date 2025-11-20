const getFrontendUrl = (req) => {
    // Debug logging
    if (req) {
        console.log('[urlUtils] Debug:', {
            hostname: req.hostname,
            hostHeader: req.get('host'),
            envFrontend: process.env.FRONTEND_URL,
            envClient: process.env.CLIENT_URL
        });
    }

    // Smart fallback: If backend is accessed via localhost, redirect to localhost frontend
    // This MUST be first to override any misconfigured production URLs in .env
    if (req) {
        const host = req.hostname || '';
        const hostHeader = req.get('host') || '';

        // Check for various localhost indicators
        if (host === 'localhost' || host === '127.0.0.1' || host === '::1' ||
            hostHeader.includes('localhost') || hostHeader.includes('127.0.0.1')) {
            console.log('[urlUtils] Detected localhost backend, forcing redirect to http://localhost:3000');
            return 'http://localhost:3000';
        }
    }

    // Check environment variable first
    if (process.env.FRONTEND_URL) {
        return process.env.FRONTEND_URL;
    }

    // Check CLIENT_URL as fallback
    if (process.env.CLIENT_URL) {
        const urls = process.env.CLIENT_URL.split(',').map(url => url.trim());
        return urls[0]; // Use first URL
    }

    // Determine from request in development (if not caught by above check)
    if (process.env.NODE_ENV === 'development') {
        const protocol = req.protocol || 'http';
        const host = req.get('host') || 'localhost:3000';
        return `${protocol}://${host}`;
    }

    // Production fallback
    return 'https://infinitywebtechnology.com';
};

module.exports = getFrontendUrl;
