# Fix OAuth Redirect 404 Error

The "404 Not Found" error on `https://www.infinitywebtechnology.com` happens because the backend is redirecting you to the production domain instead of your local environment.

## The Cause
The backend determines where to redirect after login using the `CLIENT_URL` environment variable. If this is set to the production site, or if it's missing and defaults to production settings, you will be redirected to the live site.

## The Solution

1.  Open the file `backend/.env`.
2.  Find the line starting with `CLIENT_URL=`.
3.  Change it to match your local frontend URL (usually port 3000):

```env
CLIENT_URL=http://localhost:3000
```

4.  Also ensure `NODE_ENV` is set to development:

```env
NODE_ENV=development
```

5.  **Restart the backend server** for changes to take effect.

## Verification
After updating the `.env` file and restarting the server:
1.  Go to `http://localhost:3000/login`.
2.  Click "Sign in with Google".
3.  After authentication, you should be redirected back to `http://localhost:3000/...` instead of the production domain.
