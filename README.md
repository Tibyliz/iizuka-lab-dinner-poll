# Research Group Dinner Poll System

A comprehensive polling system designed for research groups to organize dinners efficiently. Features include customizable poll titles, attendance tracking, percentage-based cost distribution, payment tracking, and multiple export options.

## 🎯 Project Overview

This system helps research groups (labs, departments, etc.) collect availability for group dinners, manage costs fairly based on member roles, and track payments. Perfect for academic institutions like Iizuka Lab at The University of Tokyo.

## ✨ Key Features

### 1. **Customizable Poll Title** ⭐ NEW
- **Default Format**: "Iizuka Lab [Month] [Year] Group Dinner Poll"
- **Auto-Generated**: Uses current month and year automatically
- **Fully Customizable**: Change title anytime from admin panel
- **Reset Option**: One-click reset to default format with current date
- **Dynamic Display**: Title updates on respondent page automatically

### 2. **Respondent Poll Form**
- Name collection
- Attendance selection (Yes/No)
- Title/Position selection (Master Student, Doctoral Student, Teachers and Staff)
- Multiple date availability selection
- Mobile-responsive design
- Real-time validation

### 3. **Admin Dashboard**
- Password-protected access (default: `iizukalab`)
- Real-time statistics display
- Interactive date popularity chart
- Response filtering by attendance and payment status
- Search functionality
- Comprehensive data table

### 4. **Percentage-Based Pricing System**
- Set total dinner cost
- Define cost distribution by percentage (e.g., 20%, 30%, 50%)
- Must total 100% for validation
- Real-time preview of individual costs
- Automatic calculation per person
- Fair distribution based on role/financial capacity

### 5. **Payment Tracking**
- Checkbox to mark payment received
- Visual indicators (Paid/Unpaid)
- Payment statistics counter
- Filter by payment status
- Export includes payment information

### 6. **Poll Management**
- Save current poll to archive
- Start new polls
- View archived poll history
- Maintain historical data

### 7. **Multi-Format Export**
- **XLSX (Excel)**: Detailed responses + statistics sheet
- **PDF**: Professional printable report
- **CSV**: Universal compatibility

### 8. **Security**
- Password-protected admin access
- Changeable password
- 24-hour session management

## 📁 Project Structure

```
├── index.html              # Main poll submission form
├── admin-login.html        # Admin authentication page
├── admin.html              # Admin dashboard
├── css/
│   ├── style.css          # Poll form and login styles
│   └── admin.css          # Admin dashboard styles
├── js/
│   ├── poll.js            # Poll form logic with title loading
│   ├── login.js           # Authentication logic
│   └── admin.js           # Complete admin functionality
└── README.md              # This file
```

## 🚀 Getting Started

### For Participants

1. Open `index.html`
2. Fill in your name
3. Select whether you'll attend
4. Choose your title (Master/Doctoral/Staff)
5. If attending, select all available dates
6. Submit

### For Administrators

#### First Time Setup
1. Open `admin-login.html`
2. Enter default password: `iizukalab`
3. **Important**: Immediately change password in Settings

#### Configure Poll Title
1. Click "Poll Title Settings" button
2. Enter custom title or use "Reset to Default" for auto-generated title
3. Default format: "Iizuka Lab [Current Month] [Current Year] Group Dinner Poll"
4. Save changes

#### Configure Pricing
1. Click "Price Settings" button
2. Enter total dinner cost
3. Set percentages for each group (must equal 100%)
   - Master Students: e.g., 20%
   - Doctoral Students: e.g., 30%
   - Teachers and Staff: e.g., 50%
4. Preview prices in real-time
5. Save settings

#### Track Payments
1. View calculated amount for each attendee
2. Check the payment checkbox when money is received
3. Use "Paid/Unpaid" filter to see who hasn't paid
4. Export final report with payment status

#### Manage Polls
- **Save Current Poll**: Archive current responses
- **Start New Poll**: Begin fresh collection (archives old data)
- **View Archives**: Access historical poll data

#### Export Data
- Click desired format (XLSX, PDF, or CSV)
- All formats include payment status
- XLSX includes separate statistics sheet

## 💡 Usage Examples

### Example: December 2024 Dinner

**Poll Title**: "Iizuka Lab December 2024 Group Dinner Poll"

**Participants**:
- 5 Master Students
- 8 Doctoral Students  
- 3 Teachers/Staff

**Cost Settings**:
- Total Cost: ¥30,000
- Distribution: 15% / 35% / 50%

**Automatic Calculation**:
- Master Students: ¥30,000 × 15% = ¥4,500 ÷ 5 = **¥900/person**
- Doctoral Students: ¥30,000 × 35% = ¥10,500 ÷ 8 = **¥1,312.50/person**
- Teachers/Staff: ¥30,000 × 50% = ¥15,000 ÷ 3 = **¥5,000/person**

**Payment Tracking**:
- Check boxes as payments received
- Filter to see unpaid members
- Send reminders to unpaid attendees
- Export final report when complete

## 🗄️ Database Schema

### Tables

#### 1. `poll_responses`
- `id`: Unique identifier
- `name`: Respondent name
- `will_attend`: "yes" or "no"
- `title`: Master Student / Doctoral Student / Teachers and Staff
- `available_dates`: Array of date strings
- `poll_id`: Current poll identifier
- `payment_status`: Boolean (true = paid)

#### 2. `admin_settings`
- `id`: Settings identifier
- `password`: Admin password
- `total_cost`: Total dinner cost
- `master_percent`: Master student percentage
- `doctoral_percent`: Doctoral student percentage
- `staff_percent`: Teachers and staff percentage
- `current_poll_id`: Active poll identifier
- `poll_title`: **Customizable poll title** ⭐ NEW

#### 3. `archived_polls`
- `id`: Archive identifier
- `poll_id`: Archived poll identifier
- `poll_name`: Name of archived poll
- `archived_date`: Date of archiving
- `total_responses`: Number of responses
- `total_attendees`: Number attending

## 🎨 Features Highlights

### Smart Title Management
- **Auto-Generation**: Automatically creates title with current month/year
- **Easy Customization**: Change anytime from admin panel
- **One-Click Reset**: Restore default format instantly
- **Live Updates**: Changes reflect immediately on poll page

### Intelligent Pricing
- **Percentage-Based**: Simple and fair distribution
- **Real-Time Validation**: Ensures percentages total 100%
- **Live Preview**: See costs before saving
- **Automatic Calculation**: No manual math needed

### Comprehensive Tracking
- **Visual Indicators**: Clear paid/unpaid status
- **Quick Filters**: Find unpaid members instantly
- **Statistics Dashboard**: See payment progress at a glance
- **Export Everything**: All formats include payment data

## 🔧 Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js
- **Export**: SheetJS (XLSX), jsPDF (PDF)
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Inter)
- **Data Storage**: RESTful Table API

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Responsive Design
- Desktop (1920px+)
- Laptop (1366px - 1920px)
- Tablet (768px - 1365px)
- Mobile (320px - 767px)

## 📊 Current Functional URIs

### Poll Submission
- **Path**: `index.html`
- **Function**: Public poll form
- **Features**: Dynamic title display, form validation, date selection

### Admin Login
- **Path**: `admin-login.html`
- **Function**: Admin authentication
- **Default Password**: `iizukalab`

### Admin Dashboard
- **Path**: `admin.html`
- **Function**: Complete admin interface
- **Features**:
  - Poll Title Settings ⭐ NEW
  - Price Settings
  - Payment Tracking
  - Poll Management
  - Data Export
  - Settings & Password Change

## 📝 Not Yet Implemented

- Email notifications
- Automatic reminders for unpaid members
- Multi-language support
- Calendar integration
- Mobile app version
- Bulk import of participants
- Advanced analytics dashboard
- Custom date range selection
- Multiple concurrent polls

## 🔮 Recommended Next Steps

1. **Enhanced Notifications**
   - Email reminders for unpaid members
   - Automatic deadline reminders
   - Admin notifications for new responses

2. **Advanced Features**
   - Custom date picker with blackout dates
   - Dietary restrictions field
   - Special requirements notes
   - Budget suggestions based on attendance

3. **Improved Analytics**
   - Historical cost analysis
   - Attendance trends
   - Popular date patterns
   - Payment speed statistics

4. **Integration Options**
   - Google Calendar export
   - Slack/Teams notifications
   - University portal integration
   - Payment gateway integration

5. **User Experience**
   - Remember me option for admins
   - Dark mode theme
   - Print-optimized views
   - Mobile app version

## 🔐 Security Notes

- Change default password immediately after first login
- Use strong passwords (8+ characters, mixed case, numbers)
- Log out when finished
- Session expires after 24 hours
- Clear browser cache on shared computers

## 🆘 Troubleshooting

### Can't Login
- Verify password spelling/case
- Clear browser cache
- Check if session expired
- Try different browser

### Poll Title Not Updating
- Refresh the page
- Clear browser cache
- Check admin settings saved correctly

### Prices Not Calculating
- Ensure total cost is set
- Verify percentages equal 100%
- Check that responses exist
- Refresh the page

### Chart Not Showing
- Check if attendees exist
- Verify dates are selected
- Refresh the page
- Try different browser

### Export Not Working
- Allow pop-ups in browser
- Check disk space
- Try different export format
- Refresh and retry

## 📞 Support

For issues or questions:
1. Check this README
2. Review browser console for errors
3. Verify all fields are filled correctly
4. Try a different browser
5. Clear cache and retry

## 📄 License

This project is created for Iizuka Lab at The University of Tokyo.

## 🎓 Perfect For

- Research laboratories
- Academic departments
- Study groups
- Team gatherings
- Faculty events
- Student organizations

---

**Version**: 2.0 (with Title Customization)  
**Last Updated**: November 2024  
**Created for**: Iizuka Lab, The University of Tokyo

Enjoy organizing your research group dinners efficiently! 🍜🎉
