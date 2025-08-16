import React, { useMemo } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { shallow } from 'zustand/shallow';
import { formatDate } from '../../lib/utils';
import { SectionConfig } from '../../types/resume';

interface ModernTemplateProps {
  sections: SectionConfig[];
}

const ModernTemplate = React.memo(function ModernTemplate({ sections }: ModernTemplateProps) {
  // Fine-grained selectors for each data slice to prevent unnecessary re-renders
  const profile = useResumeStore(s => s.currentResume.profile, shallow);
  const summary = useResumeStore(s => s.currentResume.summary);
  const skills = useResumeStore(s => s.currentResume.skills, shallow);
  const experience = useResumeStore(s => s.currentResume.experience, shallow);
  const projects = useResumeStore(s => s.currentResume.projects, shallow);
  const education = useResumeStore(s => s.currentResume.education, shallow);
  const awards = useResumeStore(s => s.currentResume.awards, shallow);

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

  return (
    <div className="resume-content p-8 max-w-4xl mx-auto bg-white font-sans">
      {sections.map((section) => (
        <div key={section.id}>
          {renderSection(section)}
        </div>
      ))}
    </div>
  );
});

// Individual memoized section components with modern styling
const ProfileSection = React.memo(function ProfileSection({ profile }: { profile: any }) {
  return (
    <div className="text-left border-b border-gray-200 pb-6 mb-8">
      <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-tight">
        {profile.name || 'Your Name'}
      </h1>
      <p className="text-xl text-gray-600 mb-4 font-normal">
        {profile.title || 'Professional Title'}
      </p>
      
      <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-4">
        {profile.email && (
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            {profile.email}
          </span>
        )}
        {profile.phone && (
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            {profile.phone}
          </span>
        )}
        {profile.location && (
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            {profile.location}
          </span>
        )}
      </div>
      
      {profile.links.length > 0 && profile.links.some((l: any) => l.url) && (
        <div className="flex flex-wrap gap-4">
          {profile.links
            .filter((link: any) => link.url && link.label)
            .map((link: any, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
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
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2 inline-block">
        Summary
      </h2>
      <p className="text-gray-700 leading-relaxed text-sm">
        {summary}
      </p>
    </div>
  );
});

const SkillsSection = React.memo(function SkillsSection({ skills }: { skills: string[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2 inline-block">
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200"
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
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2 inline-block">
        Experience
      </h2>
      <div className="space-y-6">
        {experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">{exp.role}</h3>
                <p className="text-gray-600 font-medium text-sm">{exp.company}</p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <p>{formatDate(exp.start)} - {exp.end ? formatDate(exp.end) : 'Present'}</p>
                {exp.location && <p>{exp.location}</p>}
              </div>
            </div>
            <ul className="list-none space-y-1 text-gray-700">
              {exp.bullets.map((bullet: any, bulletIndex: number) => (
                <li key={bulletIndex} className="text-sm leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{bullet.text}</span>
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
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2 inline-block">
        Projects
      </h2>
      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="project-item">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 text-base">
                {project.name}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 ml-2 text-xs underline"
                  >
                    (View)
                  </a>
                )}
              </h3>
            </div>
            {project.stack.length > 0 && (
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-medium">Tech:</span> {project.stack.join(', ')}
              </p>
            )}
            <ul className="list-none space-y-1 text-gray-700">
              {project.bullets.map((bullet: string, bulletIndex: number) => (
                <li key={bulletIndex} className="text-sm leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{bullet}</span>
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
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2 inline-block">
        Education
      </h2>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="education-item">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">{edu.degree}</h3>
                <p className="text-gray-600 text-sm">{edu.school}</p>
              </div>
              <p className="text-gray-500 text-xs">
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
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2 inline-block">
        Awards
      </h2>
      <ul className="list-none space-y-1 text-gray-700">
        {awards.map((award, index) => (
          <li key={index} className="text-sm leading-relaxed flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
            <span>{award}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default ModernTemplate;
