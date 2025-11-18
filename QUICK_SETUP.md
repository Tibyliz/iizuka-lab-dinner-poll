# ⚡ Quick Setup Guide - 15 Minutes

**Get your poll system running in 15 minutes!**

---

## 📋 Before You Start

You need:
- ✅ Google account (for Firebase)
- ✅ GitHub account (for hosting)
- ✅ Text editor (VS Code, Sublime, or any)

---

## 🚀 Step-by-Step Setup

### **STEP 1: Firebase Project (5 minutes)**

#### 1.1 Create Project
1. Go to https://console.firebase.google.com/
2. Click **"Add project"** or **"Create a project"**
3. Name: `iizuka-lab-poll` (or your choice)
4. Click **Continue**
5. Disable Google Analytics (uncheck the box)
6. Click **Create project**
7. Wait 30 seconds... Done!

#### 1.2 Enable Realtime Database
1. In left menu, click **Build** → **Realtime Database**
2. Click **"Create Database"** button
3. Location: Choose closest to you (e.g., `asia-northeast1` for Japan)
4. Security rules: Select **"Start in test mode"**
5. Click **Enable**
6. Done! You'll see an empty database

#### 1.3 Get Your Config
1. Click the gear icon ⚙️ (top left) → **Project settings**
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** `</>` (or "Add app" button)
4. App nickname: `Iizuka Lab Poll`
5. Don't check Firebase Hosting
6. Click **Register app**
7. You'll see `firebaseConfig` object - **COPY THIS!**

```javascript
// Example (yours will be different):
const firebaseConfig = {
  apiKey: "AIzaSyB-abc123...",
  authDomain: "iizuka-lab-poll.firebaseapp.com",
  databaseURL: "https://iizuka-lab-poll-default-rtdb.firebaseio.com",
  projectId: "iizuka-lab-poll",
  storageBucket: "iizuka-lab-poll.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

8. Click **Continue to console**

---

### **STEP 2: Configure Website (5 minutes)**

#### 2.1 Download Project Files
Download all files from this project to your computer

#### 2.2 Edit Firebase Config
1. Open `js/firebase-config.js` in your text editor
2. Find this section:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY_HERE",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     // ... etc
   };
   ```
3. **Replace the entire object** with YOUR config from Step 1.3
4. **Save the file**

#### 2.3 Verify File Structure
Make sure you have these files:
```
iizuka-lab-poll/
├── index.html
├── admin-login.html
├── admin.html
├── css/
│   ├── style.css
│   └── admin.css
├── js/
│   ├── firebase-config.js  ⚠️ (You edited this!)
│   ├── firebase-api.js
│   ├── poll.js
│   ├── login.js
│   └── admin.js
└── database-rules.json
```

---

### **STEP 3: Deploy to GitHub Pages (5 minutes)**

#### 3.1 Create Repository
1. Go to https://github.com/
2. Click **"New repository"** (green button)
3. Name: `iizuka-lab-poll` (or your choice)
4. Make it **Public** (required for free GitHub Pages)
5. **Don't** initialize with README
6. Click **"Create repository"**

#### 3.2 Upload Files
**Option A: Web Interface (Easier)**
1. On your new repository page, click **"uploading an existing file"**
2. Drag ALL your project files into the upload area
3. ⚠️ **Important:** GitHub web interface doesn't support folders
   - Upload files individually or use Option B

**Option B: Git Command Line (Recommended)**
```bash
# Navigate to your project folder
cd path/to/iizuka-lab-poll

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/iizuka-lab-poll.git

# Push
git branch -M main
git push -u origin main
```

#### 3.3 Enable GitHub Pages
1. In your repository, go to **Settings** (top right)
2. In left sidebar, click **Pages**
3. Under "Source", select:
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **Save**
5. Wait 1-2 minutes
6. Your site URL will appear: `https://YOUR_USERNAME.github.io/iizuka-lab-poll/`

---

### **STEP 4: Test Everything (3 minutes)**

#### 4.1 Test Respondent Form
1. Go to `https://YOUR_USERNAME.github.io/iizuka-lab-poll/`
2. Should see the poll form
3. Fill in:
   - Name: Test User
   - Attendance: Yes
   - Position: PhD Student
4. Click **Submit**
5. Should see: ✅ "Thank you! Your response has been submitted successfully. 🎉"

#### 4.2 Verify in Firebase
1. Go back to Firebase Console
2. Navigate to **Realtime Database**
3. Look at the **Data** tab
4. You should see:
   ```
   iizuka-lab-poll
   └── responses
       └── -NxYz... (auto-generated ID)
           ├── timestamp: 1702...
           ├── name: "Test User"
           ├── attendance: "Yes, I'll attend"
           └── ... (other fields)
   ```

✅ **If you see your data, submission works!**

#### 4.3 Test Admin Login
1. Go to `https://YOUR_USERNAME.github.io/iizuka-lab-poll/admin-login.html`
2. Password: **iizukalab**
3. Click **Login**
4. Should redirect to dashboard

#### 4.4 Test Admin Dashboard
1. After login, dashboard should load in 2-3 seconds
2. You should see:
   - **Statistics:** 1 Total Response, 1 Attending
   - **Chart:** PhD Student shown
   - **Table:** Your test response
3. Try toggling the payment checkbox
4. Click on the amount - edit modal should open

✅ **If everything works, setup complete!**

---

## 🎯 Next Steps

### Configure Your Poll

1. **Set Poll Title**
   - Go to admin dashboard
   - Scroll to "Poll Configuration"
   - Change title
   - Click "Save Configuration"

2. **Set Available Dates**
   - In "Poll Configuration" section
   - Set Start Date and End Date
   - Click "Generate Dates"
   - Click "Save Configuration"

3. **Adjust Pricing** (Optional)
   - Scroll to "Pricing Configuration"
   - Adjust sliders for each position
   - Set base price
   - Click "Save Pricing"

### Share With Lab Members

1. Share the main URL: `https://YOUR_USERNAME.github.io/iizuka-lab-poll/`
2. They fill out the form
3. You see responses in real-time on admin dashboard!

---

## 🆘 If Something Doesn't Work

### Problem: Firebase config error

**Check:**
1. Did you replace the ENTIRE firebaseConfig object?
2. Did you save `firebase-config.js`?
3. Did you upload the saved version to GitHub?

**Fix:**
- Re-download `firebase-config.js` from your repository
- Verify it has YOUR Firebase config
- If not, re-edit and re-upload

### Problem: Page doesn't load

**Check:**
1. GitHub Pages enabled? (Settings → Pages)
2. Waited 2 minutes after enabling?
3. Correct URL? Should be `https://USERNAME.github.io/REPO-NAME/`

**Fix:**
- Go to Settings → Pages
- Check "Your site is published at..." message
- Use that exact URL

### Problem: Form submission fails

**Check:**
1. Open browser console (F12)
2. Look for red errors
3. Check Firebase Console → Realtime Database
4. Is database empty? Are rules correct?

**Fix:**
- Go to Firebase Console
- Realtime Database → Rules tab
- Use test mode rules:
  ```json
  {
    "rules": {
      ".read": true,
      ".write": true
    }
  }
  ```
- Click "Publish"

### Problem: Admin dashboard stuck loading

**Check:**
1. Did you login with correct password? (**iizukalab**)
2. Browser console (F12) - any errors?
3. Firebase Realtime Database enabled?

**Fix:**
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito window
- Verify Firebase config one more time

### Problem: Data appears in Firebase but not dashboard

**Fix:**
1. Click "Refresh" button on dashboard
2. Check if real-time listeners are active (console logs)
3. Logout and login again
4. Try different browser

---

## ✅ Setup Complete Checklist

- [ ] Firebase project created
- [ ] Realtime Database enabled
- [ ] Firebase config copied
- [ ] `firebase-config.js` edited with YOUR config
- [ ] All files uploaded to GitHub
- [ ] GitHub Pages enabled
- [ ] Test submission works (data in Firebase)
- [ ] Admin login works (password: iizukalab)
- [ ] Admin dashboard loads and shows data
- [ ] Configured poll title and dates
- [ ] Shared URL with lab members

If all checked: **🎉 You're done! Enjoy your poll system!**

---

## 🚀 Pro Tips

1. **Bookmark the admin URL** for quick access
2. **Test with multiple responses** before sharing
3. **Configure dates first** before sharing with lab
4. **Use "Save to Archive"** regularly for backups
5. **Export data** before starting new vote

---

## 📞 Need Help?

1. Check README.md for detailed documentation
2. Review troubleshooting section above
3. Check Firebase Console for data issues
4. Use browser console (F12) to see errors

---

**Estimated Total Time:** 15 minutes  
**Difficulty:** Easy  
**Required Skills:** Basic computer use, copy-paste  
**Cost:** $0 (completely free)

**Good luck! You've got this! 💪**
