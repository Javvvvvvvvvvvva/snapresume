import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ResumeData, ResumeVersion, SectionConfig, SectionId } from '../types/resume';

interface ResumeStore {
  // Current resume data
  currentResume: ResumeData;
  
  // Resume versions
  versions: ResumeVersion[];
  currentVersionId: string | null;
  
  // Section configuration
  sections: SectionConfig[];
  

  
  // Auto-save and undo/redo
  autoSaveEnabled: boolean;
  lastSaved: Date | null;
  isSaving: boolean;
  undoStack: ResumeData[];
  redoStack: ResumeData[];
  
  // Actions
  updateProfile: (profile: Partial<ResumeData['profile']>) => void;
  updateSummary: (summary: string) => void;
  updateSkills: (skills: string[]) => void;
  updateExperience: (experience: ResumeData['experience']) => void;
  updateProjects: (projects: ResumeData['projects']) => void;
  updateEducation: (education: ResumeData['education']) => void;
  updateAwards: (awards: string[]) => void;
  
  // Skills parsing helper
  parseSkillsFromString: (skillsString: string) => string[];
  
  // Section management
  toggleSection: (sectionId: SectionId) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  
  // Version management
  createVersion: (name: string) => void;
  switchVersion: (versionId: string) => void;
  deleteVersion: (versionId: string) => void;
  cloneVersion: (versionId: string, newName: string) => void;
  
  // Auto-save and undo/redo
  enableAutoSave: (enabled: boolean) => void;
  saveCurrentVersion: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Reset
  resetToDefault: () => void;
  
  // Save to current version
  saveToCurrentVersion: () => void;
  
  // Load sample data
  loadSampleData: () => void;

  autoRecover: () => boolean;
}

const defaultResume: ResumeData = {
  profile: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    links: [{ label: 'GitHub', url: '' }]
  },
  summary: '',
  skills: [],
  experience: [],
  projects: [],
  education: [],
  awards: []
};

const defaultSections: SectionConfig[] = [
  { id: 'profile', label: 'Header', enabled: true, order: 0 },
  { id: 'summary', label: 'Summary', enabled: true, order: 1 },
  { id: 'skills', label: 'Skills', enabled: true, order: 2 },
  { id: 'experience', label: 'Experience', enabled: true, order: 3 },
  { id: 'projects', label: 'Projects', enabled: true, order: 4 },
  { id: 'education', label: 'Education', enabled: true, order: 5 },
  { id: 'awards', label: 'Awards', enabled: true, order: 6 }
];

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      currentResume: defaultResume,
      versions: [{
        id: 'default',
        name: 'Default Resume',
        data: defaultResume,
        createdAt: new Date(),
        updatedAt: new Date()
      }],
      currentVersionId: 'default',
      sections: defaultSections,

      autoSaveEnabled: true,
      lastSaved: new Date(),
      isSaving: false,
      undoStack: [],
      redoStack: [],

      updateProfile: (profile) => {
        const currentState = get();
        // Only update if there are actual changes
        const hasChanges = Object.keys(profile).some(key => 
          currentState.currentResume.profile[key as keyof typeof currentState.currentResume.profile] !== profile[key as keyof typeof profile]
        );
        
        if (!hasChanges) return;
        
        set((state) => ({
          currentResume: {
            ...state.currentResume,
            profile: { ...state.currentResume.profile, ...profile }
          },
          undoStack: [...currentState.undoStack.slice(-10), currentState.currentResume], // Limit undo stack
          redoStack: []
        }));
        get().saveToCurrentVersion();
      },

      updateSummary: (summary) => {
        const currentState = get();
        if (currentState.currentResume.summary === summary) return;
        
        set((state) => ({
          currentResume: { ...state.currentResume, summary },
          undoStack: [...currentState.undoStack.slice(-10), currentState.currentResume],
          redoStack: []
        }));
        get().saveToCurrentVersion();
      },

      updateSkills: (skills) => {
        const currentState = get();
        console.log('updateSkills called:', { 
          incomingSkills: skills, 
          currentSkills: currentState.currentResume.skills,
          isArray: Array.isArray(skills)
        });
        
        // Ensure skills is always an array
        const skillsArray = Array.isArray(skills) ? skills : [];
        
        // Clean the skills array: trim whitespace, remove empty entries, remove duplicates
        const cleanSkills = skillsArray
          .map(skill => String(skill).trim())
          .filter(Boolean)
          .filter((skill, index, arr) => arr.indexOf(skill) === index); // Remove duplicates
        
        console.log('Cleaned skills:', cleanSkills);
        
        // Only update if there are actual changes
        if (JSON.stringify(currentState.currentResume.skills) === JSON.stringify(cleanSkills)) {
          console.log('No changes detected, skipping update');
          return;
        }
        
        console.log('Updating skills in store');
        set((state) => ({
          currentResume: { ...state.currentResume, skills: cleanSkills },
          undoStack: [...currentState.undoStack.slice(-10), currentState.currentResume],
          redoStack: []
        }));
        get().saveToCurrentVersion();
      },

      parseSkillsFromString: (skillsString: string) => {
        return skillsString
          .split(',')
          .map(skill => skill.trim())
          .filter(Boolean)
          .filter((skill, index, arr) => arr.indexOf(skill) === index); // Remove duplicates
      },

      updateExperience: (experience) => {
        const currentState = get();
        set((state) => ({
          currentResume: { ...state.currentResume, experience },
          undoStack: [...currentState.undoStack, currentState.currentResume],
          redoStack: []
        }));
        get().saveToCurrentVersion();
      },

      updateProjects: (projects) => {
        const currentState = get();
        console.log('updateProjects called:', { 
          incomingProjects: projects, 
          currentProjects: currentState.currentResume.projects,
          isArray: Array.isArray(projects)
        });
        
        set((state) => ({
          currentResume: { ...state.currentResume, projects },
          undoStack: [...currentState.undoStack, currentState.currentResume],
          redoStack: []
        }));
        get().saveToCurrentVersion();
      },

      updateEducation: (education) => {
        const currentState = get();
        set((state) => ({
          currentResume: { ...state.currentResume, education },
          undoStack: [...currentState.undoStack, currentState.currentResume],
          redoStack: []
        }));
        get().saveToCurrentVersion();
      },

      updateAwards: (awards) => {
        const currentState = get();
        set((state) => ({
          currentResume: { ...state.currentResume, awards },
          undoStack: [...currentState.undoStack, currentState.currentResume],
          redoStack: []
        }));
        get().saveToCurrentVersion();
      },

      toggleSection: (sectionId) => {
        set((state) => ({
          sections: state.sections.map(section =>
            section.id === sectionId
              ? { ...section, enabled: !section.enabled }
              : section
          )
        }));
      },

      reorderSections: (fromIndex, toIndex) => {
        set((state) => {
          const newSections = [...state.sections];
          const [movedSection] = newSections.splice(fromIndex, 1);
          newSections.splice(toIndex, 0, movedSection);
          
          // Update order numbers
          return {
            sections: newSections.map((section, index) => ({
              ...section,
              order: index
            }))
          };
        });
      },

      createVersion: (name) => {
        const newVersion: ResumeVersion = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          data: get().currentResume,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set((state) => ({
          versions: [...state.versions, newVersion],
          currentVersionId: newVersion.id
        }));
      },

      switchVersion: (versionId) => {
        const version = get().versions.find(v => v.id === versionId);
        if (version) {
          set({
            currentResume: version.data,
            currentVersionId: versionId
          });
        }
      },

      deleteVersion: (versionId) => {
        set((state) => {
          // Prevent deleting the last remaining version
          if (state.versions.length <= 1) {
            console.warn('Cannot delete the last remaining version');
            return state;
          }

          // Prevent deleting the default version
          if (versionId === 'default') {
            console.warn('Cannot delete the default version');
            return state;
          }

          const newVersions = state.versions.filter(v => v.id !== versionId);
          
          // If we're deleting the current version, switch to another one
          let newCurrentVersionId = state.currentVersionId;
          if (state.currentVersionId === versionId) {
            // Find the first available version that's not the one being deleted
            const availableVersion = newVersions.find(v => v.id !== versionId);
            newCurrentVersionId = availableVersion?.id || 'default';
          }

          return {
            versions: newVersions,
            currentVersionId: newCurrentVersionId,
            currentResume: newVersions.find(v => v.id === newCurrentVersionId)?.data || state.currentResume
          };
        });
      },

      cloneVersion: (versionId, newName) => {
        const originalVersion = get().versions.find(v => v.id === versionId);
        if (originalVersion) {
          const clonedVersion: ResumeVersion = {
            ...originalVersion,
            id: Math.random().toString(36).substr(2, 9),
            name: newName,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          set((state) => ({
            versions: [...state.versions, clonedVersion],
            currentVersionId: clonedVersion.id
          }));
        }
      },

      enableAutoSave: (enabled) => {
        set({ autoSaveEnabled: enabled });
      },

      saveCurrentVersion: async () => {
        const { currentVersionId, versions, currentResume } = get();
        if (currentVersionId) {
          set({ isSaving: true });
          
          // Simulate save delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({
            versions: versions.map(v =>
              v.id === currentVersionId
                ? { ...v, data: currentResume, updatedAt: new Date() }
                : v
            ),
            lastSaved: new Date(),
            isSaving: false
          });
        }
      },

      undo: () => {
        const { undoStack, redoStack, currentResume } = get();
        if (undoStack.length > 0) {
          const previousState = undoStack[undoStack.length - 1];
          const newUndoStack = undoStack.slice(0, -1);
          
          set({
            currentResume: previousState,
            undoStack: newUndoStack,
            redoStack: [currentResume, ...redoStack]
          });
        }
      },

      redo: () => {
        const { redoStack, undoStack, currentResume } = get();
        if (redoStack.length > 0) {
          const nextState = redoStack[0];
          const newRedoStack = redoStack.slice(1);
          
          set({
            currentResume: nextState,
            redoStack: newRedoStack,
            undoStack: [...undoStack, currentResume]
          });
        }
      },

      canUndo: () => {
        return get().undoStack.length > 0;
      },

      canRedo: () => {
        return get().redoStack.length > 0;
      },

      resetToDefault: () => {
        set({
          currentResume: defaultResume,
          sections: defaultSections,
          undoStack: [],
          redoStack: []
        });
      },

      saveToCurrentVersion: () => {
        const { currentVersionId, versions, currentResume } = get();
        if (currentVersionId) {
          set({
            versions: versions.map(v =>
              v.id === currentVersionId
                ? { ...v, data: currentResume, updatedAt: new Date() }
                : v
            )
          });
        }
      },

      loadSampleData: () => {
        const sampleResume: ResumeData = {
          profile: {
            name: "Alex Johnson",
            title: "Software Engineer",
            email: "alex.johnson@email.com",
            phone: "(715) 555-0123",
            location: "River Falls, WI",
            links: [
              { label: "GitHub", url: "https://github.com/alexjohnson" },
              { label: "LinkedIn", url: "https://linkedin.com/in/alexjohnson" },
              { label: "Portfolio", url: "https://alexjohnson.dev" }
            ]
          },
          summary: "Recent Computer Science graduate from University of Wisconsin-River Falls with strong foundation in software development, data structures, and algorithms. Passionate about building scalable web applications and contributing to open-source projects. Seeking opportunities to apply technical skills in a collaborative environment.",
          skills: [
            "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL", 
            "Git", "Docker", "AWS", "REST APIs", "GraphQL", "MongoDB", "PostgreSQL"
          ],
          experience: [
            {
              company: "TechStart Inc.",
              role: "Software Development Intern",
              start: "2024-06",
              end: "2024-08",
              location: "Minneapolis, MN",
              bullets: [
                {
                  text: "Developed and maintained React-based web applications, improving user experience and reducing load times by 25%",
                  metrics: { impact: 0.8 }
                },
                {
                  text: "Collaborated with cross-functional teams to implement new features and fix critical bugs in production",
                  metrics: { impact: 0.7 }
                },
                {
                  text: "Participated in code reviews and contributed to team's coding standards and best practices",
                  metrics: { impact: 0.6 }
                }
              ]
            }
          ],
          projects: [
            {
              name: "E-Commerce Platform",
              link: "https://github.com/alexjohnson/ecommerce-platform",
              stack: ["React", "Node.js", "MongoDB", "Stripe"],
              bullets: [
                "Built a full-stack e-commerce application with user authentication, product management, and payment processing",
                "Implemented responsive design using Tailwind CSS and achieved 95+ Lighthouse performance score",
                "Integrated Stripe payment gateway and implemented secure checkout flow with order tracking"
              ]
            }
          ],
          education: [
            {
              school: "University of Wisconsin-River Falls",
              degree: "Bachelor of Science in Computer Science",
              grad: "2024-05"
            }
          ],
          awards: [
            "Dean's List (2022-2024)",
            "Computer Science Department Outstanding Student Award (2024)"
          ]
        };

        set({
          currentResume: sampleResume,
          undoStack: [],
          redoStack: []
        });
      },

      autoRecover: () => {
        const state = get();
        
        // If no versions exist, create a default one
        if (state.versions.length === 0) {
          const defaultVersion: ResumeVersion = {
            id: 'default',
            name: 'Default Resume',
            data: {
              profile: { name: '', title: '', email: '', phone: '', location: '', links: [] },
              summary: '',
              skills: [],
              experience: [],
              projects: [],
              education: [],
              awards: []
            },
            createdAt: new Date(),
            updatedAt: new Date()
          };

          set({
            versions: [defaultVersion],
            currentVersionId: 'default',
            currentResume: defaultVersion.data
          });
          
          return true;
        }

        // If current version is invalid, switch to a valid one
        if (!state.versions.find(v => v.id === state.currentVersionId)) {
          const firstVersion = state.versions[0];
          set({
            currentVersionId: firstVersion.id,
            currentResume: firstVersion.data
          });
          
          return true;
        }

        return false;
      }
    }),
    {
      name: 'snapresume-storage',
      partialize: (state) => ({
        versions: state.versions,
        currentVersionId: state.currentVersionId,
        sections: state.sections,

        autoSaveEnabled: state.autoSaveEnabled,
        lastSaved: state.lastSaved
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert string dates back to Date objects after rehydration
          if (state.lastSaved && typeof state.lastSaved === 'string') {
            state.lastSaved = new Date(state.lastSaved);
          }
          
          if (state.versions) {
            state.versions = state.versions.map(version => ({
              ...version,
              createdAt: new Date(version.createdAt),
              updatedAt: new Date(version.updatedAt)
            }));
          }
        }
      },
      // Add throttling to prevent excessive localStorage writes
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Handle migration from version 0 to 1
          return persistedState;
        }
        return persistedState;
      }
    }
  )
);
