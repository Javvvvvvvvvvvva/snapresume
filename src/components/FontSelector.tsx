import { useResumeStore } from '../store/useResumeStore';
import { FontFamily } from '../store/useResumeStore';
import { Check, Type } from 'lucide-react';

interface FontOption {
  id: FontFamily;
  name: string;
  description: string;
  preview: string;
  fontClass: string;
}

const fontOptions: FontOption[] = [
  {
    id: 'inter',
    name: 'Inter',
    description: 'Modern, clean sans-serif',
    preview: 'Aa',
    fontClass: 'font-inter'
  },
  {
    id: 'roboto',
    name: 'Roboto',
    description: 'Google\'s friendly sans-serif',
    preview: 'Aa',
    fontClass: 'font-roboto'
  },
  {
    id: 'georgia',
    name: 'Georgia',
    description: 'Elegant serif for traditional look',
    preview: 'Aa',
    fontClass: 'font-georgia'
  },
  {
    id: 'times',
    name: 'Times New Roman',
    description: 'Classic serif font',
    preview: 'Aa',
    fontClass: 'font-times'
  },
  {
    id: 'arial',
    name: 'Arial',
    description: 'Clean, readable sans-serif',
    preview: 'Aa',
    fontClass: 'font-arial'
  },
  {
    id: 'helvetica',
    name: 'Helvetica',
    description: 'Professional sans-serif',
    preview: 'Aa',
    fontClass: 'font-helvetica'
  }
];

export default function FontSelector() {
  const selectedFont = useResumeStore(s => s.selectedFont);
  const setSelectedFont = useResumeStore(s => s.setSelectedFont);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Font Style</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose a font that matches your professional style
        </p>
      </div>
      
      <div className="grid gap-3">
        {fontOptions.map((font) => (
          <div
            key={font.id}
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedFont === font.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedFont(font.id)}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                <Type className="h-6 w-6 text-gray-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-medium text-gray-900 ${font.fontClass}`}>
                    {font.name}
                  </h4>
                  {selectedFont === font.id && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{font.description}</p>
                <div className={`text-lg ${font.fontClass} text-gray-700`}>
                  {font.preview}
                </div>
              </div>
            </div>
            
            {selectedFont === font.id && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          💡 Font changes are applied instantly to your preview
        </p>
      </div>
    </div>
  );
}
