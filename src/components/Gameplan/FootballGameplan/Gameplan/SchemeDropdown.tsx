import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../../../../_design/Typography';
import { Button } from '../../../../_design/Buttons';
import { ArrowDown } from '../../../../_design/Icons';

export interface SchemeDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  name?: string;
  error?: string;
  warning?: string;
}

export const SchemeDropdown: React.FC<SchemeDropdownProps> = ({
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "Select option...",
  className = '',
  name,
  error,
  warning
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="secondaryOutline"
        size="md"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full justify-between text-left
          ${error ? 'border-red-500' : warning ? 'border-yellow-500' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex gap-2 items-center">
          <Text variant="xs" className="truncate">
            {value || placeholder}
          </Text>
          <ArrowDown />
        </div>
      </Button>
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`
                w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors duration-150
                ${value === option ? 'bg-blue-600 text-white' : 'text-gray-300'}
                first:rounded-t-lg last:rounded-b-lg
              `}
            >
              <Text variant="small" classes={value === option ? 'text-white' : 'text-gray-300'}>
                {option}
              </Text>
            </button>
          ))}
        </div>
      )}
      {error && (
        <Text variant="xs" classes="text-red-400 mt-1">
          {error}
        </Text>
      )}
      {warning && !error && (
        <Text variant="xs" classes="text-yellow-400 mt-1">
          {warning}
        </Text>
      )}
    </div>
  );
};

export interface CoverageDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const CoverageDropdown: React.FC<CoverageDropdownProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  className = ''
}) => {
  const coverageOptions = ['Man', 'Zone'];

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Text variant="small" classes="text-gray-300 font-medium">
        {label}
      </Text>
      <SchemeDropdown
        value={value}
        options={coverageOptions}
        onChange={onChange}
        disabled={disabled}
        placeholder="Select coverage..."
      />
    </div>
  );
};

export interface BlitzAggressionDropdownProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const BlitzAggressionDropdown: React.FC<BlitzAggressionDropdownProps> = ({
  value,
  onChange,
  disabled = false,
  className = ''
}) => {
  const aggressionOptions = ['Cautious', 'Moderate', 'Aggressive'];

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Text variant="small" classes="text-gray-300 font-medium">
        Blitz Aggression
      </Text>
      <SchemeDropdown
        value={value}
        options={aggressionOptions}
        onChange={onChange}
        disabled={disabled}
        placeholder="Select aggression..."
      />
    </div>
  );
};

export default SchemeDropdown;