# SnapResume MVP

A modern, feature-rich resume builder built with React, TypeScript, and Tailwind CSS. Create professional, ATS-friendly resumes with an intuitive split-screen editor and live preview.

## Features

### Core Functionality
- **Split Screen Layout**: Edit on the left, live preview on the right
- **Section-based Editor**: Toggle sections on/off and reorder via drag-and-drop
- **Live Preview**: See changes in real-time with ATS-friendly templates
- **PDF Export**: Export to PDF with high-quality output
- **Print Support**: Print-friendly CSS with proper margins and formatting

### Resume Sections
- **Header**: Name, title, contact info, and professional links
- **Summary**: Professional summary and career objectives
- **Skills**: Technical skills and competencies
- **Experience**: Work history with detailed bullet points
- **Projects**: Portfolio projects with tech stack and descriptions
- **Education**: Academic background and degrees
- **Awards**: Achievements and recognitions

### Advanced Features
- **Version Management**: Create multiple resume versions for different positions
- **Local Storage**: Automatic saving and persistence
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Keyboard navigation and semantic HTML
- **Onboarding Flow**: 5 simple questions to get started quickly

##  Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand with persistence
- **Forms**: React Hook Form
- **Routing**: React Router DOM
- **Drag & Drop**: React Beautiful DnD
- **PDF Export**: html2pdf.js + react-to-print
- **Icons**: Lucide React

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd snapresume-mvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Textarea.tsx
│   ├── templates/          # Resume templates
│   │   └── ClassicATS.tsx
│   ├── EditorPanel.tsx     # Main editor interface
│   ├── PreviewPanel.tsx    # Live preview
│   ├── Onboarding.tsx      # Initial setup flow
│   ├── ExportButton.tsx    # PDF export
│   └── ResumeBuilder.tsx   # Main builder component
├── store/
│   └── useResumeStore.ts   # Zustand state management
├── types/
│   └── resume.ts          # TypeScript interfaces
├── data/
│   └── sampleResume.ts    # Sample resume data
├── lib/
│   └── utils.ts           # Utility functions
├── App.tsx                # Main application
└── main.tsx               # Entry point
```

## Usage

### Getting Started
1. **Onboarding**: Answer 5 simple questions to populate your resume
2. **Edit**: Use the left panel to edit resume content
3. **Preview**: See live changes in the right panel
4. **Customize**: Toggle sections and reorder as needed
5. **Export**: Download as PDF or print directly

### Editor Features
- **Section Toggle**: Click the eye icon to show/hide sections
- **Expand/Collapse**: Click +/- to expand or collapse sections
- **Drag & Drop**: Use the grip handle to reorder sections
- **Real-time Updates**: All changes appear instantly in the preview

### Version Management
- **Create Versions**: Make position-specific resume versions
- **Switch Between**: Easily switch between different versions
- **Clone & Modify**: Duplicate existing versions for customization

## Templates

### ClassicATS Template
- Clean, professional design
- ATS-friendly formatting
- Proper heading hierarchy
- Optimized for scanning
- Print-ready styling

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices
- Print media

## Print & Export

### Print Features
- Optimized margins and spacing
- Proper page breaks
- Grayscale compatibility
- Font fallbacks

### PDF Export
- High-quality output
- Configurable margins
- A4 format support
- Professional appearance

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Semantic HTML structure

## Future Enhancements

### Phase 2 Features
- Multiple template designs
- AI-powered content suggestions
- Cloud storage and sharing
- Collaboration features
- Advanced analytics

### Phase 3 Features
- Multi-language support
- Resume scoring
- Job matching
- Interview preparation tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with modern web technologies
- Inspired by professional resume builders
- Designed for job seekers and professionals
- Optimized for ATS systems

## Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**SnapResume MVP** - Build your professional resume with confidence! 🎯
