import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/Button';
import { Save, Download, Plus, Trash2, Undo, Redo, ChevronDown, FileText, Eye, Settings, Palette } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import { TemplateType, FontFamily } from '../store/useResumeStore';
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';
import { Toast } from './ui/Toast';

export default React.memo(function ResumeBuilder() {
  // Fine-grained selectors to prevent unnecessary re-renders
  const {
    currentResume,
    versions,
    currentVersionId,
    lastSaved,
    isSaving,
    selectedTemplate,
    selectedFont,
    undo,
    redo,
    canUndo,
    canRedo,
    loadSampleData,
    deleteVersion,
    autoRecover,
    createVersion,
    switchVersion,
    setSelectedTemplate,
    setSelectedFont
  } = useResumeStore(s => ({
    currentResume: s.currentResume,
    versions: s.versions,
    currentVersionId: s.currentVersionId,
    lastSaved: s.lastSaved,
    isSaving: s.isSaving,
    selectedTemplate: s.selectedTemplate,
    selectedFont: s.selectedFont,
    undo: s.undo,
    redo: s.redo,
    canUndo: s.canUndo,
    canRedo: s.canRedo,
    loadSampleData: s.loadSampleData,
    deleteVersion: s.deleteVersion,
    autoRecover: s.autoRecover,
    createVersion: s.createVersion,
    switchVersion: s.switchVersion,
    setSelectedTemplate: s.setSelectedTemplate,
    setSelectedFont: s.setSelectedFont
  }));
  
  // Debug logging
  console.log('ResumeBuilder rendering:', { 
    versions: versions.length, 
    currentVersionId, 
    hasProfile: !!currentResume?.profile?.name 
  });
  
  const [showVersions, setShowVersions] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showFonts, setShowFonts] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const currentVersion = React.useMemo(() => 
    versions.find(v => v.id === currentVersionId), 
    [versions, currentVersionId]
  );

  const templateOptions: { id: TemplateType; name: string; icon: string }[] = [
    { id: 'classic', name: 'Classic ATS', icon: '📄' },
    { id: 'modern', name: 'Modern Clean', icon: '✨' },
    { id: 'twocolumn', name: 'Two Column', icon: '📋' }
  ];

  const fontOptions: { id: FontFamily; name: string; icon: string }[] = [
    { id: 'inter', name: 'Inter', icon: 'Aa' },
    { id: 'roboto', name: 'Roboto', icon: 'Aa' },
    { id: 'georgia', name: 'Georgia', icon: 'Aa' },
    { id: 'times', name: 'Times', icon: 'Aa' },
    { id: 'arial', name: 'Arial', icon: 'Aa' },
    { id: 'helvetica', name: 'Helvetica', icon: 'Aa' }
  ];

  const currentTemplate = templateOptions.find(t => t.id === selectedTemplate);
  const currentFont = fontOptions.find(f => f.id === selectedFont);

  // Check if mobile - simplified to fix hook issues
  useEffect(() => {
    const checkMobile = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showVersions || showTemplates || showFonts) {
        const target = event.target as Element;
        if (!target.closest('.template-dropdown') && !target.closest('.version-dropdown') && !target.closest('.font-dropdown')) {
          setShowVersions(false);
          setShowTemplates(false);
          setShowFonts(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showVersions, showTemplates, showFonts]);

  // Auto-recover from empty states
  useEffect(() => {
    if (versions && versions.length === 0) {
      console.log('Auto-recovering from empty state...');
      const recovered = autoRecover();
      if (recovered) {
        console.log('Auto-recovery successful');
      }
    }
  }, [versions, autoRecover]);

  const formatLastSaved = useCallback(() => {
    if (!lastSaved) return 'Never saved';
    
    // Ensure lastSaved is a Date object
    let lastSavedDate: Date;
    if (lastSaved instanceof Date) {
      lastSavedDate = lastSaved;
    } else if (typeof lastSaved === 'string') {
      lastSavedDate = new Date(lastSaved);
    } else {
      return 'Never saved';
    }
    
    // Check if the date is valid
    if (isNaN(lastSavedDate.getTime())) {
      return 'Never saved';
    }
    
    const now = new Date();
    const diff = now.getTime() - lastSavedDate.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return lastSavedDate.toLocaleDateString();
  }, [lastSaved]);

  // Fallback: if store is not initialized, show loading
  if (!currentResume || !versions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume builder...</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Handle case when no versions exist (user deleted everything)
  if (versions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Resume Found</h1>
          <p className="text-gray-600 mb-6">
            It looks like all your resume versions have been deleted. Let's start fresh!
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => {
                loadSampleData();
                showSuccessToast('Sample resume loaded successfully!');
              }}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Load Sample Resume
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                createVersion('New Resume');
                showSuccessToast('New empty resume created!');
              }}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Empty Resume
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              ← Back to Onboarding
            </Button>
          </div>
          
          <div className="mt-6 text-xs text-gray-500">
            💡 Tip: You can also try refreshing the page to auto-recover
          </div>
        </div>
      </div>
    );
  }

  const handleCreateVersion = () => {
    const name = prompt('Enter a name for this resume version:');
    if (name?.trim()) {
      createVersion(name);
      setShowVersions(false);
      showSuccessToast('New version created successfully');
    }
  };

  const handleLoadSample = () => {
    loadSampleData();
    showSuccessToast('Sample resume loaded successfully');
  };

  const handleResetApp = () => {
    // Clear localStorage and reload the page
    localStorage.removeItem('snapresume-storage');
    window.location.reload();
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Mobile layout with tabs
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">SnapResume</h1>
            <div className="flex gap-2">
                             {/* Mobile Template Selector */}
               <div className="relative template-dropdown">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => setShowTemplates(!showTemplates)}
                   className="gap-1"
                   aria-label="Select resume template"
                 >
                   <Palette className="h-3 w-3" />
                   {currentTemplate?.icon}
                 </Button>
                 
                 {showTemplates && (
                   <div 
                     className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                     role="listbox"
                     aria-label="Resume templates"
                   >
                     <div className="p-2">
                       {templateOptions.map(template => (
                         <button
                           key={template.id}
                           onClick={() => {
                             setSelectedTemplate(template.id);
                             setShowTemplates(false);
                             showSuccessToast(`Switched to ${template.name} template`);
                           }}
                           className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                             selectedTemplate === template.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                           }`}
                           role="option"
                           aria-selected={selectedTemplate === template.id}
                         >
                           <span className="mr-2">{template.icon}</span>
                           {template.name}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
               
               {/* Mobile Font Selector */}
               <div className="relative font-dropdown">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => setShowFonts(!showFonts)}
                   className="gap-1"
                   aria-label="Select resume font"
                 >
                   <ChevronDown className="h-3 w-3" />
                   {currentFont?.icon}
                 </Button>
                 
                 {showFonts && (
                   <div 
                     className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                     role="listbox"
                     aria-label="Resume fonts"
                   >
                     <div className="p-2">
                       {fontOptions.map(font => (
                         <button
                           key={font.id}
                           onClick={() => {
                             setSelectedFont(font.id);
                             setShowFonts(false);
                             showSuccessToast(`Switched to ${font.name} font`);
                           }}
                           className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                             selectedFont === font.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                           }`}
                           role="option"
                           aria-selected={selectedFont === font.id}
                         >
                           <span className="mr-2">{font.icon}</span>
                           {font.name}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSample}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Load Sample
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetApp}
                className="gap-2"
              >
                Reset
              </Button>
            </div>
          </div>
          
          {/* Mobile Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'editor'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Preview
            </button>
          </div>
        </header>

        {/* Mobile Content */}
        <main className="flex-1">
          {activeTab === 'editor' ? (
            <EditorPanel />
          ) : (
            <PreviewPanel />
          )}
        </main>

        {/* Mobile Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={!canUndo()}
                aria-label="Undo last action"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={!canRedo()}
                aria-label="Redo last action"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('preview')}
                aria-label="Switch to preview mode"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  // Handle PDF export
                  showSuccessToast('PDF export started');
                }}
                aria-label="Export to PDF"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Toast */}
        {showToast && (
          <Toast
            type="success"
            title="Success"
            message={toastMessage}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">SnapResume</h1>
            
            {/* Load Sample Button */}
            <Button
              variant="outline"
              onClick={handleLoadSample}
              className="gap-2"
              aria-label="Load sample resume data"
            >
              <FileText className="h-4 w-4" />
              Load Sample
            </Button>
            
            <Button
              variant="outline"
              onClick={handleResetApp}
              className="gap-2"
              aria-label="Reset application and clear all data"
            >
              Reset App
            </Button>
            
            {/* Version Selector */}
            <div className="relative version-dropdown">
              <Button
                variant="outline"
                onClick={() => setShowVersions(!showVersions)}
                className="min-w-[200px] justify-between"
                aria-label="Select resume version"
                aria-expanded={showVersions}
                aria-haspopup="listbox"
              >
                <span>{currentVersion?.name || 'Untitled'}</span>
                <Settings className="h-4 w-4" />
              </Button>
              
              {showVersions && (
                <div 
                  className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10"
                  role="listbox"
                  aria-label="Resume versions"
                >
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      onClick={handleCreateVersion}
                      className="w-full justify-start gap-2 mb-2"
                      aria-label="Create new resume version"
                    >
                      <Plus className="h-4 w-4" />
                      Create New Version
                    </Button>
                    <div className="border-t pt-2">
                      {versions.map(version => (
                        <div
                          key={version.id}
                          className="flex items-center justify-between group hover:bg-gray-100 rounded px-3 py-2"
                        >
                          <button
                            onClick={() => {
                              switchVersion(version.id);
                              setShowVersions(false);
                            }}
                            className={`flex-1 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded ${
                              version.id === currentVersionId ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                            role="option"
                            aria-selected={version.id === currentVersionId}
                          >
                            {version.name}
                          </button>
                          
                          {/* Delete button - only show for non-default versions and when there are multiple versions */}
                          {version.id !== 'default' && versions.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (versions.length === 1) {
                                  alert('Cannot delete the last remaining version. Please create a new version first.');
                                  return;
                                }
                                if (confirm(`Are you sure you want to delete "${version.name}"? This action cannot be undone.`)) {
                                  deleteVersion(version.id);
                                  showSuccessToast(`Version "${version.name}" deleted`);
                                  if (showVersions) setShowVersions(false);
                                }
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              aria-label={`Delete version ${version.name}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {/* Show info when only one version remains */}
                          {version.id !== 'default' && versions.length === 1 && (
                            <div className="ml-2 text-xs text-gray-400">
                              Last version
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Template Selector */}
            <div className="relative template-dropdown">
              <Button
                variant="outline"
                onClick={() => setShowTemplates(!showTemplates)}
                className="gap-2"
                aria-label="Select resume template"
                aria-expanded={showTemplates}
                aria-haspopup="listbox"
              >
                <Palette className="h-4 w-4" />
                {currentTemplate?.icon} {currentTemplate?.name}
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {showTemplates && (
                <div 
                  className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                  role="listbox"
                  aria-label="Resume templates"
                >
                  <div className="p-2">
                    {templateOptions.map(template => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setShowTemplates(false);
                          showSuccessToast(`Switched to ${template.name} template`);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          selectedTemplate === template.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                        role="option"
                        aria-selected={selectedTemplate === template.id}
                      >
                        <span className="mr-2">{template.icon}</span>
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Font Selector */}
            <div className="relative font-dropdown">
              <Button
                variant="outline"
                onClick={() => setShowFonts(!showFonts)}
                className="gap-2"
                aria-label="Select resume font"
                aria-expanded={showFonts}
                aria-haspopup="listbox"
              >
                <ChevronDown className="h-4 w-4" />
                {currentFont?.icon} {currentFont?.name}
              </Button>
              
              {showFonts && (
                <div 
                  className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                  role="listbox"
                  aria-label="Resume fonts"
                >
                  <div className="p-2">
                    {fontOptions.map(font => (
                      <button
                        key={font.id}
                        onClick={() => {
                          setSelectedFont(font.id);
                          setShowFonts(false);
                          showSuccessToast(`Switched to ${font.name} font`);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          selectedFont === font.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                        role="option"
                        aria-selected={selectedFont === font.id}
                      >
                        <span className="mr-2">{font.icon}</span>
                        {font.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Undo/Redo */}
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!canUndo()}
              aria-label="Undo last action"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={!canRedo()}
              aria-label="Redo last action"
            >
              <Redo className="h-4 w-4" />
            </Button>
            
            {/* Save status */}
            <div className="text-sm text-gray-600">
              {isSaving ? (
                <span className="flex items-center gap-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  저장 중...
                </span>
              ) : (
                <span>저장됨 ✓ {formatLastSaved()}</span>
              )}
            </div>
            
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => useResumeStore.getState().saveCurrentVersion()}
              aria-label="Save resume manually"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
            
            <Button className="gap-2" aria-label="Export resume to PDF">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex h-[calc(100vh-80px)]">
        {/* Editor Panel */}
        <aside className="w-1/2 border-r border-gray-200 overflow-y-auto">
          <EditorPanel />
        </aside>

        {/* Preview Panel */}
        <section className="w-1/2 overflow-y-auto bg-gray-100 p-6">
          <PreviewPanel />
        </section>
      </main>

      {/* Toast */}
      {showToast && (
        <Toast
          type="success"
          title="Success"
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
});
