# 🍜 Iizuka Lab Group Dinner Poll System

A complete, production-ready web application for organizing research group dinners with intelligent pricing and payment tracking.

## ✨ Complete Feature Set

### 📝 Poll Submission Form
- **Name Collection**: Required field for participant identification
- **Attendance Selection**: Yes/No options with smart form behavior
- **Title/Position Selection**: Three categories with visual selection
  - Master Student
  - Doctoral Student  
  - Teachers and Staff
- **Date Availability**: 14-day calendar with multi-select checkboxes
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🎯 Admin Dashboard
- **Real-time Statistics**
  - Total responses
  - Attending vs not attending
  - Payment tracking (paid/unpaid)
  
- **Interactive Chart**
  - Visualize most popular dates
  - Automatic sorting by popularity
  - Beautiful bar chart display

- **Advanced Filtering**
  - Filter by attendance (All/Yes/No)
  - Filter by payment status (All/Paid/Unpaid)
  - Search by name
  - Combine multiple filters

### 💰 Intelligent Pricing System
- **Percentage-based Distribution**
  - Set total dinner cost
  - Assign percentages to each group (must equal 100%)
  - Automatic per-person calculation
  - Real-time price preview

- **Example**: Total ¥10,000
  - Master Students: 20% → ¥500/person (4 people)
  - Doctoral Students: 30% → ¥1,000/person (3 people)
  - Teachers/Staff: 50% → ¥2,500/person (2 people)

### ✅ Payment Tracking
- **Individual Payment Status**
  - Checkbox for each attendee
  - Visual indicators (✓ paid, ✗ unpaid)
  - Real-time statistics
  - Filter by payment status

### 📊 Data Export
- **CSV Export**: Simple comma-separated format
- **XLSX Export**: Professional Excel format with statistics sheet
- **PDF Export**: Beautiful printable report with full details
- All exports include payment status and calculated prices

### 🎨 Title Customization
- **Default Format**: "Iizuka Lab [Month] [Year] Group Dinner Poll"
  - Automatically uses current month and year
  - Example: "Iizuka Lab November 2024 Group Dinner Poll"
  
- **Custom Titles**: Set any custom title
  - "Year-End Celebration 2024"
  - "Welcome Party for New Students"
  - "Lab Anniversary Dinner"

### 📦 Poll Management
- **Save Current Poll**: Archive polls with custom names
- **Start New Poll**: Clear responses and begin fresh
- **View Archives**: Access all historical polls
- Each archive includes full response data and statistics

### 🔐 Security Features
- **Password Protection**: Admin area requires authentication
- **Session Management**: 24-hour sessions
- **Password Change**: Update admin password anytime
- **Default Password**: `iizukalab` (change immediately!)

## 🚀 Quick Start

### For Participants

1. **Open the poll**: Navigate to `index.html`
2. **Fill the form**:
   - Enter your name
   - Select Yes/No for attendance
   - Choose your title (Master/Doctoral/Staff)
   - If attending, select available dates
3. **Submit**: Click "Submit Response"
4. **Done**: See success message

### For Administrators

1. **Access admin**: Click "Admin" at bottom of poll page or go to `admin-login.html`
2. **Login**: Enter password (default: `iizukalab`)
3. **Dashboard**: View all statistics and responses
4. **Configure**:
   - Set poll title
   - Configure pricing (percentages)
   - Track payments
5. **Export**: Download data in CSV, XLSX, or PDF format

## 📁 File Structure

```
project/
├── index.html              # Poll submission form
├── admin-login.html        # Admin authentication
├── admin.html              # Admin dashboard
├── css/
│   ├── style.css          # Poll form styles
│   └── admin.css          # Dashboard styles
└── js/
    ├── poll.js            # Poll form logic
    ├── login.js           # Authentication logic
    └── admin.js           # Complete admin functionality
```

## 💾 Data Storage

### localStorage Structure

**poll_responses**: Array of all poll responses
```javascript
{
  id: "resp_1234567890_abc",
  name: "John Doe",
  will_attend: "yes",
  title: "Doctoral Student",
  available_dates: ["2024-11-20", "2024-11-21"],
  payment_status: false,
  submitted_at: "2024-11-17T10:30:00.000Z",
  poll_id: "poll_1"
}
```

**admin_settings**: Configuration settings
```javascript
{
  current_poll_id: "poll_1",
  poll_title: "Iizuka Lab November 2024 Group Dinner Poll",
  total_cost: 10000,
  master_percent: 20,
  doctoral_percent: 30,
  staff_percent: 50
}
```

**admin_session**: Authentication session
```javascript
{
  authenticated: true,
  timestamp: 1700215800000,
  expiresIn: 86400000
}
```

**admin_password**: Encrypted admin password (default: "iizukalab")

**archived_polls**: Array of saved polls with full data

## 🎯 Usage Examples

### Scenario 1: Monthly Lab Dinner

1. Admin sets title: "Iizuka Lab November 2024 Group Dinner Poll"
2. Share poll link with lab members
3. Members submit availability
4. Admin views chart to find best date
5. Admin sets pricing: 15% / 35% / 50%
6. Admin tracks payments as people pay
7. Export final report as PDF

### Scenario 2: Special Event

1. Admin sets custom title: "Year-End Celebration 2024"
2. Start new poll (clears old responses)
3. Collect responses for special dates
4. Adjust pricing for higher budget event
5. Track payments separately
6. Save poll to archive before next event

## 🔧 Configuration

### Change Default Password

1. Login to admin dashboard
2. Click "Settings" button
3. Enter new password
4. Click "Change Password"

### Customize Poll Title

1. In admin dashboard, click "Poll Title Settings"
2. Enter custom title or click "Reset to Default"
3. Click "Save Title"
4. Title updates on poll form immediately

### Set Pricing

1. Click "Price Settings" in dashboard
2. Enter total cost in yen
3. Set percentages (must equal 100%):
   - Master Students: e.g., 20%
   - Doctoral Students: e.g., 30%
   - Teachers/Staff: e.g., 50%
4. View real-time preview
5. Click "Save Settings"

## 📊 Export Details

### CSV Export
- Simple format compatible with all spreadsheet software
- Includes: Name, Attendance, Title, Dates, Price, Paid, Submitted

### XLSX Export
- Professional Excel workbook
- Sheet 1: All responses with formatting
- Sheet 2: Statistics summary
- Ready for further analysis

### PDF Export
- Beautiful printable report
- Header with generation date
- Statistics section
- Complete response list
- Price and payment details

## 🌐 Deployment

### GitHub Pages

1. Upload all files to GitHub repository
2. Go to Settings → Pages
3. Select main branch and / (root)
4. Save and wait 2-3 minutes
5. Access at: `https://username.github.io/repo-name/`

### Important Notes

- Data is stored in browser localStorage
- Each browser/device has independent data
- Regular exports recommended for backup
- Admin should use consistent device
- Clear browser data will delete all responses

## 🎨 Design Features

- **Modern Gradient Theme**: Purple/blue gradient background
- **Card-based Layout**: Clean, professional appearance
- **Smooth Animations**: Slide-up effects and transitions
- **Responsive Design**: Perfect on all screen sizes
- **Icon Integration**: Font Awesome icons throughout
- **Interactive Elements**: Hover effects and visual feedback

## 🛠️ Technical Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (ES6+)**: Vanilla JS, no frameworks
- **Chart.js**: Beautiful data visualization
- **SheetJS (XLSX)**: Excel export functionality
- **jsPDF**: PDF generation
- **Font Awesome**: Icon library
- **localStorage**: Client-side data persistence

## ⚠️ Important Notes

### Data Persistence
- All data stored in browser localStorage
- Clearing browser data will delete all responses
- **Recommendation**: Regular exports for backup
- Each browser/device maintains separate data

### Browser Compatibility
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ❌ Internet Explorer (not supported)

### Security Considerations
- Password stored in localStorage (client-side only)
- No server-side authentication
- Suitable for small, trusted groups
- Not recommended for sensitive data

## 🎓 Perfect For

- Academic research groups
- Laboratory team dinners
- Department gatherings
- Small organization events
- Any group requiring fair cost distribution

## 📝 Future Enhancements (Optional)

- Email notifications
- Calendar integration
- Multi-language support
- Cloud data backup
- Mobile app version

## 🤝 Support

For issues or questions:
1. Check this README
2. Review browser console for errors
3. Ensure all files are uploaded correctly
4. Clear browser cache and try again

## 📄 License

Free to use and modify for academic and non-commercial purposes.

---

**Created for**: Iizuka Lab, The University of Tokyo  
**Version**: 2.0 (Complete Feature Set)  
**Last Updated**: November 2024

**Default Admin Password**: `iizukalab` (Please change after first login!)

---

## ✅ Quick Checklist

- [ ] All files uploaded to GitHub
- [ ] GitHub Pages enabled
- [ ] Admin password changed
- [ ] Poll title customized
- [ ] Pricing configured
- [ ] Test submission completed
- [ ] Export functions tested
- [ ] Link shared with group members

**Enjoy your fully-featured dinner poll system!** 🎉
