# Firebase Deployment Commands

## Quick Deploy Commands

### Option 1: Automated Deployment (Recommended)

**Windows PowerShell:**
```powershell
.\deploy-firebase-full.ps1
```

**Linux/Mac:**
```bash
chmod +x deploy-firebase-full.sh
./deploy-firebase-full.sh
```

### Option 2: Manual Step-by-Step Commands

#### Step 1: Login to Firebase (First Time Only)
```bash
firebase login
```

#### Step 2: Initialize Firebase (First Time Only)
```bash
firebase init
```
Select: **Hosting** and **Functions**

#### Step 3: Copy Backend Files to Functions (First Time Only)

**Windows:**
```powershell
robocopy backend\src functions\src /E
```

**Linux/Mac:**
```bash
cp -r backend/src functions/src
```

#### Step 4: Install Functions Dependencies
```bash
cd functions
npm install
cd ..
```

#### Step 5: Build Frontend
```bash
cd frontend
npm install
npm run build
cd ..
```

#### Step 6: Deploy Everything
```bash
firebase deploy
```

#### Deploy Only Frontend (Hosting)
```bash
firebase deploy --only hosting
```

#### Deploy Only Backend (Functions)
```bash
firebase deploy --only functions
```

## One-Line Commands

### Complete Deployment (All-in-One)
```bash
# Windows PowerShell
cd frontend && npm run build && cd .. && cd functions && npm install && cd .. && firebase deploy

# Linux/Mac
cd frontend && npm run build && cd .. && cd functions && npm install && cd .. && firebase deploy
```

## Prerequisites Commands

### Install Firebase CLI (If Not Installed)
```bash
npm install -g firebase-tools
```

### Check Firebase CLI Version
```bash
firebase --version
```

### Check Login Status
```bash
firebase projects:list
```

### View Current Project
```bash
firebase use
```

## Environment Variables Setup (Before First Deploy)

```bash
firebase functions:config:set mongodb.uri="your-mongodb-connection-string"
firebase functions:config:set jwt.secret="your-jwt-secret"
firebase functions:config:set stripe.secret_key="your-stripe-secret"
firebase functions:config:set razorpay.key_id="your-razorpay-key-id"
firebase functions:config:set razorpay.key_secret="your-razorpay-key-secret"
firebase functions:config:set client.url="https://your-project-id.web.app"
```

## Useful Commands After Deployment

### View Function Logs
```bash
firebase functions:log
```

### View Deployment History
```bash
firebase hosting:channel:list
```

### Open Firebase Console
```bash
firebase open
```

### Check Config Values
```bash
firebase functions:config:get
```

