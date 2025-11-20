# Quick Fix for 404 Error on /login

## Immediate Steps to Fix

### Step 1: Check Current Status
Visit this URL to see what's wrong:
```
https://www.infinitywebtechnology.com/api/diagnostics/frontend
```

This will show you:
- Whether frontend directory exists
- Whether index.html exists
- Current NODE_ENV setting
- Whether frontend will be served

### Step 2: Build the Frontend (If Not Built)

**On your production server, run:**
```bash
cd /path/to/Infinity-app/frontend
npm install
npm run build
```

This creates the `frontend/dist` directory with all static files.

### Step 3: Restart Backend in Production Mode

**On your production server:**
```bash
cd /path/to/Infinity-app/backend
NODE_ENV=production npm start
```

**OR if using PM2 or similar:**
```bash
NODE_ENV=production pm2 restart your-app-name
```

### Step 4: Verify It's Working

1. Check backend logs - you should see:
   ```
   📦 Serving frontend from: /path/to/frontend/dist
   ```

2. Visit: `https://www.infinitywebtechnology.com/login`
   - Should show login page (not 404)

3. Visit: `https://www.infinitywebtechnology.com/login?token=YOUR_TOKEN`
   - Should process token and redirect

## Common Issues

### Issue 1: Frontend Not Built
**Symptom:** Diagnostic shows `frontendDirExists: false`

**Fix:**
```bash
cd frontend
npm install
npm run build
```

### Issue 2: Backend Not in Production Mode
**Symptom:** Diagnostic shows `nodeEnv: "development"` or `willServeFrontend: false`

**Fix:**
```bash
# Set environment variable
export NODE_ENV=production

# Or start with:
NODE_ENV=production npm start
```

### Issue 3: Wrong Path
**Symptom:** Diagnostic shows path doesn't exist

**Fix:**
```bash
# Set custom path
export FRONTEND_PATH=/absolute/path/to/frontend/dist

# Or explicitly enable
export SERVE_FRONTEND=true
```

### Issue 4: File Permissions
**Symptom:** Frontend exists but still 404

**Fix:**
```bash
# Check permissions
ls -la frontend/dist

# Fix if needed (adjust as needed)
chmod -R 755 frontend/dist
```

## One-Command Fix (If You Have Access)

```bash
# From project root
cd frontend && npm install && npm run build && cd ../backend && NODE_ENV=production npm start
```

## Still Not Working?

1. **Check the diagnostic endpoint:**
   - Visit: `https://www.infinitywebtechnology.com/api/diagnostics/frontend`
   - Share the output to identify the issue

2. **Check backend logs:**
   - Look for error messages
   - Look for "Serving frontend from" message

3. **Verify file structure:**
   ```bash
   ls -la frontend/dist/index.html
   # Should exist and be readable
   ```

4. **Check if server is actually running:**
   ```bash
   curl https://www.infinitywebtechnology.com/health
   # Should return JSON with status
   ```

