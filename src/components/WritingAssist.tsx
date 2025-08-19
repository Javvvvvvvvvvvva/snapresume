import React from 'react';

import { ChevronDown, Lightbulb } from 'lucide-react';

interface WritingAssistProps {
  onActionVerbSelect: (verb: string) => void;
  onMetricSelect: (metric: string) => void;
  className?: string;
}

const actionVerbs = [
  'Achieved', 'Improved', 'Reduced', 'Increased', 'Developed', 'Implemented',
  'Managed', 'Led', 'Created', 'Designed', 'Built', 'Optimized', 'Streamlined',
  'Enhanced', 'Established', 'Coordinated', 'Delivered', 'Generated', 'Maintained'
];

const metrics = [
  '25%', '50%', '100%', '2x', '3x', '10x', '$10K', '$50K', '$100K',
  '1000+ users', '500+ customers', '24/7', '99.9%', '5 minutes', '1 hour'
];

export function WritingAssist({ onActionVerbSelect, onMetricSelect, className }: WritingAssistProps) {
  const [showActionVerbs, setShowActionVerbs] = React.useState(false);
  const [showMetrics, setShowMetrics] = React.useState(false);

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowActionVerbs(!showActionVerbs)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Select action verb"
            aria-expanded={showActionVerbs}
            aria-haspopup="listbox"
          >
            <Lightbulb className="h-4 w-4" />
            Action Verbs
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {showActionVerbs && (
            <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 mb-2 px-2">Choose an action verb:</div>
                <div className="grid grid-cols-2 gap-1">
                  {actionVerbs.map((verb) => (
                    <button
                      key={verb}
                      type="button"
                      onClick={() => {
                        onActionVerbSelect(verb);
                        setShowActionVerbs(false);
                      }}
                      className="text-left px-2 py-1 text-sm hover:bg-blue-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                      {verb}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMetrics(!showMetrics)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Select metric"
            aria-expanded={showMetrics}
            aria-haspopup="listbox"
          >
            <Lightbulb className="h-4 w-4" />
            Metrics
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {showMetrics && (
            <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 mb-2 px-2">Choose a metric:</div>
                <div className="grid grid-cols-1 gap-1">
                  {metrics.map((metric) => (
                    <button
                      key={metric}
                      type="button"
                      onClick={() => {
                        onMetricSelect(metric);
                        setShowMetrics(false);
                      }}
                      className="text-left px-2 py-1 text-sm hover:bg-green-50 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                    >
                      {metric}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
        <div className="font-medium mb-1">💡 Writing Tips:</div>
        <ul className="space-y-1">
          <li>• Start bullet points with strong action verbs</li>
          <li>• Include specific numbers and metrics when possible</li>
          <li>• Focus on achievements, not just responsibilities</li>
          <li>• Use present tense for current roles, past tense for previous</li>
        </ul>
      </div>
    </div>
  );
}
