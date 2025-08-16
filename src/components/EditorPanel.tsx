import React, { useState, useCallback, useRef } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { shallow } from 'zustand/shallow';
import { useDebouncedState } from '../hooks/useDebouncedState';
import { Button } from './ui/Button';
import { Input } from '../components/ui/Input';
import { WritingAssist } from './WritingAssist';
import TemplateSelector from './TemplateSelector';
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { SectionId } from '../types/resume';

export default React.memo(function EditorPanel() {
  // Fine-grained selectors to prevent unnecessary re-renders
  const sections = useResumeStore(s => s.sections, shallow);
  const reorderSections = useResumeStore(s => s.reorderSections);
  const updateProfile = useResumeStore(s => s.updateProfile);
  const updateSummary = useResumeStore(s => s.updateSummary);
  const updateSkills = useResumeStore(s => s.updateSkills);
  const parseSkillsFromString = useResumeStore(s => s.parseSkillsFromString);
  const updateExperience = useResumeStore(s => s.updateExperience);
  const updateProjects = useResumeStore(s => s.updateProjects);
  const updateEducation = useResumeStore(s => s.updateEducation);
  const updateAwards = useResumeStore(s => s.updateAwards);
  
  // Get current resume data with fine-grained selectors
  const profile = useResumeStore(s => s.currentResume.profile, shallow);
  const summary = useResumeStore(s => s.currentResume.summary);
  const skills = useResumeStore(s => s.currentResume.skills, shallow);
  const experience = useResumeStore(s => s.currentResume.experience, shallow);
  const projects = useResumeStore(s => s.currentResume.projects, shallow);
  const education = useResumeStore(s => s.currentResume.education, shallow);
  const awards = useResumeStore(s => s.currentResume.awards, shallow);
  
  // Local state for immediate input updates
  const [localProfile, setLocalProfile] = useState(profile);
  const [localSummary, setLocalSummary] = useState(summary);
  const [localSkills, setLocalSkills] = useState(skills);
  const [localExperience, setLocalExperience] = useState(experience);
  const [localProjects, setLocalProjects] = useState(projects);
  const [localEducation, setLocalEducation] = useState(education);
  const [localAwards, setLocalAwards] = useState(awards);
  
  // Skills input state for raw comma handling
  const [skillsInput, setSkillsInput] = useState(skills.join(', '));
  
  // Debounced state for syncing to global store
  const debouncedProfile = useDebouncedState(localProfile, 300);
  const debouncedSummary = useDebouncedState(localSummary, 300);
  const debouncedSkills = useDebouncedState(localSkills, 100); // Faster sync for skills
  const debouncedExperience = useDebouncedState(localExperience, 300);
  const debouncedProjects = useDebouncedState(localProjects, 300);
  const debouncedEducation = useDebouncedState(localEducation, 300);
  const debouncedAwards = useDebouncedState(localAwards, 300);
  
  // Sync debounced local state to global store
  React.useEffect(() => {
    updateProfile(debouncedProfile);
  }, [debouncedProfile, updateProfile]);
  
  React.useEffect(() => {
    updateSummary(debouncedSummary);
  }, [debouncedSummary, updateSummary]);
  
  React.useEffect(() => {
    updateSkills(debouncedSkills);
  }, [debouncedSkills, updateSkills]);
  
  React.useEffect(() => {
    updateExperience(debouncedExperience);
  }, [debouncedExperience, updateExperience]);
  
  React.useEffect(() => {
    updateProjects(debouncedProjects);
  }, [debouncedProjects, updateProjects]);
  
  React.useEffect(() => {
    updateEducation(debouncedEducation);
  }, [debouncedEducation, updateEducation]);
  
  React.useEffect(() => {
    updateAwards(debouncedAwards);
  }, [debouncedAwards, updateAwards]);
  
  // Sync local state when global state changes (e.g., from undo/redo)
  React.useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);
  
  React.useEffect(() => {
    setLocalSummary(summary);
  }, [summary]);
  
  React.useEffect(() => {
    // Only sync if it's an external change, not from typing
    if (JSON.stringify(skills) !== JSON.stringify(localSkills)) {
      setLocalSkills(skills);
      setSkillsInput(skills.join(', '));
    }
  }, [skills, localSkills]);
  
  React.useEffect(() => {
    setLocalExperience(experience);
  }, [experience]);
  
  React.useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);
  
  React.useEffect(() => {
    setLocalEducation(education);
  }, [education]);
  
  React.useEffect(() => {
    setLocalAwards(awards);
  }, [awards]);
  
  const [expandedSections, setExpandedSections] = useState<Set<SectionId>>(new Set(['profile']));
  const [draggedSection, setDraggedSection] = useState<number | null>(null);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Detect typing to optimize performance
  const handleTypingStart = useCallback(() => {
    // Add typing class to preview for performance optimization
    document.querySelector('.resume-content')?.classList.add('typing');
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to end typing state
    typingTimeoutRef.current = setTimeout(() => {
      document.querySelector('.resume-content')?.classList.remove('typing');
    }, 1000); // 1 second after last keystroke
  }, []);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const toggleExpanded = (sectionId: SectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSection(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedSection !== null && draggedSection !== dropIndex) {
      reorderSections(draggedSection, dropIndex);
    }
    setDraggedSection(null);
  };

  // Keyboard navigation for section reordering
  const moveSection = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex >= 0 && toIndex < sections.length) {
      reorderSections(fromIndex, toIndex);
    }
  };

  const renderProfileSection = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <Input
          id="name"
          placeholder="e.g., Alex Johnson"
          value={localProfile.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleTypingStart();
            setLocalProfile({ ...localProfile, name: e.target.value });
          }}
          aria-describedby="name-help"
        />
        <p id="name-help" className="text-xs text-gray-500">
          Enter your full legal name as it appears on official documents
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          Professional Title *
        </label>
        <Input
          id="title"
          placeholder="e.g., Software Engineer, Data Scientist"
          value={localProfile.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalProfile({ ...localProfile, title: e.target.value })}
          aria-describedby="title-help"
        />
        <p id="title-help" className="text-xs text-gray-500">
          Your current or desired job title
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address *
        </label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={localProfile.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalProfile({ ...localProfile, email: e.target.value })}
          aria-describedby="email-help"
        />
        <p id="email-help" className="text-xs text-gray-500">
          Use a professional email address
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <Input
          id="phone"
          placeholder="(555) 123-4567"
          value={localProfile.phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalProfile({ ...localProfile, phone: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="location" className="text-sm font-medium text-gray-700">
          Location
        </label>
        <Input
          id="location"
          placeholder="City, State or City, Country"
          value={localProfile.location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalProfile({ ...localProfile, location: e.target.value })}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Professional Links</label>
        {localProfile.links.map((link, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Label (e.g., GitHub)"
              value={link.label}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newLinks = [...localProfile.links];
                newLinks[index] = { ...link, label: e.target.value };
                setLocalProfile({ ...localProfile, links: newLinks });
              }}
              aria-label={`Link ${index + 1} label`}
            />
            <Input
              placeholder="URL"
              value={link.url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newLinks = [...localProfile.links];
                newLinks[index] = { ...link, url: e.target.value };
                setLocalProfile({ ...localProfile, links: newLinks });
              }}
              aria-label={`Link ${index + 1} URL`}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newLinks = localProfile.links.filter((_, i) => i !== index);
                setLocalProfile({ ...localProfile, links: newLinks });
              }}
              aria-label={`Remove link ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newLinks = [...localProfile.links, { label: '', url: '' }];
            setLocalProfile({ ...localProfile, links: newLinks });
          }}
          aria-label="Add new professional link"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>
    </div>
  );

  const renderSummarySection = () => (
    <div className="space-y-2">
      <label htmlFor="summary" className="text-sm font-medium text-gray-700">
        Professional Summary *
      </label>
      <textarea
        id="summary"
        placeholder="Write a compelling 2-3 sentence summary of your professional background, key skills, and career goals..."
        value={localSummary}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLocalSummary(e.target.value)}
        className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-describedby="summary-help"
      />
      <p id="summary-help" className="text-xs text-gray-500">
        Keep it concise and highlight what makes you unique
      </p>
    </div>
  );

  const renderSkillsSection = () => {
    return (
      <div className="space-y-2">
        <label htmlFor="skills" className="text-sm font-medium text-gray-700">
          Technical Skills *
        </label>
        <input
          id="skills"
          type="text"
          placeholder="Enter skills separated by commas (e.g., JavaScript, React, Python, SQL)"
          value={skillsInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;
            setSkillsInput(inputValue); // Update raw input immediately
            
            // Parse skills immediately and update both local and global state
            // This ensures the preview updates in real-time
            const parsedSkills = parseSkillsFromString(inputValue);
            console.log('Skills input change:', { inputValue, parsedSkills });
            
            setLocalSkills(parsedSkills);
            
            // Also update the global store immediately for preview
            updateSkills(parsedSkills);
          }}
          onBlur={() => {
            // Parse skills only when user leaves the field
            const finalSkills = parseSkillsFromString(skillsInput);
            setLocalSkills(finalSkills);
            setSkillsInput(finalSkills.join(', '));
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            // Allow all keys to pass through normally
            // Only handle Enter key for finalizing skills
            if (e.key === 'Enter') {
              e.preventDefault();
              const inputValue = e.currentTarget.value;
              const parsedSkills = parseSkillsFromString(inputValue);
              
              setLocalSkills(parsedSkills);
              setSkillsInput(parsedSkills.join(', '));
            }
            // All other keys (including comma) will work normally
          }}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-describedby="skills-help"
        />
        <p id="skills-help" className="text-xs text-gray-500">
          Separate skills with commas. Press Enter to finalize. Duplicates are automatically removed.
        </p>
        
        {/* Live preview of parsed skills */}
        {localSkills.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-2">Preview:</p>
            <div className="flex flex-wrap gap-1">
              {localSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderExperienceSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
        <Button
          variant="outline"
          onClick={() => {
            const newExp = [...localExperience, {
              company: '',
              role: '',
              start: '',
              end: '',
              location: '',
              bullets: [{ text: '' }]
            }];
            setLocalExperience(newExp);
          }}
          aria-label="Add new work experience"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {localExperience.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started</p>
        </div>
      ) : (
        localExperience.map((exp, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Company"
                value={exp.company}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newExp = [...localExperience];
                  newExp[index] = { ...exp, company: e.target.value };
                  setLocalExperience(newExp);
                }}
                aria-label={`Company name for experience ${index + 1}`}
              />
              <Input
                placeholder="Role/Position"
                value={exp.role}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newExp = [...localExperience];
                  newExp[index] = { ...exp, role: e.target.value };
                  setLocalExperience(newExp);
                }}
                aria-label={`Job role for experience ${index + 1}`}
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="month"
                value={exp.start}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newExp = [...localExperience];
                  newExp[index] = { ...exp, start: e.target.value };
                  setLocalExperience(newExp);
                }}
                aria-label={`Start date for experience ${index + 1}`}
              />
              <Input
                type="month"
                value={exp.end}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newExp = [...localExperience];
                  newExp[index] = { ...exp, end: e.target.value };
                  setLocalExperience(newExp);
                }}
                aria-label={`End date for experience ${index + 1}`}
              />
              <Input
                placeholder="Location"
                value={exp.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newExp = [...localExperience];
                  newExp[index] = { ...exp, location: e.target.value };
                  setLocalExperience(newExp);
                }}
                aria-label={`Location for experience ${index + 1}`}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Achievements & Responsibilities</label>
              <WritingAssist
                onActionVerbSelect={(verb) => {
                  const newExp = [...localExperience];
                  const newBullets = [...exp.bullets];
                  if (newBullets.length > 0) {
                    newBullets[0] = { ...newBullets[0], text: verb + ' ' + newBullets[0].text };
                    newExp[index] = { ...exp, bullets: newBullets };
                    setLocalExperience(newExp);
                  }
                }}
                onMetricSelect={(metric) => {
                  const newExp = [...localExperience];
                  const newBullets = [...exp.bullets];
                  if (newBullets.length > 0) {
                    newBullets[0] = { ...newBullets[0], text: newBullets[0].text + ' by ' + metric };
                    newExp[index] = { ...exp, bullets: newBullets };
                    setLocalExperience(newExp);
                  }
                }}
              />
              
              {exp.bullets.map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex gap-2">
                  <textarea
                    placeholder="Describe your achievement or responsibility..."
                    value={bullet.text}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      const newExp = [...localExperience];
                      const newBullets = [...exp.bullets];
                      newBullets[bulletIndex] = { ...bullet, text: e.target.value };
                      newExp[index] = { ...exp, bullets: newBullets };
                      setLocalExperience(newExp);
                    }}
                    className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={`Bullet point ${bulletIndex + 1} for experience ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newExp = [...localExperience];
                      const newBullets = exp.bullets.filter((_, i) => i !== bulletIndex);
                      newExp[index] = { ...exp, bullets: newBullets };
                      setLocalExperience(newExp);
                    }}
                    aria-label={`Remove bullet point ${bulletIndex + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newExp = [...localExperience];
                  const newBullets = [...exp.bullets, { text: '' }];
                  newExp[index] = { ...exp, bullets: newBullets };
                  setLocalExperience(newExp);
                }}
                aria-label="Add new bullet point"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Bullet Point
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newExp = localExperience.filter((_, i) => i !== index);
                setLocalExperience(newExp);
              }}
              className="w-full"
              aria-label={`Remove experience ${index + 1}`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Experience
            </Button>
          </div>
        ))
      )}
    </div>
  );

  const renderProjectsSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Projects</h3>
        <Button
          variant="outline"
          onClick={() => {
            const newProjects = [...localProjects, {
              name: '',
              link: '',
              stack: [],
              bullets: ['']
            }];
            setLocalProjects(newProjects);
            
            // Sync to global store immediately for real-time preview
            updateProjects(newProjects);
          }}
          aria-label="Add new project"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {localProjects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No projects added yet.</p>
          <p className="text-sm">Click "Add Project" to showcase your work</p>
        </div>
      ) : (
        localProjects.map((project, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <Input
              placeholder="Project Name"
              value={project.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newProjects = [...localProjects];
                newProjects[index] = { ...project, name: e.target.value };
                setLocalProjects(newProjects);
                
                // Sync to global store immediately for real-time preview
                updateProjects(newProjects);
              }}
              aria-label={`Project name for project ${index + 1}`}
            />
            <Input
              placeholder="Project Link (GitHub, live demo, etc.)"
              value={project.link}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newProjects = [...localProjects];
                newProjects[index] = { ...project, link: e.target.value };
                setLocalProjects(newProjects);
                
                // Sync to global store immediately for real-time preview
                updateProjects(newProjects);
              }}
              aria-label={`Project link for project ${index + 1}`}
            />
            <Input
              placeholder="Tech Stack (comma separated)"
              value={project.stackInput || project.stack.join(', ')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const inputValue = e.target.value;
                
                // Update the raw input value immediately (allows commas to be typed)
                const newProjects = [...localProjects];
                newProjects[index] = { 
                  ...project, 
                  stackInput: inputValue // Store raw input separately
                };
                setLocalProjects(newProjects);
                
                // Parse skills only when user leaves the field or presses Enter
                // This allows commas to be typed normally
              }}
              onBlur={() => {
                // Parse skills when user leaves the field
                const inputValue = project.stackInput || project.stack.join(', ');
                const parsedStack = inputValue.split(',').map((s: string) => s.trim()).filter(Boolean);
                
                const newProjects = [...localProjects];
                newProjects[index] = { 
                  ...project, 
                  stack: parsedStack,
                  stackInput: undefined // Clear raw input after parsing
                };
                setLocalProjects(newProjects);
                
                // Sync to global store
                updateProjects(newProjects);
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                // Parse skills when Enter is pressed
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const inputValue = e.currentTarget.value;
                  const parsedStack = inputValue.split(',').map((s: string) => s.trim()).filter(Boolean);
                  
                  const newProjects = [...localProjects];
                  newProjects[index] = { 
                    ...project, 
                    stack: parsedStack,
                    stackInput: undefined // Clear raw input after parsing
                  };
                  setLocalProjects(newProjects);
                  
                  // Sync to global store
                  updateProjects(newProjects);
                }
              }}
              aria-label={`Tech stack for project ${index + 1}`}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Project Description</label>
              {project.bullets.map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex gap-2">
                  <textarea
                    placeholder="Describe what you built and what you learned..."
                    value={bullet}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      const newProjects = [...localProjects];
                      const newBullets = [...project.bullets];
                      newBullets[bulletIndex] = e.target.value;
                      newProjects[index] = { ...project, bullets: newBullets };
                      setLocalProjects(newProjects);
                      
                      // Sync to global store immediately for real-time preview
                      updateProjects(newProjects);
                    }}
                    className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={`Description ${bulletIndex + 1} for project ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newProjects = [...localProjects];
                      const newBullets = project.bullets.filter((_, i) => i !== bulletIndex);
                      newProjects[index] = { ...project, bullets: newBullets };
                      setLocalProjects(newProjects);
                      
                      // Sync to global store immediately for real-time preview
                      updateProjects(newProjects);
                    }}
                    aria-label={`Remove description ${bulletIndex + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newProjects = [...localProjects];
                  const newBullets = [...project.bullets, ''];
                  newProjects[index] = { ...project, bullets: newBullets };
                  setLocalProjects(newProjects);
                  
                  // Sync to global store immediately for real-time preview
                  updateProjects(newProjects);
                }}
                aria-label="Add new project description"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Description
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newProjects = localProjects.filter((_, i) => i !== index);
                setLocalProjects(newProjects);
                
                // Sync to global store immediately for real-time preview
                updateProjects(newProjects);
              }}
              className="w-full"
              aria-label={`Remove project ${index + 1}`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Project
            </Button>
          </div>
        ))
      )}
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Education</h3>
        <Button
          variant="outline"
          onClick={() => {
            const newEdu = [...localEducation, {
              school: '',
              degree: '',
              grad: ''
            }];
            setLocalEducation(newEdu);
          }}
          aria-label="Add new education entry"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {localEducation.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No education added yet.</p>
          <p className="text-sm">Click "Add Education" to include your academic background</p>
        </div>
      ) : (
        localEducation.map((edu, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <Input
              placeholder="School/University"
              value={edu.school}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newEdu = [...localEducation];
                newEdu[index] = { ...edu, school: e.target.value };
                setLocalEducation(newEdu);
              }}
              aria-label={`School name for education ${index + 1}`}
            />
            <Input
              placeholder="Degree (e.g., Bachelor of Science in Computer Science)"
              value={edu.degree}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newEdu = [...localEducation];
                newEdu[index] = { ...edu, degree: e.target.value };
                setLocalEducation(newEdu);
              }}
              aria-label={`Degree for education ${index + 1}`}
            />
            <Input
              type="month"
              value={edu.grad}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newEdu = [...localEducation];
                newEdu[index] = { ...edu, grad: e.target.value };
                setLocalEducation(newEdu);
              }}
              aria-label={`Graduation date for education ${index + 1}`}
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newEdu = localEducation.filter((_, i) => i !== index);
                setLocalEducation(newEdu);
              }}
              className="w-full"
              aria-label={`Remove education ${index + 1}`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Education
            </Button>
          </div>
        ))
      )}
    </div>
  );

  const renderAwardsSection = () => (
    <div className="space-y-2">
      <label htmlFor="awards" className="text-sm font-medium text-gray-700">
        Awards & Achievements
      </label>
      <textarea
        id="awards"
        placeholder="Enter each award or achievement on a new line..."
        value={localAwards.join('\n')}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const awards = e.target.value.split('\n').map(a => a.trim()).filter(Boolean);
          setLocalAwards(awards);
        }}
        className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-describedby="awards-help"
      />
      <p id="awards-help" className="text-xs text-gray-500">
        Enter each award on a new line. Include academic honors, certifications, and professional recognition.
      </p>
    </div>
  );

  const renderSectionContent = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'profile':
        return renderProfileSection();
      case 'summary':
        return renderSummarySection();
      case 'skills':
        return renderSkillsSection();
      case 'experience':
        return renderExperienceSection();
      case 'projects':
        return renderProjectsSection();
      case 'education':
        return renderEducationSection();
      case 'awards':
        return renderAwardsSection();
      default:
        return null;
    }
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="p-6">
      <header className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Edit Resume</h2>
        <p className="text-sm text-gray-600 mt-1">
          Customize your resume by editing sections below. Use the drag handles to reorder sections.
        </p>
        
        {/* Template Selector */}
        <div className="mt-6">
          <TemplateSelector />
        </div>
      </header>
      
      <div className="space-y-4">
        {sortedSections.map((section, index) => (
          <div
            key={section.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 ${
              draggedSection === index ? 'opacity-50 scale-95' : ''
            }`}
            role="region"
            aria-label={`${section.label} section`}
          >
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div 
                  className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
                  role="button"
                  tabIndex={0}
                  aria-label={`Drag to reorder ${section.label} section`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // Focus management for keyboard users
                    }
                  }}
                >
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900">{section.label}</h3>
                
                {/* Keyboard navigation for reordering */}
                <div className="flex gap-1 ml-2">
                  <button
                    type="button"
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`Move ${section.label} section up`}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(index, 'down')}
                    disabled={index === sections.length - 1}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`Move ${section.label} section down`}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(section.id)}
                  aria-label={`${expandedSections.has(section.id) ? 'Collapse' : 'Expand'} ${section.label} section`}
                  aria-expanded={expandedSections.has(section.id)}
                >
                  {expandedSections.has(section.id) ? '−' : '+'}
                </Button>
              </div>
            </div>
            
            {expandedSections.has(section.id) && (
              <div className="p-4">
                {renderSectionContent(section.id)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
