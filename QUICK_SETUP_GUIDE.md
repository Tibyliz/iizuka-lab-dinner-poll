# Quick Setup Guide - Iizuka Lab Poll

## 🚀 Get Your System Running in 15 Minutes!

---

## Step 1: Download Files (1 minute)

Download all project files and keep the folder structure:
```
/
├── index.html
├── admin-login.html
├── admin.html
├── css/
│   ├── style.css
│   └── admin.css
└── js/
    ├── firebase-config.js
    ├── firebase-api.js
    ├── poll.js
    ├── login.js
    └── admin.js
```

---

## Step 2: Firebase Setup (10 minutes)

### A. Create Firebase Project:
1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Enter project name: **"iizuka-lab-poll"**
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### B. Enable Realtime Database:
1. In Firebase Console, click **"Realtime Database"** (left menu)
2. Click **"Create Database"**
3. Choose location: **asia-southeast1** (Singapore - closest to Japan)
4. Start in **"Test mode"** (we'll update security later)
5. Click **"Enable"**

### C. Get Firebase Configuration:
1. Click the ⚙️ gear icon → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the **</>** icon (Web app)
4. App nickname: **"Iizuka Lab Poll Web"**
5. Click **"Register app"**
6. **COPY** the `firebaseConfig` object (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "iizuka-lab-poll.firebaseapp.com",
  databaseURL: "https://iizuka-lab-poll-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iizuka-lab-poll",
  storageBucket: "iizuka-lab-poll.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

7. Click **"Continue to console"**

### D. Set Security Rules:
1. Still in Realtime Database, click the **"Rules"** tab
2. Replace the rules with:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
3. Click **"Publish"**

---

## Step 3: Configure Website (2 minutes)

1. **Open** `js/firebase-config.js` in a text editor

2. **Replace** the entire firebaseConfig section with YOUR config from Step 2C:

```javascript
// BEFORE (template):
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  // ...
};

// AFTER (your actual config):
const firebaseConfig = {
  apiKey: "AIzaSyC...",  // Your actual values!
  authDomain: "iizuka-lab-poll.firebaseapp.com",
  // ...
};
```

3. **Save** the file

---

## Step 4: Deploy to GitHub Pages (2 minutes)

### A. Upload to GitHub:
1. Go to your GitHub repository
2. Upload all files **maintaining the folder structure**:
   - `index.html`, `admin-login.html`, `admin.html` in root
   - CSS files in `css/` folder
   - JS files in `js/` folder

### B. Enable GitHub Pages:
1. Go to repository → **Settings**
2. Click **"Pages"** (left menu)
3. Source: **Deploy from a branch**
4. Branch: **main** (or master)
5. Folder: **/ (root)**
6. Click **Save**

### C. Wait:
- GitHub Pages takes 1-2 minutes to deploy
- You'll get a URL like: `your-username.github.io`

---

## Step 5: Test Everything! (3 minutes)

### Test 1: Poll Form
1. Go to `your-site.com/index.html`
2. Fill in: Name, Attendance, Position
3. Select some dates (if available)
4. Click **"Submit Response"**
5. ✅ Should see success message!

### Test 2: Check Firebase
1. Go to Firebase Console → Realtime Database
2. You should see a new entry under `responses`!
3. ✅ Data is being saved!

### Test 3: Admin Login
1. Go to `your-site.com/admin-login.html`
2. Password: **iizukalab**
3. Click **"Login"**
4. ✅ Should redirect to dashboard!

### Test 4: Admin Dashboard
1. Should see your test submission in the table
2. Statistics should show: 1 total response
3. Charts should display
4. ✅ Dashboard is working!

### Test 5: Pricing
1. Scroll to "Pricing Configuration"
2. **Type** a percentage in an input field (e.g., "17.5")
3. ✅ Slider should move automatically!
4. **Drag** a slider
5. ✅ Input should update automatically!
6. Check total percentage shows ✅ when = 100%

---

## ✅ Success Checklist

After setup, verify:
- [ ] Poll form loads without errors
- [ ] Can submit a response
- [ ] Response appears in Firebase database
- [ ] Can login to admin page
- [ ] Dashboard shows statistics and charts
- [ ] Can type exact percentages in pricing inputs
- [ ] Sliders and inputs sync automatically
- [ ] All three pages link to each other correctly

---

## 🎉 You're Done!

Your poll system is live and ready to use!

### Next Steps:
1. **Configure your poll:**
   - Login to admin
   - Set poll title
   - Choose date range
   - Click "Generate Dates"
   - Save configuration

2. **Share with lab members:**
   - Send them the poll form URL: `your-site.com/index.html`

3. **Monitor responses:**
   - Use admin dashboard to see submissions
   - Check date popularity chart
   - Track payments

---

## 🆘 Quick Troubleshooting

**Problem:** "Failed to initialize poll"
- **Solution:** Check `firebase-config.js` has YOUR Firebase credentials

**Problem:** "Permission denied" in console
- **Solution:** Firebase Rules → Set `.read: true, .write: true` → Publish

**Problem:** Admin page not loading
- **Solution:** Clear browser cache (Ctrl+Shift+Delete), try again

**Problem:** Pricing inputs don't update
- **Solution:** Hard refresh (Ctrl+Shift+R), check console for errors

---

## 📖 Full Documentation

For complete details, see **README.md**

---

**Enjoy your new poll system!** 🚀
