import React, { useRef, useMemo, useCallback } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { shallow } from 'zustand/shallow';
import ClassicATS from './templates/ClassicATS';
import { Button } from './ui/Button';
import { Download, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';

export default React.memo(function PreviewPanel() {
  // Fine-grained selectors to prevent unnecessary re-renders
  const currentResume = useResumeStore(s => s.currentResume, shallow);
  const sections = useResumeStore(s => s.sections, shallow);
  const printRef = useRef<HTMLDivElement>(null);

  // Memoize sorted sections to prevent recalculation on every render
  const sortedSections = useMemo(() => 
    [...sections].sort((a, b) => a.order - b.order).filter(s => s.enabled),
    [sections]
  );

  // Memoize handlers to prevent unnecessary re-renders
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleExportPDF = useCallback(async () => {
    if (!printRef.current) return;

    const opt = {
      margin: 0.5,
      filename: `${currentResume.profile.name || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(printRef.current).save();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  }, [currentResume.profile.name]);

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Live Preview</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleExportPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div ref={printRef} className="resume-page">
            <ClassicATS 
              sections={sortedSections}
            />
          </div>
        </div>
      </div>

      {/* Preview Footer */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>This is how your resume will look when printed or exported</p>
        <p className="mt-1">Sections can be toggled on/off and reordered in the editor</p>
      </div>
    </div>
  );
});
