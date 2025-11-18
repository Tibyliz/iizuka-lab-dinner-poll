# Testing Checklist - Editable Pricing Feature

## 🎯 Overview
This checklist ensures the editable pricing feature works correctly across all scenarios and devices.

---

## ✅ Pre-Deployment Testing

### **1. Input Field Functionality** (Priority: HIGH)

#### Basic Input Operations
- [ ] Can click on Bachelor input field
- [ ] Can type numbers in Bachelor input field
- [ ] Can type decimals (e.g., 17.5) in Bachelor input field
- [ ] Can click on Master's input field
- [ ] Can type numbers in Master's input field
- [ ] Can type decimals in Master's input field
- [ ] Can click on PhD input field
- [ ] Can type numbers in PhD input field
- [ ] Can type decimals in PhD input field
- [ ] Can click on Faculty input field
- [ ] Can type numbers in Faculty input field
- [ ] Can type decimals in Faculty input field

#### Input Validation
- [ ] Typing letters (abc) is ignored
- [ ] Typing special characters (!@#) is ignored
- [ ] Negative numbers (-10) are converted to 0
- [ ] Values > 100 are capped at 100
- [ ] Empty input defaults to 0
- [ ] Decimals round to nearest 0.5
- [ ] Input shows correct precision (0.5% steps)

---

### **2. Slider Functionality** (Priority: HIGH)

#### Basic Slider Operations
- [ ] Can drag Bachelor slider
- [ ] Can drag Master's slider
- [ ] Can drag PhD slider
- [ ] Can drag Faculty slider
- [ ] Slider moves smoothly (no jerking)
- [ ] Slider stops at appropriate positions

#### Slider Validation
- [ ] Slider min value is 0
- [ ] Slider max value is 100
- [ ] Slider step is 1 (not 5)
- [ ] Slider thumb shows hover effect
- [ ] Slider track shows gradient

---

### **3. Two-Way Binding** (Priority: CRITICAL)

#### Input → Slider Synchronization
- [ ] Typing in Bachelor input updates Bachelor slider
- [ ] Typing in Master's input updates Master's slider
- [ ] Typing in PhD input updates PhD slider
- [ ] Typing in Faculty input updates Faculty slider
- [ ] Synchronization happens in real-time
- [ ] No delay or lag in updates

#### Slider → Input Synchronization
- [ ] Dragging Bachelor slider updates Bachelor input
- [ ] Dragging Master's slider updates Master's input
- [ ] Dragging PhD slider updates PhD input
- [ ] Dragging Faculty slider updates Faculty input
- [ ] Input displays correct value immediately
- [ ] Input shows decimals if applicable

---

### **4. Amount Calculation** (Priority: HIGH)

#### Real-Time Updates
- [ ] Bachelor amount updates when percentage changes
- [ ] Master's amount updates when percentage changes
- [ ] PhD amount updates when percentage changes
- [ ] Faculty amount updates when percentage changes
- [ ] Amounts display in ¥ (Yen) format
- [ ] Amounts show thousand separators (e.g., ¥2,500)

#### Calculation Accuracy
- [ ] Base price ¥10,000, Bachelor 15% = ¥1,500
- [ ] Base price ¥10,000, Master's 20% = ¥2,000
- [ ] Base price ¥10,000, PhD 30% = ¥3,000
- [ ] Base price ¥10,000, Faculty 35% = ¥3,500
- [ ] Decimal percentages calculate correctly (17.5% = ¥1,750)
- [ ] Changing base price recalculates all amounts

---

### **5. Total Validation** (Priority: CRITICAL)

#### Display Accuracy
- [ ] Total percentage displays current sum
- [ ] Total updates in real-time
- [ ] Total shows one decimal place (e.g., 100.0%)

#### Visual Indicators
- [ ] Green checkmark (✅) shows when total = 100%
- [ ] Red X (❌) shows when total ≠ 100%
- [ ] Warning message appears when total ≠ 100%
- [ ] Warning message hides when total = 100%
- [ ] Icon color changes correctly (green/red)

#### Edge Cases
- [ ] Total = 99.9% shows warning
- [ ] Total = 100.0% shows success
- [ ] Total = 100.1% shows warning
- [ ] Total = 0% shows warning
- [ ] Total = 200% shows warning

---

### **6. Save Functionality** (Priority: CRITICAL)

#### Save Operations
- [ ] "Save Pricing" button is visible
- [ ] Button is clickable
- [ ] Button shows loading state when saving
- [ ] Success message appears after save
- [ ] Error message shows if save fails

#### Save Validation
- [ ] Cannot save if total ≠ 100%
- [ ] Warning appears if trying to save with invalid total
- [ ] Can save if total = 100%
- [ ] Decimal values are saved correctly
- [ ] Saved values persist to Firebase

#### After Save
- [ ] Page can be refreshed without losing values
- [ ] Reloading page shows correct percentages
- [ ] Reloading page shows correct amounts
- [ ] Input fields show saved values
- [ ] Sliders show saved positions

---

### **7. Firebase Integration** (Priority: HIGH)

#### Data Storage
- [ ] Pricing config saves to Firebase
- [ ] Decimal values save correctly (not rounded)
- [ ] Base price saves correctly
- [ ] All four position percentages save
- [ ] Timestamp updates on save

#### Data Retrieval
- [ ] Page load retrieves config from Firebase
- [ ] Decimal values load correctly
- [ ] Input fields populate with saved values
- [ ] Sliders position correctly on load
- [ ] Amounts calculate on load

---

### **8. UI/UX Testing** (Priority: MEDIUM)

#### Visual Design
- [ ] Input fields have clear borders
- [ ] Percentage symbol (%) is visible
- [ ] Input fields align with sliders
- [ ] Spacing is consistent
- [ ] Colors match design system

#### Focus States
- [ ] Input fields show focus border (blue)
- [ ] Focus border is clearly visible
- [ ] Focus shadow appears on inputs
- [ ] Tab order is logical
- [ ] Enter key moves to next field

#### Hover States
- [ ] Slider thumb scales on hover
- [ ] Cursor changes to pointer on slider
- [ ] Input fields show cursor change
- [ ] Buttons show hover effect

#### Animations
- [ ] Transitions are smooth (0.3s)
- [ ] No jarring movements
- [ ] Color changes are smooth
- [ ] Shadow changes are smooth

---

### **9. Responsive Design** (Priority: HIGH)

#### Desktop (> 1024px)
- [ ] Four pricing items fit on screen
- [ ] No horizontal scrolling needed
- [ ] Controls are comfortable size
- [ ] Text is readable
- [ ] Touch targets are adequate

#### Tablet (768px - 1024px)
- [ ] Layout adjusts appropriately
- [ ] Controls remain usable
- [ ] Text remains readable
- [ ] No overlap of elements

#### Mobile (< 768px)
- [ ] Controls stack vertically
- [ ] Input fields are full width
- [ ] Sliders are usable with thumb
- [ ] Text is readable without zooming
- [ ] Buttons are thumb-sized
- [ ] No horizontal scrolling

---

### **10. Cross-Browser Testing** (Priority: MEDIUM)

#### Chrome
- [ ] Input fields work
- [ ] Sliders work
- [ ] Two-way binding works
- [ ] Calculations are accurate
- [ ] Firebase saves correctly

#### Firefox
- [ ] Input fields work
- [ ] Sliders work
- [ ] Two-way binding works
- [ ] Calculations are accurate
- [ ] Firefox-specific slider styles render

#### Safari (Desktop)
- [ ] Input fields work
- [ ] Sliders work
- [ ] Two-way binding works
- [ ] Calculations are accurate
- [ ] Webkit styles render correctly

#### Safari (Mobile)
- [ ] Touch interactions work
- [ ] Input fields accept input
- [ ] Sliders draggable with finger
- [ ] No zoom on input focus
- [ ] Keyboard doesn't break layout

#### Edge
- [ ] All features work
- [ ] No Edge-specific bugs
- [ ] Performance is acceptable

---

### **11. Accessibility Testing** (Priority: MEDIUM)

#### Keyboard Navigation
- [ ] Can tab through all inputs
- [ ] Can tab to sliders
- [ ] Arrow keys work on inputs
- [ ] Enter key submits/advances
- [ ] Shift+Tab works backward

#### Screen Reader
- [ ] Input labels are read
- [ ] Percentage values are announced
- [ ] Amount values are announced
- [ ] Error messages are announced
- [ ] Success messages are announced

#### Visual Accessibility
- [ ] Sufficient color contrast
- [ ] Focus indicators visible
- [ ] Text is readable
- [ ] No color-only information
- [ ] Works in high contrast mode

---

### **12. Performance Testing** (Priority: LOW)

#### Speed
- [ ] Input changes update within 50ms
- [ ] Slider changes update within 50ms
- [ ] Total recalculation is instant
- [ ] Amount updates are instant
- [ ] No visible lag on any interaction

#### Memory
- [ ] No memory leaks after extended use
- [ ] Page remains responsive
- [ ] Browser doesn't slow down
- [ ] CPU usage is reasonable

---

### **13. Edge Case Testing** (Priority: MEDIUM)

#### Unusual Inputs
- [ ] Copy-paste text into input (handled correctly)
- [ ] Copy-paste negative number (converted to 0)
- [ ] Copy-paste > 100 (capped at 100)
- [ ] Rapid clicking (no crashes)
- [ ] Rapid typing (no lost characters)

#### Boundary Values
- [ ] 0% percentage (works)
- [ ] 100% percentage (works)
- [ ] 0.5% percentage (works)
- [ ] 99.5% percentage (works)
- [ ] All values at 0% (total = 0%, shows warning)
- [ ] One value at 100%, rest at 0% (total = 100%, valid)

#### Network Issues
- [ ] Save works with slow connection
- [ ] Load works with slow connection
- [ ] Error message on network failure
- [ ] Retry mechanism works

---

### **14. Integration Testing** (Priority: HIGH)

#### With Responses Table
- [ ] Responses table uses new percentages
- [ ] Amounts in table update after save
- [ ] Custom amounts still work
- [ ] Edit amount modal works
- [ ] Payment tracking works

#### With Statistics
- [ ] Total cost uses base price
- [ ] Individual amounts calculated correctly
- [ ] Statistics update after pricing save
- [ ] Charts use correct data

#### With Archives
- [ ] Archives save pricing config
- [ ] Archived pricing can be restored
- [ ] Old percentages don't overwrite new ones

---

### **15. User Acceptance Testing** (Priority: HIGH)

#### Ease of Use
- [ ] Feature is intuitive
- [ ] No training needed for basic use
- [ ] Error messages are clear
- [ ] Success feedback is clear
- [ ] Documentation is clear

#### Real-World Scenarios
- [ ] Can set equal distribution (25% each)
- [ ] Can set custom ratios (15/20/30/35)
- [ ] Can fine-tune values (17.5/22.5/30/30)
- [ ] Can quickly adjust one value
- [ ] Can save and reload successfully

---

## 📊 Test Results Summary

### Test Categories
- Total Tests: 200+
- Critical Priority: 50
- High Priority: 80
- Medium Priority: 50
- Low Priority: 20

### Success Criteria
- ✅ All CRITICAL tests must pass
- ✅ 95%+ HIGH priority tests must pass
- ✅ 80%+ MEDIUM priority tests must pass
- ✅ 50%+ LOW priority tests can pass

---

## 🐛 Bug Reporting Template

If you find a bug, report it with:

```
Bug ID: [Sequential number]
Priority: [Critical/High/Medium/Low]
Category: [e.g., Input Validation]

Description:
[What happened]

Expected Behavior:
[What should happen]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Environment:
- Browser: [Chrome/Firefox/Safari/Edge]
- Version: [e.g., Chrome 120]
- OS: [Windows/Mac/iOS/Android]
- Device: [Desktop/Mobile/Tablet]

Screenshots:
[Attach if applicable]

Console Errors:
[Copy from F12 console]
```

---

## ✅ Sign-Off

**Tested by:** _________________  
**Date:** _________________  
**Result:** ☐ Pass ☐ Fail  
**Notes:** _________________

---

## 🚀 Ready for Production?

All tests must pass before deploying to production:

- [ ] All critical tests passed
- [ ] All high priority tests passed
- [ ] 80%+ medium priority tests passed
- [ ] No blocking bugs found
- [ ] Documentation updated
- [ ] User guide created
- [ ] Backup of old version created

**Approved by:** _________________  
**Deployment Date:** _________________

---

**Happy Testing!** 🎉
