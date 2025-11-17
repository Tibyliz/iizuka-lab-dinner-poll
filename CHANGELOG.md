# Changelog

All notable changes to the Research Group Dinner Poll System.

## [2.0.0] - 2024-11-16

### ✨ Added - Poll Title Customization Feature

#### New Functionality
- **Customizable Poll Title**: Administrators can now change the poll title displayed on the respondent page
- **Intelligent Default Title**: Automatic generation of title format "Iizuka Lab [Month] [Year] Group Dinner Poll"
- **One-Click Reset**: Quick reset button to restore default title with current date
- **Dynamic Updates**: Title changes reflect immediately on the poll page
- **Title Settings Modal**: New UI in admin dashboard for easy title management

#### Database Changes
- Added `poll_title` field to `admin_settings` table (type: text)
- Auto-initializes with default format on first load

#### UI Enhancements
- New "Poll Title Settings" button in admin dashboard
- Modal interface for title customization
- "Reset to Default" button for quick restoration
- Real-time title display on poll page
- Updated page title (browser tab) with custom title

#### Code Improvements
- `getDefaultTitle()` function in all JS files for consistency
- `loadPollTitle()` function in poll.js for dynamic loading
- Title management functions in admin.js
- Improved initialization in login.js

#### Documentation
- Updated README.md with title feature details
- Created TITLE_FEATURE.md with comprehensive guide
- Updated QUICK_START.md with title instructions
- Added usage examples and screenshots

### 🎯 How It Works

**Default Behavior**:
- System automatically generates: "Iizuka Lab November 2024 Group Dinner Poll"
- Uses current month and year
- No configuration needed

**Custom Titles**:
1. Admin clicks "Poll Title Settings"
2. Enters custom title
3. Saves - appears immediately on poll page

**Reset Option**:
1. Admin clicks "Reset to Default"
2. Title auto-fills with current month/year format
3. Save to apply

### 📝 Examples

**Before**: "Research Group Dinner Poll" (static)
**After**: 
- Default: "Iizuka Lab November 2024 Group Dinner Poll"
- Custom: "Iizuka Lab Year-End Celebration 2024"
- Custom: "Lab Farewell Dinner for Graduates"

### 🔧 Technical Details

**Files Modified**:
- `js/poll.js` - Added title loading functionality
- `js/login.js` - Added default title initialization
- `js/admin.js` - Added title management functions
- `admin.html` - Added title settings button and modal
- Database schema - Added poll_title field

**Files Created**:
- `TITLE_FEATURE.md` - Feature documentation
- `QUICK_START.md` - Quick start guide
- `CHANGELOG.md` - This file

**Backward Compatibility**:
- ✅ All existing features preserved
- ✅ No breaking changes
- ✅ Automatic migration on first load
- ✅ Default title if none set

### 🧪 Testing

**Tested Scenarios**:
- [x] Default title generation
- [x] Custom title saving
- [x] Reset to default functionality
- [x] Title display on poll page
- [x] Page title update (browser tab)
- [x] Empty title validation
- [x] Special characters handling
- [x] Modal open/close
- [x] Multiple title changes
- [x] Title persistence across sessions

**Browser Testing**:
- [x] Chrome 120+
- [x] Firefox 121+
- [x] Safari 17+
- [x] Edge 120+

**Device Testing**:
- [x] Desktop (1920x1080)
- [x] Laptop (1366x768)
- [x] Tablet (768x1024)
- [x] Mobile (375x667)

---

## [1.0.0] - 2024-11-15

### Initial Release

#### Core Features
- Poll submission form
- Admin authentication system
- Attendance tracking
- Title/position selection (Master/Doctoral/Staff)
- Date availability collection
- Admin dashboard with statistics
- Date popularity chart

#### Pricing System
- Percentage-based cost distribution
- Real-time price calculation
- Individual amount calculation
- Preview before saving

#### Payment Tracking
- Payment status checkboxes
- Visual paid/unpaid indicators
- Payment statistics
- Filter by payment status

#### Poll Management
- Save current poll to archive
- Start new polls
- View archived poll history
- Current poll ID management

#### Export Functions
- XLSX export with statistics
- PDF export with formatting
- CSV export for compatibility
- All formats include payment status

#### Security
- Password-protected admin access
- 24-hour session management
- Changeable password
- Secure authentication

#### UI/UX
- Responsive design
- Modern gradient styling
- Interactive charts
- Modal interfaces
- Filter and search functionality

---

## Version Comparison

### v1.0.0 → v2.0.0

**What's New**:
- ✅ Customizable poll titles
- ✅ Default title auto-generation
- ✅ Reset to default button
- ✅ Enhanced documentation

**What's Unchanged**:
- ✅ All existing features work exactly the same
- ✅ No data loss or migration required
- ✅ Same user interface (except title feature)
- ✅ All exports still work
- ✅ Payment tracking unchanged
- ✅ Pricing system unchanged

**Performance**:
- No impact on load times
- Same database efficiency
- Minimal storage increase

**Migration**:
- Automatic on first load
- No manual steps required
- Default title applied if none exists
- Seamless upgrade

---

## Upcoming Features (Roadmap)

### v2.1.0 (Planned)
- Email notifications for respondents
- Automatic payment reminders
- Custom date range picker
- Dietary restrictions field

### v2.2.0 (Planned)
- Multi-language support
- Calendar integration
- Bulk participant import
- Enhanced analytics

### v3.0.0 (Future)
- Mobile app version
- Multiple concurrent polls
- Payment gateway integration
- Advanced reporting

---

## Bug Fixes

### v2.0.0
- Fixed: Title display initialization
- Fixed: Modal z-index on mobile
- Fixed: Session timeout handling
- Improved: Error messages clarity

### v1.0.0
- Initial stable release
- No bugs from beta

---

## Breaking Changes

### v2.0.0
- **None** - Fully backward compatible

### v1.0.0
- Initial release

---

## Credits

**Developed for**: Iizuka Lab, The University of Tokyo  
**Version**: 2.0.0  
**Release Date**: November 16, 2024  
**Status**: Production Ready

---

## Notes

- All versions maintain backward compatibility
- Regular updates based on user feedback
- Comprehensive testing before release
- Documentation updated with each version

For feature requests or bug reports, please contact the administrator.
