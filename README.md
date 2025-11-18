# 🎉 Iizuka Lab Dinner Poll - Firebase Version

**A complete, production-ready voting system powered by Firebase Realtime Database**

---

## 🌟 Why Firebase Version?

### ✅ **Problems with Google Sheets (Old Version)**
- ❌ Constant CORS errors
- ❌ Complex API deployment
- ❌ "Anyone" vs "Anyone with Google account" confusion
- ❌ Unreliable connection
- ❌ Slow response times
- ❌ Frequent debugging needed

### ✅ **Firebase Version Benefits**
- ✅ **Zero CORS issues** - Works perfectly from day 1
- ✅ **Simple setup** - Just paste config, no API deployment
- ✅ **Real-time updates** - Dashboard updates automatically
- ✅ **Faster** - Much better performance
- ✅ **Reliable** - Industry-standard database
- ✅ **Easier to maintain** - Professional solution

---

## 📦 Features

### For Lab Members (Respondent Form)
- ✅ Clean, intuitive poll form
- ✅ Name, attendance, position selection
- ✅ Multiple date selection
- ✅ Mobile-friendly design
- ✅ Instant submission confirmation

### For Admin (Dashboard)
- ✅ **Real-time updates** - See new submissions instantly! 🔄
- ✅ **Statistics cards** - Total responses, attending, cost
- ✅ **Attendance breakdown chart** - Position distribution
- ✅ **Date popularity chart** ⭐ - See which dates work best
- ✅ **Complete responses table** - All submission details
- ✅ **Editable amounts** - Customize individual pricing
- ✅ **Payment tracking** - Toggle payment status
- ✅ **Pricing configuration** - 4 position-based sliders
- ✅ **Poll configuration** - Title and date range
- ✅ **Save to Archive** - Backup anytime
- ✅ **Start New Vote** - Auto-archive and clear
- ✅ **Archive management** - View, restore, delete
- ✅ **Export data** - Excel, PDF, CSV formats

---

## 🚀 Quick Setup (15 Minutes)

### **Step 1: Create Firebase Project (5 min)**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: "iizuka-lab-poll" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create Project"

### **Step 2: Get Firebase Config (3 min)**

1. In your Firebase project, click the gear icon ⚙️ → Project Settings
2. Scroll to "Your apps" section
3. Click the Web icon `</>` (or "Add app" if first time)
4. Register app name: "Iizuka Lab Poll"
5. Copy the `firebaseConfig` object

Example:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "iizuka-lab-poll.firebaseapp.com",
  databaseURL: "https://iizuka-lab-poll-default-rtdb.firebaseio.com",
  projectId: "iizuka-lab-poll",
  storageBucket: "iizuka-lab-poll.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### **Step 3: Enable Realtime Database (2 min)**

1. In Firebase Console, go to **Build** → **Realtime Database**
2. Click "Create Database"
3. Choose location closest to you (e.g., asia-northeast1)
4. Start in **Test Mode** for now
5. Click "Enable"

### **Step 4: Configure Database Rules (2 min)**

1. In Realtime Database, go to "Rules" tab
2. Copy content from `database-rules.json` file
3. Paste and publish

Or use these simple rules for testing:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### **Step 5: Configure Website (3 min)**

1. Download all project files
2. Open `js/firebase-config.js`
3. Replace the placeholder config with YOUR Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

4. Save the file

### **Step 6: Deploy to GitHub Pages**

1. Create GitHub repository (or use existing)
2. Upload ALL files maintaining structure:
   ```
   /index.html
   /admin-login.html
   /admin.html
   /css/style.css
   /css/admin.css
   /js/firebase-config.js
   /js/firebase-api.js
   /js/poll.js
   /js/login.js
   /js/admin.js
   /database-rules.json
   ```
3. Enable GitHub Pages in repository settings
4. Wait 1-2 minutes for deployment
5. Done! 🎉

---

## 🧪 Testing Your Setup

### Test 1: Respondent Form
1. Go to `your-site.com/index.html`
2. Fill in name, attendance, position
3. Select some dates (if configured)
4. Click Submit
5. Should see success message ✅
6. Check Firebase Console → Realtime Database → Data
7. You should see your response under `/responses/`

### Test 2: Admin Login
1. Go to `your-site.com/admin-login.html`
2. Enter password: **iizukalab**
3. Click Login
4. Should redirect to dashboard ✅

### Test 3: Admin Dashboard
1. After login, dashboard should load in 2-3 seconds
2. Should see:
   - Statistics cards with correct numbers
   - Attendance breakdown chart
   - Date popularity chart (if dates configured)
   - Your test response in table
3. Try toggling payment checkbox - should save
4. Click an amount - edit modal should open
5. Try all features!

---

## 📚 File Structure

```
iizuka-lab-poll/
├── index.html              # Respondent poll form
├── admin-login.html        # Admin authentication
├── admin.html              # Admin dashboard
│
├── css/
│   ├── style.css           # Respondent form styles
│   └── admin.css           # Admin dashboard styles
│
├── js/
│   ├── firebase-config.js  # Firebase configuration (EDIT THIS!)
│   ├── firebase-api.js     # Database API wrapper
│   ├── poll.js             # Respondent form logic
│   ├── login.js            # Authentication logic
│   └── admin.js            # Dashboard logic
│
├── database-rules.json     # Firebase security rules
└── README.md              # This file
```

---

## 🔐 Admin Access

- **Password:** `iizukalab`
- **Session Duration:** 24 hours
- **Login URL:** `your-site.com/admin-login.html`

To change password, edit `js/login.js` line 7:
```javascript
const ADMIN_PASSWORD = 'yournewpassword';
```

---

## 🎯 Key Features Guide

### 1. Date Popularity Chart ⭐

**What it does:**
Shows how many people selected each available date - helps you choose the optimal date for your event!

**How to use:**
1. Configure available dates in admin dashboard
2. Lab members submit their responses
3. Chart automatically updates showing:
   - Each date on X-axis
   - Number of people on Y-axis
   - Visual bars showing popularity

**Example:**
If 10 people select Dec 15, 5 select Dec 16, and 8 select Dec 17, the chart clearly shows Dec 15 is the most popular date!

### 2. Save to Archive 💾

**What it does:**
Creates a backup of current poll without clearing data

**When to use:**
- Weekly backups
- Before making major changes
- Milestone saves
- Keeping records

**How to use:**
1. Click "Save to Archive" button
2. Enter archive name
3. Done! Current data backed up
4. Poll remains active

### 3. Start New Vote 🔄

**What it does:**
Automatically saves current poll to archives and clears all responses for a fresh start

**When to use:**
- Monthly lab dinners
- New semester events
- Quarterly meetings
- Recurring events

**How to use:**
1. Click "Start New Vote" button
2. Confirm the action
3. System automatically:
   - Saves current poll to archives
   - Clears all responses
   - Keeps configuration
4. Ready for new poll!

### 4. Real-Time Updates 🔄

**What it does:**
Dashboard automatically updates when new submissions arrive - no refresh needed!

**How it works:**
- Firebase listeners detect changes
- Dashboard updates statistics instantly
- Charts redraw automatically
- Table shows new responses

**Benefits:**
- See submissions as they come in
- No manual refresh needed
- Monitor poll progress live
- Perfect for time-sensitive events

### 5. Editable Amounts ✏️

**What it does:**
Customize payment amount for individual people

**When to use:**
- Student with financial hardship
- Faculty member paying more
- Special circumstances
- Flexible pricing needed

**How to use:**
1. Click on any amount in the table
2. Edit modal opens
3. Enter new amount (or leave empty to reset)
4. Click Save
5. System automatically redistributes remaining cost

---

## 📊 Database Structure

### Firebase Realtime Database:

```
iizuka-lab-poll/
├── config/
│   ├── pollTitle: "Iizuka Lab Dinner Poll"
│   ├── basePrice: 10000
│   ├── bachelorPercent: 15
│   ├── masterPercent: 20
│   ├── phdPercent: 30
│   ├── facultyPercent: 35
│   ├── startDate: "2024-12-15"
│   ├── endDate: "2024-12-29"
│   └── availableDates: "2024-12-15,2024-12-16,..."
│
├── responses/
│   ├── -NxYz123ABC/
│   │   ├── timestamp: 1702896543210
│   │   ├── name: "John Doe"
│   │   ├── attendance: "Yes, I'll attend"
│   │   ├── position: "PhD Student"
│   │   ├── selectedDates: "2024-12-15, 2024-12-16"
│   │   ├── paymentStatus: false
│   │   ├── customAmount: null
│   │   └── isEdited: false
│   └── ...
│
└── archives/
    ├── -NxYz789DEF/
    │   ├── archiveName: "December Dinner - 2024-12-15"
    │   ├── createdDate: 1702896543210
    │   └── archiveData: "{...}"
    └── ...
```

---

## ⚙️ Configuration

### Pricing System

The system uses percentage-based pricing:
- **Base Price:** Total event cost (e.g., ¥10,000)
- **Position Percentages:** What each group pays
  - Bachelor Students: 15% (configurable)
  - Master's Students: 20% (configurable)
  - PhD Students: 30% (configurable)
  - Faculty/Staff: 35% (configurable)

**Example Calculation:**
- Base Price: ¥10,000
- 2 Master's (20% each) + 3 PhDs (30% each)
- Total %: (2×20) + (3×30) = 130%
- Master's cost: (10000 × 20) / 130 = ¥1,538 each
- PhD cost: (10000 × 30) / 130 = ¥2,308 each

### Date Range Configuration

**Two ways to set dates:**

1. **Date Range Generator (Recommended):**
   - Set start date and end date
   - Click "Generate Dates"
   - All dates in between are added
   - Example: Dec 15 to Dec 29 = 15 dates

2. **Manual Configuration:**
   - Edit availableDates in database
   - Format: "YYYY-MM-DD,YYYY-MM-DD,..."

---

## 🔧 Customization

### Change Colors

Edit `css/style.css` or `css/admin.css`:
```css
/* Main color scheme */
--primary-color: #667eea;
--secondary-color: #764ba2;
```

### Change Default Password

Edit `js/login.js`:
```javascript
const ADMIN_PASSWORD = 'yournewpassword';
```

### Change Session Duration

Edit `js/login.js` and `js/admin.js`:
```javascript
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
```

### Modify Position Categories

Edit in multiple files:
1. `index.html` - Add option to select dropdown
2. `admin.html` - Add pricing slider
3. `js/admin.js` - Add to percentage calculations

---

## 🆘 Troubleshooting

### Problem: Dashboard stuck loading

**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Verify Firebase config in `firebase-config.js`
4. Check database rules allow read/write
5. Test Firebase connection in console:
   ```javascript
   firebase.database().ref('.info/connected').once('value')
   ```

### Problem: No data appearing

**Solution:**
1. Check Firebase Console → Realtime Database → Data
2. Verify data exists
3. Check database rules
4. Clear browser cache (Ctrl+Shift+Del)
5. Try incognito window

### Problem: CORS errors

**Solution:**
This shouldn't happen with Firebase! If you see CORS errors:
1. You might be using Google Sheets version by mistake
2. Verify you're using `firebase-config.js` not sheets API
3. Check Firebase SDK is loaded (see browser console)

### Problem: Real-time updates not working

**Solution:**
1. Check internet connection
2. Verify Firebase Realtime Database is enabled
3. Check listeners are setup (see console logs)
4. Try refreshing page

---

## 🚀 Deployment Options

### Option 1: GitHub Pages (Recommended)
- Free
- Easy setup
- Automatic HTTPS
- Custom domain support

### Option 2: Netlify
- Free tier available
- Drag-and-drop deployment
- Automatic deploys from Git
- Custom domain support

### Option 3: Vercel
- Free for personal projects
- Git integration
- Instant deployment
- Analytics included

### Option 4: Firebase Hosting
- Perfect match with Firebase Database
- Free tier available
- CDN included
- Easy deployment

---

## 📈 Scaling

### Current Limits (Firebase Free Tier):
- **Storage:** 1 GB
- **Downloads:** 10 GB/month
- **Connections:** 100 simultaneous

For Iizuka Lab (estimated 50-100 users):
- ✅ Well within limits
- ✅ No cost for normal usage
- ✅ Can handle hundreds of responses

If you outgrow free tier:
- Upgrade to Spark Plan (pay-as-you-go)
- Still very affordable for small lab

---

## 🎓 For Developers

### Technology Stack
- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Database:** Firebase Realtime Database
- **Charts:** Chart.js 4.4.0
- **Export:** SheetJS (XLSX), jsPDF
- **Icons:** Font Awesome 6.4.0

### Code Architecture
- **firebase-config.js:** Configuration
- **firebase-api.js:** Database abstraction layer
- **poll.js:** Respondent form controller
- **admin.js:** Dashboard controller with real-time listeners

### API Methods

```javascript
// Config
await api.getConfig(key)
await api.setConfig(key, value)
await api.updateConfig(updates)

// Responses
await api.getAllResponses()
await api.addResponse(data)
await api.updateResponse(id, updates)
await api.deleteResponse(id)
await api.clearAllResponses()

// Real-time listeners
api.onResponsesChange(callback)
api.onConfigChange(callback)
api.offResponsesChange()
api.offConfigChange()

// Archives
await api.getAllArchives()
await api.saveArchive(name, data)
await api.restoreArchive(id)
await api.deleteArchive(id)

// Utility
await api.initializeDefaultConfig()
await api.testConnection()
```

---

## 📝 License

This project is created for Iizuka Lab at The University of Tokyo.
Feel free to modify and use for your needs.

---

## 🙏 Credits

- **Firebase:** Google's real-time database platform
- **Chart.js:** Beautiful charts library
- **Font Awesome:** Icon library
- **SheetJS:** Excel export functionality
- **jsPDF:** PDF generation library

---

## 📞 Support

For issues or questions:
1. Check this README first
2. Review troubleshooting section
3. Check browser console for errors
4. Review Firebase Console for data issues

---

## 🎉 Enjoy Your Poll System!

This Firebase-powered system is:
- ✅ Production-ready
- ✅ Zero CORS issues
- ✅ Real-time updates
- ✅ Easy to maintain
- ✅ Professional quality

**No more Google Sheets headaches!** 🎊

---

**Last Updated:** 2024-12
**Version:** 1.0.0 (Firebase Edition)
