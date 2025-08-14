# SnapResume MVP Demo Guide

## 🚀 Getting Started

The application is now running at `http://localhost:3000`

## 🧪 Testing Steps

### 1. Initial Load
- Open `http://localhost:3000` in your browser
- You should see the onboarding flow with 5 questions

### 2. Onboarding Flow
- **Question 1**: Enter your full name (e.g., "Alex Johnson")
- **Question 2**: Enter your professional title (e.g., "Software Engineer")
- **Question 3**: Enter your email (e.g., "alex@example.com")
- **Question 4**: Write a professional summary (2-3 sentences)
- **Question 5**: Enter your top skills (comma-separated)

### 3. Alternative: Use Sample Data
- Click "Use Sample" button to skip onboarding and use pre-filled data
- This will populate the resume with sample UWRF CS graduate information

### 4. Main Editor
After onboarding, you'll see:
- **Left Panel**: Section-based editor with drag-and-drop reordering
- **Right Panel**: Live preview of your resume

### 5. Editor Features to Test
- **Section Toggle**: Click the eye icon to show/hide sections
- **Expand/Collapse**: Click +/- to expand or collapse sections
- **Drag & Drop**: Use the grip handle to reorder sections
- **Real-time Updates**: Edit any field and see changes in preview

### 6. Resume Sections
- **Header**: Name, title, contact info, links
- **Summary**: Professional summary
- **Skills**: Technical skills
- **Experience**: Work history with bullet points
- **Projects**: Portfolio projects
- **Education**: Academic background
- **Awards**: Achievements

### 7. Export Features
- **Print**: Click the Print button to print the resume
- **PDF Export**: Click Export PDF to download as PDF

### 8. Version Management
- **Create Version**: Click the version dropdown → "Create New Version"
- **Switch Versions**: Use the dropdown to switch between versions
- **Clone Versions**: Create position-specific resume versions

## 🔍 What to Look For

### ✅ Working Features
- Split-screen layout (editor left, preview right)
- Real-time updates as you type
- Section toggling and reordering
- Form validation and data persistence
- Print and PDF export
- Responsive design
- Local storage persistence

### 🎨 Design Elements
- Clean, professional UI
- ATS-friendly resume template
- Proper spacing and typography
- Print-optimized CSS
- Smooth animations and transitions

### 📱 Responsiveness
- Works on desktop, tablet, and mobile
- Proper touch interactions
- Optimized for different screen sizes

## 🐛 Common Issues & Solutions

### If you see blank pages:
1. Check browser console for errors
2. Ensure all dependencies are installed
3. Try refreshing the page

### If drag-and-drop doesn't work:
1. Use the grip handle (⋮⋮) to drag sections
2. Ensure you're dragging to a valid drop zone

### If PDF export fails:
1. Check browser console for errors
2. Ensure the resume content is properly loaded
3. Try printing first, then export

## 🎯 Success Criteria

The MVP is working correctly if:
- ✅ Onboarding flow completes successfully
- ✅ Editor updates preview in real-time
- ✅ Sections can be toggled and reordered
- ✅ Data persists between page refreshes
- ✅ Print and PDF export work
- ✅ Responsive design works on different screen sizes
- ✅ No console errors during normal operation

## 🚀 Next Steps

Once you've verified the MVP is working:
1. Test with different resume content
2. Try creating multiple versions
3. Test export functionality
4. Verify print layout
5. Test on different devices/browsers

---

**Happy Testing!** 🎉
