import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { sampleResume } from '../data/sampleResume';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';

const onboardingQuestions = [
  {
    id: 'name',
    question: "What's your full name?",
    type: 'text',
    placeholder: 'e.g., Alex Johnson',
    field: 'profile.name'
  },
  {
    id: 'title',
    question: "What's your professional title?",
    type: 'text',
    placeholder: 'e.g., Software Engineer, Data Scientist',
    field: 'profile.title'
  },
  {
    id: 'email',
    question: "What's your email address?",
    type: 'email',
    placeholder: 'your.email@example.com',
    field: 'profile.email'
  },
  {
    id: 'summary',
    question: "Give us a brief professional summary (2-3 sentences)",
    type: 'textarea',
    placeholder: 'Describe your background, key skills, and career goals...',
    field: 'summary'
  },
  {
    id: 'skills',
    question: "What are your top 5-8 technical skills?",
    type: 'text',
    placeholder: 'e.g., JavaScript, React, Python, SQL, Git',
    field: 'skills'
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateProfile, updateSummary, updateSkills } = useResumeStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < onboardingQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Update profile fields
      updateProfile({
        name: answers.name || '',
        title: answers.title || '',
        email: answers.email || '',
        phone: '',
        location: '',
        links: [{ label: 'GitHub', url: '' }]
      });

      // Update summary
      updateSummary(answers.summary || '');

      // Update skills
      const skillsArray = answers.skills ? answers.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
      updateSkills(skillsArray);

      // Navigate to builder
      navigate('/builder');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSample = () => {
    // Use sample resume data
    const { updateProfile, updateSummary, updateSkills, updateExperience, updateProjects, updateEducation, updateAwards } = useResumeStore.getState();
    
    updateProfile(sampleResume.profile);
    updateSummary(sampleResume.summary);
    updateSkills(sampleResume.skills);
    updateExperience(sampleResume.experience);
    updateProjects(sampleResume.projects);
    updateEducation(sampleResume.education);
    updateAwards(sampleResume.awards);
    
    navigate('/builder');
  };

  const currentQuestion = onboardingQuestions[currentStep];
  const canProceed = answers[currentQuestion.id]?.trim();
  const isLastStep = currentStep === onboardingQuestions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to SnapResume
          </h1>
          <p className="text-gray-600 text-lg">
            Let's get to know you better to create your perfect resume
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep + 1} of {onboardingQuestions.length}</span>
            <span className="text-sm text-gray-600">{Math.round(((currentStep + 1) / onboardingQuestions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / onboardingQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {currentQuestion.question}
          </h2>
          
          {currentQuestion.type === 'textarea' ? (
            <Textarea
              placeholder={currentQuestion.placeholder}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              className="min-h-[120px] text-lg"
            />
          ) : (
            <Input
              type={currentQuestion.type}
              placeholder={currentQuestion.placeholder}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              className="text-lg"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6"
          >
            Previous
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleUseSample}
              className="px-6"
            >
              Use Sample
            </Button>

            {isLastStep ? (
              <Button
                onClick={handleComplete}
                disabled={!canProceed || isLoading}
                className="px-8"
              >
                {isLoading ? 'Creating...' : 'Create Resume'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed}
                className="px-6"
              >
                Next
              </Button>
            )}
          </div>
        </div>

        {/* Skip option */}
        <div className="text-center mt-6">
          <button
            onClick={handleUseSample}
            className="text-gray-500 hover:text-gray-700 text-sm underline mr-4"
          >
            Skip and use sample data
          </button>
          <button
            onClick={() => navigate('/builder')}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Skip onboarding entirely
          </button>
        </div>
      </div>
    </div>
  );
}
