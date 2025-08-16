import { Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './components/Onboarding';
import ResumeBuilder from './components/ResumeBuilder';

function App() {
  // We don't need to destructure anything since onboarding always shows
  // and sample data is only loaded when explicitly requested

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route 
          path="/" 
          element={<Onboarding />}
        />
        <Route 
          path="/builder" 
          element={<ResumeBuilder />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
