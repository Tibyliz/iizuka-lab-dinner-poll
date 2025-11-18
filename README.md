# 🍽️ Iizuka Lab Dinner Poll - Login Fix Version

## 🎉 Critical Login Bug Fixed!

This version fixes the critical bug where users couldn't login to the admin dashboard. The login system now works perfectly!

---

## 🚨 What Was Fixed

### **Previous Issue:**
- ❌ Login page gets stuck after clicking "Login"
- ❌ Cannot access admin dashboard
- ❌ No error messages or feedback
- ❌ Session not working properly

### **Now Fixed:**
- ✅ **Login works smoothly** - Proper authentication flow
- ✅ **Clear error messages** - Know exactly what went wrong
- ✅ **Session management** - Stay logged in (24 hours)
- ✅ **Admin dashboard access** - Full functionality restored
- ✅ **Logout button** - Properly end session
- ✅ **Debug logging** - Easy troubleshooting

---

## 📦 Complete Feature Set

### **Respondent Page (index.html)**
- Name input
- Attendance selection (Yes/No)
- Position selection (Bachelor/Master's/PhD/Faculty)
- Multiple date selection (checkboxes)
- Beautiful responsive design
- Form validation
- Submission to Google Sheets

### **Admin Login (admin-login.html)** ⭐ **FIXED**
- Beautiful login interface
- Password authentication (default: `iizukalab`)
- Error/success messages
- Session management
- Auto-redirect on success
- Mobile responsive

### **Admin Dashboard (admin.html)** ⭐ **FIXED**
- **Statistics Cards:**
  - Total responses
  - Attending count
  - Not attending count
  - Total cost calculation

- **Charts:**
  - Position breakdown (pie chart)
  - Date popularity (bar chart)

- **Response Management:**
  - View all responses in table
  - Edit individual amounts
  - Payment tracking (checkboxes)
  - Smart cost redistribution

- **Configuration:**
  - Customize poll title
  - Set date range (start/end)
  - Auto-generate dates
  - Pricing sliders (4 positions)

- **Archive Management:**
  - Save current poll to archive
  - Start new vote (auto-archive + clear)
  - View saved archives
  - Restore from archive
  - Export archives

- **Export Options:**
  - XLSX (Excel)
  - PDF
  - CSV

### **Backend (Code.gs)**
- Google Apps Script integration
- RESTful API endpoints
- CORS support
- Data persistence in Google Sheets
- Archive management
- Config storage

---

## 🔐 Login Credentials

**Admin Access:**
- **URL:** `your-site.com/admin-login.html`
- **Password:** `iizukalab` (default)
- **Session:** 24 hours

**To change password:**
Edit `js/login.js` line 7:
```javascript
const DEFAULT_PASSWORD = 'your_new_password';
```

---

## 🚀 Deployment

### **Quick Update (If Already Deployed)**

See **[QUICK_UPDATE_GUIDE.md](QUICK_UPDATE_GUIDE.md)** for 5-minute update process.

**Summary:**
1. Download 4 updated files
2. Upload to GitHub Pages
3. Test login
4. Done! ✅

---

### **Fresh Deployment (New Setup)**

#### **Step 1: Google Sheets Setup**

1. **Create Google Sheet** with 3 sheets:

**Sheet: "Responses"**
```
Timestamp | Name | Attendance | Position | Selected Dates | Payment Status | Custom Amount | Is Edited
```

**Sheet: "Config"**
```
Setting | Value
Poll Title | Iizuka Lab Dinner Poll
Start Date | 
End Date | 
Available Dates | 
```

**Sheet: "Archives"**
```
Archive Name | Created Date | Data
(Created automatically)
```

#### **Step 2: Google Apps Script**

1. Open Google Sheet
2. Extensions → Apps Script
3. Paste `Code.gs` content
4. Deploy as Web App:
   - Execute as: Me
   - Who has access: Anyone
5. Copy Web App URL

#### **Step 3: Configure Frontend**

Edit `js/sheets-api.js` line 5:
```javascript
const SCRIPT_URL = 'your_web_app_url_here';
```

#### **Step 4: Deploy Website**

Upload all files to GitHub Pages (or any hosting):
- HTML files (3)
- CSS files (2)
- JS files (4)
- Documentation (optional)

#### **Step 5: Test**

1. Go to your website
2. Submit test response
3. Click "Admin" link
4. Login with password: `iizukalab`
5. Verify dashboard loads
6. Check all features work

---

## 📁 File Structure

```
iizuka-lab-poll/
├── index.html              (Respondent form)
├── admin-login.html        (Login page) ⭐ FIXED
├── admin.html              (Admin dashboard) ⭐ FIXED
├── css/
│   ├── style.css          (Form styles)
│   └── admin.css          (Dashboard styles) ⭐ UPDATED
├── js/
│   ├── poll.js            (Form logic)
│   ├── login.js           (Auth logic) ⭐ FIXED
│   ├── admin.js           (Dashboard logic)
│   └── sheets-api.js      (API wrapper)
├── Code.gs                 (Google Apps Script)
└── docs/
    ├── README.md          (This file)
    ├── LOGIN_FIX_GUIDE.md (Detailed login docs)
    └── QUICK_UPDATE_GUIDE.md (Update instructions)
```

---

## 🧪 Testing Checklist

### **Login System (CRITICAL)**
- [ ] Can access login page
- [ ] Password `iizukalab` logs in successfully
- [ ] Wrong password shows error
- [ ] Successful login redirects to admin
- [ ] Cannot access admin without login
- [ ] Logout button works
- [ ] Session persists (24 hours)

### **Form Submission**
- [ ] Can fill out form
- [ ] Dates display correctly
- [ ] Can submit form
- [ ] Data appears in Google Sheets
- [ ] Admin page shows submission

### **Admin Features**
- [ ] Statistics cards update
- [ ] Charts display correctly
- [ ] Response table shows data
- [ ] Can edit amounts
- [ ] Payment checkboxes work
- [ ] Export buttons work
- [ ] Date range generation works
- [ ] Save to archive works
- [ ] Start new vote works

---

## 🐛 Troubleshooting

### **"Login page stuck"** ✅ FIXED
**Solution:** Update to this version!

### **"Wrong password" message**
**Check:** Password is exactly `iizukalab` (lowercase, no spaces)

### **"Please login first" alert**
**Cause:** Trying to access admin.html without logging in  
**Solution:** Go to admin-login.html first

### **Session expired**
**Cause:** More than 24 hours since login  
**Solution:** Login again

### **Form submission fails**
**Check:**
1. Web App URL configured in `sheets-api.js`
2. Google Apps Script deployed with "Anyone" access
3. Browser console (F12) for error messages

### **Admin page empty**
**Check:**
1. Logged in successfully
2. Google Sheets has "Responses" sheet
3. At least one response submitted
4. Web App URL correct

---

## 📊 Google Sheets Structure (Detailed)

### **"Responses" Sheet**

| Column | Name | Type | Example |
|--------|------|------|---------|
| A | Timestamp | Date/Time | 2024-12-15 10:30:00 |
| B | Name | Text | John Doe |
| C | Attendance | Text | "Yes, I'll attend" |
| D | Position | Text | "PhD Student" |
| E | Selected Dates | Text | "2024-12-20,2024-12-21" |
| F | Payment Status | Boolean | true/false |
| G | Custom Amount | Number | 2000 (or empty) |
| H | Is Edited | Boolean | true/false |

### **"Config" Sheet**

| Setting | Value | Purpose |
|---------|-------|---------|
| Poll Title | (text) | Display on form |
| Start Date | YYYY-MM-DD | Date range start |
| End Date | YYYY-MM-DD | Date range end |
| Available Dates | CSV dates | Generated dates |

### **"Archives" Sheet**

Created automatically when saving archives.

---

## 💡 Usage Guide

### **For Lab Members (Respondents)**

1. Go to poll website
2. Fill in:
   - Your name
   - Will you attend? (Yes/No)
   - Your position (Bachelor/Master's/PhD/Faculty)
   - Available dates (select all that work)
3. Click "Submit Response"
4. Done! ✅

### **For Administrator**

1. **Access Admin:**
   - Click "Admin" link at bottom of poll
   - Or go to: `your-site.com/admin-login.html`

2. **Login:**
   - Enter password: `iizukalab`
   - Click "Login"

3. **View Dashboard:**
   - See statistics (total, attending, cost)
   - View charts (positions, date popularity)
   - Check response table

4. **Manage Pricing:**
   - Adjust percentage sliders
   - Bachelor: 15% (default)
   - Master's: 20% (default)
   - PhD: 30% (default)
   - Faculty: 50% (default)
   - Click "Save Pricing"

5. **Edit Individual Amounts:**
   - Click on any amount in table
   - Enter custom amount
   - System auto-redistributes
   - Click "Save Amount"

6. **Track Payments:**
   - Check boxes for paid members
   - Filter by payment status

7. **Configure Poll:**
   - Change poll title
   - Set date range
   - Click "Generate Dates"

8. **Export Data:**
   - Click XLSX/PDF/CSV buttons
   - Download formatted data

9. **Archive Management:**
   - "Save to Archive" - Backup current poll
   - "Start New Vote" - Archive + clear for new poll

10. **Logout:**
    - Click "Logout" button
    - Session cleared

---

## 🔧 Customization

### **Change Colors**

Edit CSS files:
- `css/style.css` - Form colors
- `css/admin.css` - Dashboard colors

Look for gradient definitions:
```css
background: linear-gradient(135deg, #667eea, #764ba2);
```

### **Change Poll Questions**

Edit `index.html`:
- Modify question text
- Add/remove fields
- Change options

### **Change Pricing Defaults**

Edit `admin.html`:
- Find pricing sliders
- Change `value="X"` attributes

### **Change Session Duration**

Edit `js/login.js` line 9:
```javascript
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
```

---

## 📚 Documentation

- **[LOGIN_FIX_GUIDE.md](LOGIN_FIX_GUIDE.md)** - Detailed login system documentation
- **[QUICK_UPDATE_GUIDE.md](QUICK_UPDATE_GUIDE.md)** - 5-minute update guide
- **[README.md](README.md)** - This file (overview)

---

## 🎯 Key Features

- ✅ **Working Login** - Fixed critical bug
- ✅ **Google Sheets Integration** - Centralized data
- ✅ **Beautiful UI** - Modern, professional design
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Date Popularity Chart** - See best dates
- ✅ **Flexible Pricing** - Per-position percentages
- ✅ **Editable Amounts** - Custom pricing per person
- ✅ **Archive Management** - Historical data
- ✅ **Export Options** - XLSX/PDF/CSV
- ✅ **Session Security** - 24-hour sessions
- ✅ **Debug Logging** - Easy troubleshooting

---

## 🆘 Support

**If you encounter issues:**

1. **Check documentation:**
   - LOGIN_FIX_GUIDE.md for login issues
   - QUICK_UPDATE_GUIDE.md for update help

2. **Check browser console:**
   - Press F12
   - Look for error messages
   - Read console logs

3. **Clear browser data:**
   - Ctrl+Shift+Delete
   - Clear all
   - Reload page

4. **Try different browser:**
   - Chrome
   - Firefox
   - Edge

---

## ✅ Success Criteria

**Your system is working when:**

- ✅ Can submit responses from form
- ✅ Data appears in Google Sheets
- ✅ Can login to admin dashboard
- ✅ Dashboard shows statistics
- ✅ Charts display correctly
- ✅ Can edit amounts
- ✅ Can track payments
- ✅ Can export data
- ✅ Can manage archives
- ✅ No console errors

---

## 🎉 Credits

**Project:** Iizuka Lab Dinner Poll System  
**Purpose:** Streamline lab dinner planning  
**Version:** 2.0 (Login Fix)  
**Status:** ✅ Production Ready  

**Key Improvement:** Fixed critical login bug that prevented admin access

---

## 📝 License

MIT License - Free to use and modify for your lab's needs.

---

## 🚀 Get Started

1. **Already deployed?** → See **QUICK_UPDATE_GUIDE.md**
2. **Fresh setup?** → Follow deployment steps above
3. **Need help?** → Check **LOGIN_FIX_GUIDE.md**

**Your lab dinner planning just got easier!** 🎊
