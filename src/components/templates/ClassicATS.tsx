import React, { useMemo } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { shallow } from 'zustand/shallow';
import { formatDate } from '../../lib/utils';
import { SectionConfig } from '../../types/resume';

interface ClassicATSProps {
  sections: SectionConfig[];
}

const ClassicATS = React.memo(function ClassicATS({ sections }: ClassicATSProps) {
  // Fine-grained selectors for each data slice to prevent unnecessary re-renders
  const profile = useResumeStore(s => s.currentResume.profile, shallow);
  const summary = useResumeStore(s => s.currentResume.summary);
  const skills = useResumeStore(s => s.currentResume.skills, shallow);
  const experience = useResumeStore(s => s.currentResume.experience, shallow);
  const projects = useResumeStore(s => s.currentResume.projects, shallow);
  const education = useResumeStore(s => s.currentResume.education, shallow);
  const awards = useResumeStore(s => s.currentResume.awards, shallow);
  const selectedFont = useResumeStore(s => s.selectedFont);

  // Memoize the renderSection function to prevent recreation on every render
  const renderSection = useMemo(() => (section: SectionConfig) => {
    if (!section.enabled) return null;

    switch (section.id) {
      case 'profile':
        return <ProfileSection profile={profile} />;
      case 'summary':
        if (!summary) return null;
        return <SummarySection summary={summary} />;
      case 'skills':
        if (!skills.length) return null;
        return <SkillsSection skills={skills} />;
      case 'experience':
        if (!experience.length) return null;
        return <ExperienceSection experience={experience} />;
      case 'projects':
        if (!projects.length) return null;
        return <ProjectsSection projects={projects} />;
      case 'education':
        if (!education.length) return null;
        return <EducationSection education={education} />;
      case 'awards':
        if (!awards.length) return null;
        return <AwardsSection awards={awards} />;
      default:
        return null;
    }
  }, [profile, summary, skills, experience, projects, education, awards]);

  // Get font class based on selected font
  const fontClass = `font-${selectedFont}`;

  return (
    <div className={`resume-content p-6 max-w-4xl mx-auto bg-white ${fontClass}`}>
      {sections.map((section) => (
        <div key={section.id}>
          {renderSection(section)}
        </div>
      ))}
    </div>
  );
});

// Individual memoized section components to prevent unnecessary re-renders
const ProfileSection = React.memo(function ProfileSection({ profile }: { profile: any }) {
  return (
    <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {profile.name || 'Your Name'}
      </h1>
      <p className="text-xl text-gray-700 mb-3">
        {profile.title || 'Professional Title'}
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
        {profile.email && (
          <span>{profile.email}</span>
        )}
        {profile.phone && (
          <span>{profile.phone}</span>
        )}
        {profile.location && (
          <span>{profile.location}</span>
        )}
      </div>
      
      {profile.links.length > 0 && profile.links.some((l: any) => l.url) && (
        <div className="flex flex-wrap justify-center gap-4 mt-3">
          {profile.links
            .filter((link: any) => link.url && link.label)
            .map((link: any, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {link.label}
              </a>
            ))}
        </div>
      )}
    </div>
  );
});

const SummarySection = React.memo(function SummarySection({ summary }: { summary: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
        Professional Summary
      </h2>
      <p className="text-gray-700 leading-relaxed">
        {summary}
      </p>
    </div>
  );
});

const SkillsSection = React.memo(function SkillsSection({ skills }: { skills: string[] }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
        Technical Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
});

const ExperienceSection = React.memo(function ExperienceSection({ experience }: { experience: any[] }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
        Professional Experience
      </h2>
      <div className="space-y-4">
        {experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-gray-900">{exp.role}</h3>
                <p className="text-gray-700 font-medium">{exp.company}</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>{formatDate(exp.start)} - {exp.end ? formatDate(exp.end) : 'Present'}</p>
                {exp.location && <p>{exp.location}</p>}
              </div>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {exp.bullets.map((bullet: any, bulletIndex: number) => (
                <li key={bulletIndex} className="text-sm leading-relaxed">
                  {bullet.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
});

const ProjectsSection = React.memo(function ProjectsSection({ projects }: { projects: any[] }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
        Projects
      </h2>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="project-item">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900">
                {project.name}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 ml-2 text-sm underline"
                  >
                    (View Project)
                  </a>
                )}
              </h3>
            </div>
            {project.stack.length > 0 && (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Tech Stack:</span> {project.stack.join(', ')}
              </p>
            )}
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {project.bullets.map((bullet: string, bulletIndex: number) => (
                <li key={bulletIndex} className="text-sm leading-relaxed">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
});

const EducationSection = React.memo(function EducationSection({ education }: { education: any[] }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
        Education
      </h2>
      <div className="space-y-3">
        {education.map((edu, index) => (
          <div key={index} className="education-item">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-700">{edu.school}</p>
              </div>
              <p className="text-gray-600 text-sm">
                {formatDate(edu.grad)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const AwardsSection = React.memo(function AwardsSection({ awards }: { awards: string[] }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
        Awards & Achievements
      </h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        {awards.map((award, index) => (
          <li key={index} className="text-sm leading-relaxed">
            {award}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default ClassicATS;
