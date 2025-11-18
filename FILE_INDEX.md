# 📁 Complete File Index

**Navigation guide for the Iizuka Lab Poll system**

---

## 🎯 Quick Start Files

**Start here if you're new:**

1. **START_HERE.txt** ← Read this first!
2. **QUICK_SETUP.md** - 15-minute deployment guide
3. **README.md** - Complete documentation

---

## 📦 Application Files (11 files)

### **HTML Pages (3 files)**

#### `index.html` (4.8 KB)
**Purpose:** Respondent poll form  
**What it does:** Lab members fill this out to submit their responses  
**Features:**
- Name input
- Attendance selection (Yes/No)
- Position dropdown (Bachelor/Master/PhD/Faculty)
- Multiple date selection (checkboxes)
- Auto-loading poll title
- Submit button with confirmation
- Admin access link at bottom

**URL:** `your-site.com/index.html` (main page)

**Edit this if:** You want to change form layout or add fields

---

#### `admin-login.html` (1.8 KB)
**Purpose:** Admin authentication page  
**What it does:** Login page for administrators  
**Features:**
- Password input field
- Login button
- Session creation (24 hour)
- Back to poll link

**Default password:** `iizukalab`  
**URL:** `your-site.com/admin-login.html`

**Edit this if:** You want to change login page design

---

#### `admin.html` (12.8 KB)
**Purpose:** Admin dashboard  
**What it does:** Complete control panel for managing poll  
**Features:**
- Statistics cards (responses, attending, cost)
- Attendance breakdown chart
- Date popularity chart
- Complete responses table
- Pricing configuration
- Poll configuration
- Archive management
- Export buttons
- All admin controls

**URL:** `your-site.com/admin.html` (after login)

**Edit this if:** You want to customize dashboard layout

---

### **CSS Stylesheets (2 files)**

#### `css/style.css` (6.1 KB)
**Purpose:** Respondent form styles  
**What it does:** Makes the poll form look beautiful  
**Features:**
- Gradient background
- Card-based design
- Responsive layout
- Smooth animations
- Mobile-friendly
- Modern UI

**Colors:**
- Primary: `#667eea` (purple-blue)
- Secondary: `#764ba2` (purple)
- Success: `#2ecc71` (green)
- Error: `#e74c3c` (red)

**Edit this if:** You want to change colors or form design

---

#### `css/admin.css` (14.8 KB)
**Purpose:** Admin dashboard styles  
**What it does:** Makes the dashboard look professional  
**Features:**
- Clean, modern design
- Responsive grid layouts
- Chart containers
- Table styling
- Button designs
- Modal styling
- Mobile responsive

**Sections styled:**
- Header bar
- Statistics cards
- Charts
- Data tables
- Configuration panels
- Archive items
- Modals

**Edit this if:** You want to change dashboard appearance

---

### **JavaScript Files (5 files)**

#### `js/firebase-config.js` (932 bytes)
**Purpose:** Firebase configuration  
**What it does:** Connects your app to Firebase  
**⚠️ MUST EDIT:** Replace with YOUR Firebase config!

**How to edit:**
1. Get your Firebase config from Firebase Console
2. Replace the entire `firebaseConfig` object
3. Save file
4. Deploy

**This file contains:**
- Firebase project credentials
- Database URL
- API keys

**Critical:** This is the ONLY file you MUST edit to make the system work!

---

#### `js/firebase-api.js` (8.1 KB)
**Purpose:** Database API wrapper  
**What it does:** Clean interface for all database operations  
**You probably won't need to edit this**

**Key classes/methods:**
```javascript
class FirebaseAPI {
  // Config operations
  getConfig(key)
  setConfig(key, value)
  updateConfig(updates)
  
  // Response operations
  getAllResponses()
  addResponse(data)
  updateResponse(id, updates)
  deleteResponse(id)
  clearAllResponses()
  
  // Real-time listeners
  onResponsesChange(callback)
  onConfigChange(callback)
  
  // Archive operations
  getAllArchives()
  saveArchive(name, data)
  restoreArchive(id)
  deleteArchive(id)
  
  // Utility
  initializeDefaultConfig()
  testConnection()
}
```

**Edit this if:** You want to add new database operations

---

#### `js/poll.js` (7.5 KB)
**Purpose:** Respondent form logic  
**What it does:** Handles form submission and date loading  

**Key functions:**
- `loadPollTitle()` - Loads title from Firebase
- `loadAvailableDates()` - Loads and displays date checkboxes
- `setupFormSubmission()` - Handles form submit
- `formatDate()` - Formats dates nicely
- `showStatus()` - Shows success/error messages

**Real-time features:**
- Listens for poll title changes
- Auto-updates title if changed in admin

**Edit this if:** You want to change form behavior

---

#### `js/login.js` (3.0 KB)
**Purpose:** Authentication logic  
**What it does:** Handles admin login  

**Default password:** `iizukalab`  
**Session duration:** 24 hours

**Key features:**
- Password validation
- Session creation/management
- Auto-redirect if already logged in
- Session expiration checking

**To change password:**
```javascript
const ADMIN_PASSWORD = 'yournewpassword';
```

**Edit this if:** You want to change authentication logic

---

#### `js/admin.js` (28.0 KB) ⭐ **Largest file**
**Purpose:** Dashboard controller  
**What it does:** Everything on the admin dashboard  

**Key features:**
- Authentication checking
- Real-time data loading
- Statistics calculation
- Chart rendering (attendance + date popularity)
- Response table management
- Amount editing
- Payment tracking
- Pricing configuration
- Poll configuration
- Date range generation
- Archive management
- Export functions (Excel/PDF/CSV)

**Key functions:**
```javascript
// Dashboard
loadDashboard()
updateStatistics()
updateCharts()

// Table
renderResponsesTable()
togglePayment()
deleteResponse()

// Amount editing
openEditAmountModal()
calculateIndividualAmount()

// Charts
updateAttendanceChart()
updateDatePopularityChart()

// Archives
loadArchives()
saveArchive()
restoreArchive()
startNewVote()

// Export
exportToExcel()
exportToPDF()
exportToCSV()
```

**Edit this if:** You want to add features or change calculations

---

### **Configuration Files (1 file)**

#### `database-rules.json` (515 bytes)
**Purpose:** Firebase security rules  
**What it does:** Controls who can read/write to database  

**Current rules:** Test mode (read/write: true)

**For production, use:**
```json
{
  "rules": {
    ".read": "auth != null || true",
    ".write": "auth != null || true"
  }
}
```

**Edit this if:** You want stricter security

---

## 📚 Documentation Files (4 files)

### `README.md` (14.3 KB) ⭐ **Start here for complete info**
**Purpose:** Complete project documentation  
**What's inside:**
- Feature overview
- Detailed setup guide
- Configuration instructions
- Troubleshooting section
- API documentation
- Customization guide
- Deployment options
- FAQ

**Length:** ~70 printed pages  
**Read if:** You want to understand everything

---

### `QUICK_SETUP.md` (8.5 KB) ⭐ **Start here for fast deployment**
**Purpose:** 15-minute quick start guide  
**What's inside:**
- Step-by-step setup (1-2-3)
- Firebase project creation
- Configuration instructions
- GitHub Pages deployment
- Testing checklist
- Troubleshooting

**Time required:** 15 minutes  
**Read if:** You want to get started fast

---

### `FIREBASE_VS_SHEETS.md` (11.6 KB)
**Purpose:** Why Firebase is better than Google Sheets  
**What's inside:**
- Detailed comparison
- Performance benchmarks
- Reliability metrics
- User experience analysis
- Cost comparison
- Migration guide

**Read if:** You're wondering why we didn't use Google Sheets

---

### `PROJECT_COMPLETE.md` (14.2 KB)
**Purpose:** Final delivery summary  
**What's inside:**
- Complete feature list
- File inventory
- Quality metrics
- Testing coverage
- Success criteria
- What you're getting

**Read if:** You want to see what was delivered

---

### `FILE_INDEX.md` (this file!)
**Purpose:** Navigation guide  
**What's inside:** You're reading it! 😊

---

## 🗂️ Directory Structure

```
iizuka-lab-poll/
│
├── index.html                 ← Main poll form
├── admin-login.html          ← Admin login
├── admin.html                ← Admin dashboard
│
├── css/
│   ├── style.css             ← Form styles
│   └── admin.css             ← Dashboard styles
│
├── js/
│   ├── firebase-config.js    ← ⚠️ EDIT THIS with your Firebase config
│   ├── firebase-api.js       ← Database API wrapper
│   ├── poll.js               ← Form logic
│   ├── login.js              ← Authentication
│   └── admin.js              ← Dashboard logic
│
├── database-rules.json       ← Firebase security rules
│
├── README.md                 ← Complete documentation
├── QUICK_SETUP.md           ← 15-min quick start
├── FIREBASE_VS_SHEETS.md    ← Comparison analysis
├── PROJECT_COMPLETE.md      ← Delivery summary
└── FILE_INDEX.md            ← This file
```

**Total:** 15 files  
**Application size:** ~88 KB  
**Documentation:** ~50 KB, 100+ pages  

---

## 🎯 Which Files to Edit

### **Must Edit (1 file):**
✅ `js/firebase-config.js` - Replace with YOUR Firebase config

### **Might Want to Edit:**
- `js/login.js` - Change admin password
- `css/style.css` - Customize form colors
- `css/admin.css` - Customize dashboard colors

### **Probably Won't Edit:**
- `index.html` - Form structure is good
- `admin.html` - Dashboard layout is complete
- `js/firebase-api.js` - API wrapper is solid
- `js/poll.js` - Form logic works well
- `js/admin.js` - Dashboard logic is complete

### **Never Edit:**
- Documentation files (unless updating)
- `database-rules.json` (unless changing security)

---

## 📋 File Checklist

Before deploying, verify you have:

- [ ] `index.html`
- [ ] `admin-login.html`
- [ ] `admin.html`
- [ ] `css/style.css`
- [ ] `css/admin.css`
- [ ] `js/firebase-config.js` ⚠️ (edited with YOUR config!)
- [ ] `js/firebase-api.js`
- [ ] `js/poll.js`
- [ ] `js/login.js`
- [ ] `js/admin.js`
- [ ] `database-rules.json`

Documentation (optional but recommended):
- [ ] `README.md`
- [ ] `QUICK_SETUP.md`
- [ ] `FIREBASE_VS_SHEETS.md`
- [ ] `PROJECT_COMPLETE.md`
- [ ] `FILE_INDEX.md`

---

## 🔍 Finding What You Need

### "I want to change the form design"
→ Edit `css/style.css`

### "I want to change the dashboard design"
→ Edit `css/admin.css`

### "I want to change the admin password"
→ Edit `js/login.js` line 7

### "I want to add a new field to the form"
→ Edit `index.html`, `js/poll.js`, and `js/admin.js`

### "I want to change pricing calculation"
→ Edit `js/admin.js` (search for "calculateIndividualAmount")

### "I want to change available positions"
→ Edit `index.html` (dropdown options), `admin.html` (sliders), `js/admin.js` (calculations)

### "I need to connect to Firebase"
→ Edit `js/firebase-config.js` with YOUR Firebase credentials

### "I need setup instructions"
→ Read `QUICK_SETUP.md` (15 minutes) or `README.md` (complete)

### "Something isn't working"
→ Check `README.md` troubleshooting section

### "I want to understand the comparison"
→ Read `FIREBASE_VS_SHEETS.md`

### "I want to see what was delivered"
→ Read `PROJECT_COMPLETE.md`

---

## 💡 Tips

1. **Start with QUICK_SETUP.md** - Gets you running in 15 minutes
2. **Only edit firebase-config.js initially** - Everything else works as-is
3. **Read comments in code** - Explains what each section does
4. **Use browser console (F12)** - See what's happening
5. **Check Firebase Console** - Verify data is saving
6. **Test before sharing** - Submit test responses first

---

## 🎉 You're All Set!

Now you know where everything is and what it does!

**Next steps:**
1. Edit `js/firebase-config.js` with YOUR Firebase config
2. Deploy to GitHub Pages
3. Test everything
4. Share with lab members
5. Enjoy your poll system! 🎊

---

**Happy polling!** 🍽️🗳️
