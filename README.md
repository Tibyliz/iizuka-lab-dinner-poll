# Iizuka Lab Group Dinner Poll System 🍜

A comprehensive web-based poll system designed specifically for research groups to organize dinner gatherings with advanced features including percentage-based pricing, payment tracking, and poll archiving.

## 🌟 Key Features

### Poll Collection
- ✅ **Name Collection** - Gather respondent names
- ✅ **Attendance Tracking** - Yes/No attendance selection
- ✅ **Title/Position Selection** - Master Student, Doctoral Student, Teachers and Staff
- ✅ **Date Availability (Optional)** - Select from 14 upcoming dates (fully optional, no dates required)
- ✅ **Dynamic Title** - Customizable poll title with smart defaults

### Admin Dashboard
- ✅ **Real-time Statistics** - Total responses, attending, not attending, paid
- ✅ **Visual Data Chart** - Interactive bar chart showing most popular dates
- ✅ **Comprehensive Table** - View all responses with filtering and search
- ✅ **Payment Tracking** - Checkbox system to track who has paid
- ✅ **Multiple Filters** - Filter by attendance, payment status, or search by name

### Percentage-Based Pricing System
- ✅ **Flexible Cost Allocation** - Set percentages for each group (e.g., 20%, 30%, 50%)
- ✅ **Automatic Calculation** - System calculates per-person cost based on attendance
- ✅ **Real-time Preview** - See price breakdown before saving
- ✅ **100% Validation** - Ensures percentages total exactly 100%

### Poll Management & Archiving
- ✅ **Save to Archive** - Save current poll with all data intact
- ✅ **Start New Poll** - Begin fresh poll while preserving archives
- ✅ **View Archives** - Browse all archived polls with statistics
- ✅ **Restore Archives** - Recover any archived poll
- ✅ **Export Archives** - Export archived data to XLSX
- ✅ **Delete Archives** - Remove old archives permanently

### Data Export
- ✅ **CSV Export** - Simple comma-separated format
- ✅ **XLSX Export** - Excel format with multiple sheets (responses + statistics)
- ✅ **PDF Export** - Professional report format
- ✅ **All Include Prices** - Exports contain calculated prices and payment status

### Security & Settings
- ✅ **Password Protection** - Secure admin access
- ✅ **Changeable Password** - Update password anytime
- ✅ **24-hour Sessions** - Automatic logout after 24 hours
- ✅ **Data Persistence** - All data stored in browser localStorage

## 🎨 Design Features

- **Modern UI** - Beautiful gradient design with smooth animations
- **Responsive Layout** - Works perfectly on mobile, tablet, and desktop
- **Intuitive Navigation** - Easy-to-use interface for all users
- **Professional Charts** - Chart.js powered visualizations
- **Custom Icons** - Font Awesome icons throughout

## 📁 Project Structure

```
dinner-poll-system/
├── index.html              # Main poll form
├── admin-login.html        # Admin authentication page
├── admin.html              # Admin dashboard
├── css/
│   ├── style.css          # Poll form styles
│   └── admin.css          # Admin dashboard styles
└── js/
    ├── poll.js            # Poll form logic
    ├── login.js           # Authentication logic
    └── admin.js           # Admin dashboard functionality
```

## 🚀 Quick Start

### 1. Deployment
1. Upload all files to your web server or GitHub Pages
2. Maintain the folder structure (css/, js/)
3. Ensure all files are in the root directory

### 2. First Time Setup
1. Visit `admin-login.html`
2. Default password: **`iizukalab`**
3. **Immediately change the password** in Settings

### 3. Configure Poll
1. Go to "Poll Title Settings" to customize the title
2. Go to "Price Settings" to set up cost allocation
3. Share the `index.html` link with your group

### 4. Manage Responses
1. View responses in the admin dashboard
2. Track payments with checkboxes
3. Export data when needed
4. Archive poll when done

## 💡 Usage Guide

### For Participants

1. **Open Poll Page** - Visit the shared index.html link
2. **Fill Information**:
   - Enter your name
   - Select Yes/No for attendance
   - Choose your title (Master/Doctoral/Staff)
   - (Optional) Select available dates if attending
3. **Submit** - Click the submit button
4. **Done!** - See confirmation message

**Note**: Date selection is completely optional. If you're attending but have no date preferences, simply don't select any dates.

### For Administrators

#### Managing Current Poll

1. **Login** - Use admin-login.html with your password
2. **View Dashboard** - See real-time statistics and chart
3. **Track Payments** - Check boxes for paid attendees
4. **Filter/Search** - Find specific responses
5. **Export Data** - Download reports in various formats

#### Price Configuration

1. Click **"Price Settings"**
2. Enter **Total Cost** (e.g., 10000)
3. Set **Percentages**:
   - Master Students: e.g., 20%
   - Doctoral Students: e.g., 30%
   - Teachers and Staff: e.g., 50%
4. **Preview** prices automatically
5. **Save** when total = 100%

**Example**:
- Total: ¥10,000
- Master (20%): 4 people = ¥500/person
- Doctoral (30%): 3 people = ¥1,000/person
- Staff (50%): 2 people = ¥2,500/person

#### Poll Archiving

**Save Current Poll**:
1. Click "Poll Management"
2. Click "Save Current Poll to Archive"
3. Enter archive name (e.g., "November 2024 Dinner")
4. Current poll data is preserved

**Start New Poll**:
1. Click "Poll Management"
2. Click "Start New Poll"
3. Confirm (current responses will be cleared)
4. Enter new poll name
5. Begin collecting responses

**Manage Archives**:
- **View**: See all archived polls with statistics
- **Restore**: Bring back an archived poll as current
- **Export**: Download archived poll data
- **Delete**: Permanently remove an archive

## 🔐 Security Notes

### Default Settings
- **Default Password**: `iizukalab`
- **Session Duration**: 24 hours
- **Data Storage**: Browser localStorage

### Best Practices
1. **Change Password Immediately** after first login
2. **Use Strong Password** - Mix of letters, numbers, symbols
3. **Don't Share Admin Link** - Only share poll link (index.html)
4. **Regular Backups** - Export data regularly
5. **Fixed Device** - Use same computer for admin tasks

### Data Privacy
- All data stored locally in browser
- No server-side storage
- Data persists until manually cleared
- Regular exports recommended for backup

## 📊 Data Management

### Storage
- **Responses**: Stored in `poll_responses`
- **Settings**: Stored in `admin_settings`
- **Archives**: Stored in `poll_archives`
- **Session**: Stored in `admin_session`

### Backup Strategy
1. **Regular Exports** - Weekly XLSX exports
2. **Archive Old Polls** - Save completed polls
3. **Keep Archives** - Don't delete until certain
4. **Multiple Formats** - Export CSV, XLSX, and PDF

## 🎯 Use Cases

### Monthly Lab Dinners
1. Create poll with month/year title
2. Collect attendance and dates
3. Find most popular date from chart
4. Set pricing based on attendee types
5. Track payments
6. Archive for records

### Special Events
- Year-end celebrations
- Welcome/farewell parties
- Professor retirement dinners
- Lab anniversaries

### Semester Activities
- Start of semester gatherings
- Mid-term celebrations
- End of semester parties

## 🛠️ Technical Details

### Technologies Used
- **HTML5** - Semantic structure
- **CSS3** - Modern styling with gradients and animations
- **JavaScript (ES6)** - Core functionality
- **Chart.js** - Data visualization
- **SheetJS (XLSX)** - Excel export
- **jsPDF** - PDF generation
- **Font Awesome** - Icons
- **localStorage API** - Data persistence

### Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

### Requirements
- Modern web browser
- JavaScript enabled
- localStorage support
- ~5MB storage space

## ⚙️ Customization

### Change Poll Duration
Edit `generateDates()` in `poll.js`:
```javascript
for (let i = 0; i < 14; i++) {  // Change 14 to desired days
```

### Modify Title Options
Edit HTML in `index.html` under "Title/Position" section.

### Adjust Color Scheme
Modify gradient colors in CSS files:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 🐛 Troubleshooting

### Login Issues
- **Solution**: Clear browser cache, use correct password
- **Reset**: Inspect → Console → `localStorage.setItem('admin_password', 'iizukalab')`

### Chart Not Displaying
- **Solution**: Ensure Chart.js CDN is loading
- **Check**: Browser console for errors

### Data Not Saving
- **Solution**: Check localStorage is enabled
- **Fix**: Settings → Privacy → Allow site data

### Export Not Working
- **Solution**: Check XLSX/jsPDF libraries loaded
- **Alternative**: Use CSV export

## 📝 Changelog

### Version 2.0 (Current)
- ✅ Added poll archiving system
- ✅ Implemented archive management (save/restore/export/delete)
- ✅ Made date selection fully optional
- ✅ Added current poll name display
- ✅ Enhanced admin dashboard

### Version 1.0
- ✅ Basic poll functionality
- ✅ Percentage-based pricing
- ✅ Payment tracking
- ✅ Data export features

## 🎓 Credits

**Created for**: Iizuka Lab, The University of Tokyo  
**Purpose**: Research group dinner organization  
**License**: Free to use and modify

## 📞 Support

For issues or questions:
1. Check this README
2. Review code comments
3. Test in different browser
4. Clear cache and retry

---

**Version**: 2.0  
**Last Updated**: November 2024  
**Status**: ✅ Production Ready

Enjoy organizing your lab dinners! 🍜🎉
