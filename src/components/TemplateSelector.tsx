import { useResumeStore } from '../store/useResumeStore';
import { TemplateType } from '../store/useResumeStore';
import { Check } from 'lucide-react';

interface TemplateOption {
  id: TemplateType;
  name: string;
  description: string;
  preview: string;
}

const templateOptions: TemplateOption[] = [
  {
    id: 'classic',
    name: 'Classic ATS',
    description: 'Traditional format optimized for Applicant Tracking Systems',
    preview: '📄'
  },
  {
    id: 'modern',
    name: 'Modern Clean',
    description: 'Minimalist design with clean typography and spacing',
    preview: '✨'
  },
  {
    id: 'twocolumn',
    name: 'Two Column',
    description: 'Skills and summary on left, experience on right',
    preview: '📋'
  }
];

export default function TemplateSelector() {
  const selectedTemplate = useResumeStore(s => s.selectedTemplate);
  const setSelectedTemplate = useResumeStore(s => s.setSelectedTemplate);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Template</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose a template that best represents your professional style
        </p>
      </div>
      
      <div className="grid gap-3">
        {templateOptions.map((template) => (
          <div
            key={template.id}
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{template.preview}</div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  {selectedTemplate === template.id && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </div>
            
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          💡 Template changes are applied instantly to your preview
        </p>
      </div>
    </div>
  );
}
