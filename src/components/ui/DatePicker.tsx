import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from './Button';

interface DatePickerProps {
  value: string; // Format: "YYYY-MM"
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
}

export function DatePicker({ value, onChange, placeholder, className, 'aria-label': ariaLabel }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(() => {
    if (value) {
      return parseInt(value.split('-')[0]);
    }
    return new Date().getFullYear();
  });
  const pickerRef = useRef<HTMLDivElement>(null);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      const [year] = value.split('-');
      setCurrentYear(parseInt(year));
    }
  }, [value]);

  const handleMonthSelect = (monthIndex: number) => {
    const newValue = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}`;
    onChange(newValue);
    setIsOpen(false);
  };

  const handleYearChange = (direction: 'prev' | 'next') => {
    setCurrentYear(prev => {
      if (direction === 'prev') {
        return Math.max(1900, prev - 1);
      } else {
        return Math.min(2100, prev + 1);
      }
    });
  };

  const formatDisplayValue = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const monthIndex = parseInt(month) - 1;
    return `${months[monthIndex]} ${year}`;
  };

  const currentValue = value ? formatDisplayValue(value) : '';

  return (
    <div className="relative" ref={pickerRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full justify-between ${className || ''}`}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={currentValue ? 'text-gray-900' : 'text-gray-500'}>
          {currentValue || placeholder || 'Select date'}
        </span>
        <Calendar className="h-4 w-4 text-gray-400" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {/* Header with year navigation */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleYearChange('prev')}
              aria-label="Previous year"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-lg font-semibold text-gray-900">
              {currentYear}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleYearChange('next')}
              aria-label="Next year"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Month grid */}
          <div className="p-3">
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthSelect(index)}
                  className={`p-2 text-sm rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                    value === `${currentYear}-${String(index + 1).padStart(2, '0')}`
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700'
                  }`}
                  aria-label={`Select ${month} ${currentYear}`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const newValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
                  onChange(newValue);
                  setIsOpen(false);
                }}
                className="text-xs"
              >
                This month
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
