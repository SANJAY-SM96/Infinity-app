# Fix: Error 400: redirect_uri_mismatch

## 🎯 Problem

You're getting: **"Error 400: redirect_uri_mismatch"**

This means the redirect URI configured in Google Cloud Console doesn't match what your application is sending to Google.

---

## ✅ Solution: Add All Redirect URIs

### Step 1: Open Google Cloud Console

1. Go to: **https://console.cloud.google.com/**
2. Make sure you're in the **correct project**
3. Navigate to: **APIs & Services** > **Credentials**

### Step 2: Edit Your OAuth Client

1. Find and click on your OAuth 2.0 Client ID:
   - **Client ID**: `467725122468-m4umj942jvpmf36q6ajtogvh2hq2d595.apps.googleusercontent.com`
2. This will open the edit page

### Step 3: Add All Redirect URIs

**Scroll down to "Authorized redirect URIs"** and add **ALL** of these (one by one):

#### Production URLs:
```
https://www.api.infinitywebtechnology.com/api/auth/google/callback
https://api.infinitywebtechnology.com/api/auth/google/callback
```

#### Render URLs (if you're using Render):
```
https://infinity-app-rn91.onrender.com/api/auth/google/callback
https://infinity-apps.onrender.com/api/auth/google/callback
```

#### Local Development:
```
http://localhost:5000/api/auth/google/callback
```

**Important Notes:**
- ✅ **No trailing slash** at the end
- ✅ **Exact match** required (case-sensitive for domain)
- ✅ **Include `https://` or `http://`** prefix
- ✅ **Full path** including `/api/auth/google/callback`

### Step 4: Verify Authorized JavaScript Origins

While you're there, also check **"Authorized JavaScript origins"** and add:

```
https://www.api.infinitywebtechnology.com
https://api.infinitywebtechnology.com
https://infinity-app-rn91.onrender.com
https://infinity-apps.onrender.com
http://localhost:5000
```

### Step 5: Save and Wait

1. Click **"SAVE"** at the bottom
2. **Wait 5-10 minutes** for Google to propagate the changes
3. Clear your browser cache or use Incognito mode
4. Test Google Sign-In again

---

## 🔍 How to Find Your Actual Backend URL

If you're not sure what your backend URL is:

### Method 1: Use the Debug Endpoint (Easiest!)

Visit this URL in your browser:
```
https://your-backend-url.com/api/auth/google/config
```

Or for local development:
```
http://localhost:5000/api/auth/google/config
```

This will show you:
- The exact callback URL your app is using
- Step-by-step instructions on how to fix it
- Whether Google OAuth is configured

### Method 2: Check Your Environment Variables

Look in your `.env` file or hosting platform:

**If you see:**
- `BACKEND_URL=https://www.api.infinitywebtechnology.com` → Use that
- `NODE_ENV=production` → Likely using `https://www.api.infinitywebtechnology.com`
- Hosting on Render → Check your Render service URL

### Method 3: Check Server Logs

When you start your backend server, you should see:
```
🔗 Google OAuth Callback URL: https://www.api.infinitywebtechnology.com/api/auth/google/callback
```

**This tells you exactly what redirect URI your app is using!**

---

## 🚨 Common Mistakes

### ❌ Wrong:
```
/api/auth/google/callback                    (missing protocol and domain)
https://www.api.infinitywebtechnology.com/   (trailing slash)
https://www.api.infinitywebtechnology.com   (missing path)
http://www.api.infinitywebtechnology.com/api/auth/google/callback  (http instead of https in production)
```

### ✅ Correct:
```
https://www.api.infinitywebtechnology.com/api/auth/google/callback
http://localhost:5000/api/auth/google/callback  (ok for local dev)
```

---

## 📋 Checklist

Before testing, make sure:

- [ ] Added redirect URI: `https://www.api.infinitywebtechnology.com/api/auth/google/callback`
- [ ] Added redirect URI: `http://localhost:5000/api/auth/google/callback` (for local dev)
- [ ] Added any other backend URLs you're using (Render, Heroku, etc.)
- [ ] No trailing slashes
- [ ] Exact path match (`/api/auth/google/callback`)
- [ ] Clicked "SAVE" in Google Cloud Console
- [ ] Waited 5-10 minutes after saving
- [ ] Cleared browser cache or using incognito mode
- [ ] Restarted backend server (if running locally)

---

## 🧪 Test

1. **Clear browser cache** or use **Incognito/Private mode**
2. Go to your login page
3. Click "Sign in with Google"
4. You should be redirected to Google's sign-in page
5. After signing in, you should be redirected back to your app

---

## 💡 Pro Tip

**Add ALL possible redirect URIs** to avoid this error:
- Production URL
- Staging URL (if you have one)
- Local development URL
- Any other environments you use

Google will only use the one that matches the request, so having multiple won't cause issues.

---

## 🆘 Still Not Working?

1. **Use the debug endpoint** - Visit `/api/auth/google/config` to see your configured callback URL
2. **Check server logs** - Look for the callback URL being logged (should show on server start)
3. **Check browser console** - Look for any JavaScript errors
4. **Check network tab** - See the exact redirect URI being sent to Google
5. **Verify you're in the correct Google Cloud project**
6. **Double-check the Client ID** matches in both `.env` and Google Cloud Console
7. **Check error messages** - The app now shows the callback URL in error messages to help debug
8. **Wait longer** - Google can take up to 10-15 minutes to propagate changes
9. **Clear browser cache** - Use Incognito/Private mode to test
10. **Check for typos** - The URL must match EXACTLY (including http vs https, trailing slashes, etc.)

---

**Last Updated**: After fixing redirect_uri_mismatch error

