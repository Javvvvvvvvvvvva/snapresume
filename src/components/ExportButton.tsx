import { useRef } from 'react';
import { Button } from './ui/Button';
import { Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { ResumeData } from '../types/resume';

interface ExportButtonProps {
  data: ResumeData;
  className?: string;
}

export default function ExportButton({ data, className }: ExportButtonProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!printRef.current) return;

    const opt = {
      margin: 0.5,
      filename: `${data.profile.name || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(printRef.current).save();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <>
      <Button onClick={handleExportPDF} className={className}>
        <Download className="h-4 w-4 mr-2" />
        Export PDF
      </Button>
      
      {/* Hidden div for PDF generation */}
      <div ref={printRef} className="hidden">
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-sans">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {data.profile.name || 'Your Name'}
            </h1>
            <p className="text-xl text-gray-700 mb-3">
              {data.profile.title || 'Professional Title'}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              {data.profile.email && <span>{data.profile.email}</span>}
              {data.profile.phone && <span>{data.profile.phone}</span>}
              {data.profile.location && <span>{data.profile.location}</span>}
            </div>
            
            {data.profile.links.length > 0 && data.profile.links.some(l => l.url) && (
              <div className="flex flex-wrap justify-center gap-4 mt-3">
                {data.profile.links
                  .filter(link => link.url && link.label)
                  .map((link, index) => (
                    <span key={index} className="text-blue-600">
                      {link.label}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {data.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{exp.role}</h3>
                        <p className="text-gray-700 font-medium">{exp.company}</p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{exp.start} - {exp.end || 'Present'}</p>
                        {exp.location && <p>{exp.location}</p>}
                      </div>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="text-sm leading-relaxed">
                          {bullet.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                Projects
              </h2>
              <div className="space-y-4">
                {data.projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-gray-900 mb-2">{project.name}</h3>
                    {project.stack.length > 0 && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Tech Stack:</span> {project.stack.join(', ')}
                      </p>
                    )}
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {project.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="text-sm leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-700">{edu.school}</p>
                      </div>
                      <p className="text-gray-600 text-sm">{edu.grad}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {data.awards.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                Awards & Achievements
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {data.awards.map((award, index) => (
                  <li key={index} className="text-sm leading-relaxed">
                    {award}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
