
# TODO: Add Google OAuth Login

## Backend Changes
- [x] Initialize Passport in `server.js`
- [x] Add Google OAuth routes (`/google`, `/google/callback`) to `auth.js`
- [x] Add Google login controller in `authController.js`
- [x] Verify User model has `googleId` field

## Frontend Changes
- [x] Make Google button functional in `Login.jsx`
- [x] Add Google login method to `authService.js`
- [x] Add Google login function to `AuthContext.jsx`

## Followup Steps
- [ ] Set up Google OAuth credentials in `.env` (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
- [ ] Test the integration
