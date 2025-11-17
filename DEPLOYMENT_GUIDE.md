# 🚀 Deployment Guide - Iizuka Lab Dinner Poll

## Quick Guide: Upload to GitHub

### Step 1: Prepare Your Files

You should have these files ready:

```
✅ index.html
✅ admin-login.html
✅ admin.html
✅ css/style.css
✅ css/admin.css
✅ js/poll.js
✅ js/login.js
✅ js/admin.js
✅ README.md
```

### Step 2: Upload to GitHub (Web Interface)

**Method A: Simple Upload (Recommended)**

1. **Login to GitHub**: Go to github.com and login

2. **Go to your repository**: Navigate to `tibyliz/iizuka-lab-dinner-poll`

3. **Delete old files first** (if any):
   - Click on each file
   - Click the trash icon
   - Commit the deletion

4. **Upload new files**:
   - Click "Add file" → "Upload files"
   - Drag and drop ALL files (you can drag the folders too!)
   - Or click "choose your files" to select them
   - **Important**: Make sure folder structure is maintained:
     - css/ folder with 2 CSS files inside
     - js/ folder with 3 JS files inside

5. **Commit the upload**:
   - Write commit message: "Complete dinner poll system with all features"
   - Click "Commit changes"

### Step 3: Enable GitHub Pages

1. **Go to Settings**: Click "Settings" tab in your repository

2. **Navigate to Pages**: Click "Pages" in left sidebar

3. **Configure source**:
   - Source: Deploy from a branch
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
   - Click "Save"

4. **Wait 2-3 minutes**: GitHub will build your site

5. **Get your URL**: 
   - Refresh the Pages settings page
   - You'll see: "Your site is live at https://tibyliz.github.io/iizuka-lab-dinner-poll/"

### Step 4: Test Your Deployment

1. **Visit your site**: Click the provided URL

2. **Test poll form**:
   - Fill out a test response
   - Submit
   - Should see success message

3. **Test admin login**:
   - Click "Admin" link at bottom
   - Or go to: `https://tibyliz.github.io/iizuka-lab-dinner-poll/admin-login.html`
   - Enter password: `iizukalab`
   - Should redirect to dashboard

4. **Test admin features**:
   - View the test response you submitted
   - Try changing the poll title
   - Try setting pricing percentages
   - Try marking payment status
   - Try exporting to CSV/XLSX/PDF

### Step 5: Initial Configuration

1. **Change Admin Password** (Important!):
   - Login to admin dashboard
   - Click "Settings"
   - Enter new secure password
   - Click "Change Password"

2. **Set Poll Title**:
   - Click "Poll Title Settings"
   - Keep default or enter custom title
   - Click "Save Title"

3. **Configure Pricing** (if known):
   - Click "Price Settings"
   - Enter total dinner cost
   - Set percentages (must equal 100%)
   - Click "Save Settings"

### Step 6: Share with Your Group

1. **Poll URL**: `https://tibyliz.github.io/iizuka-lab-dinner-poll/`
   - Share this link with all lab members
   - They can submit their responses

2. **Admin URL**: `https://tibyliz.github.io/iizuka-lab-dinner-poll/admin-login.html`
   - Keep this private (for organizers only)
   - Or just use the "Admin" link at bottom of poll page

## 🔧 Troubleshooting

### Problem: 404 Error

**Solutions**:
- Wait 5 minutes after enabling Pages
- Check that all files are in root directory (not in a subfolder)
- Verify repository is Public
- Check that GitHub Pages is enabled in settings

### Problem: Styles not loading

**Solutions**:
- Clear browser cache (Ctrl+Shift+Delete)
- Check that css/ folder contains both CSS files
- Verify file paths in HTML are correct
- Hard refresh (Ctrl+F5 or Cmd+Shift+R)

### Problem: JavaScript not working

**Solutions**:
- Clear browser cache
- Check browser console (F12) for errors
- Verify all JS files are in js/ folder
- Make sure you're using a modern browser

### Problem: Login doesn't work

**Solutions**:
- Clear browser localStorage:
  - F12 → Application → Local Storage → Clear All
  - Or use browser's "Clear browsing data"
- Try incognito/private mode
- Make sure password is exactly: `iizukalab` (all lowercase)

### Problem: Data not saving

**Solutions**:
- Check browser allows localStorage
- Don't use private/incognito mode for admin
- Ensure cookies/site data is enabled
- Try a different browser

## 📱 Mobile Access

The site is fully responsive! Users can:
- Submit responses from phones
- Admins can check dashboard on mobile
- All features work on tablets

## 💾 Data Management

### Regular Backups

**Recommended Schedule**:
- Export responses weekly as XLSX
- Save PDF report monthly
- Archive completed polls before starting new ones

### Data Location

All data is stored in your browser's localStorage:
- **For participants**: Data is temporary (just for submission)
- **For admin**: Data persists until cleared
- **Important**: Use same computer/browser for admin access

### Starting Fresh

To clear all data and start new poll:
1. Login to admin dashboard
2. Click "Poll Management"
3. Optionally "Save Current Poll" (archives it)
4. Click "Start New Poll"
5. Confirm action

## 🎯 Best Practices

### For Organizers

1. **Test First**: Submit 2-3 test responses to verify everything works
2. **Change Password**: Immediately change from default `iizukalab`
3. **Regular Exports**: Export data every few days as backup
4. **Consistent Device**: Use same computer/browser for admin tasks
5. **Archive Old Polls**: Save completed polls before starting new ones

### For Participants

1. **Use Modern Browser**: Chrome, Firefox, Safari, or Edge
2. **Complete Form**: Fill all required fields before submitting
3. **Check Dates**: Ensure you select correct available dates
4. **Contact Admin**: If submission fails, contact organizer

## 🌟 Advanced Tips

### Custom Domain (Optional)

If you have your own domain:
1. Go to repository Settings → Pages
2. Enter custom domain
3. Add CNAME record in your DNS settings
4. Wait for DNS propagation (can take 24 hours)

### Editing After Deployment

**Quick Edits on GitHub**:
1. Click on any file in repository
2. Click pencil icon (Edit)
3. Make changes
4. Commit changes
5. Wait 2-3 minutes for redeployment

**Larger Updates**:
1. Download files from Genspark
2. Replace files in GitHub
3. Commit and wait for rebuild

## ✅ Deployment Checklist

Before sharing with your group:

- [ ] All files uploaded to GitHub
- [ ] Correct folder structure (css/ and js/)
- [ ] GitHub Pages enabled
- [ ] Site accessible at public URL
- [ ] Test poll submission works
- [ ] Admin login works
- [ ] Admin password changed
- [ ] Poll title configured
- [ ] Test response visible in dashboard
- [ ] Export functions tested (CSV/XLSX/PDF)
- [ ] Payment tracking tested
- [ ] Pricing calculator tested

## 🎉 You're Ready!

Your dinner poll system is now live and ready to use!

**Your URLs**:
- Poll Form: `https://tibyliz.github.io/iizuka-lab-dinner-poll/`
- Admin Login: `https://tibyliz.github.io/iizuka-lab-dinner-poll/admin-login.html`

**Default Password**: `iizukalab`

**Share the poll link with your lab members and start collecting responses!**

---

Need help? Check README.md for detailed feature documentation.
