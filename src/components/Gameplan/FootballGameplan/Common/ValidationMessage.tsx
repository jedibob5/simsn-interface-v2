import React from 'react';
import { Text } from '../../../../_design/Typography';
import { getValidationTextColor } from '../Utils/UIUtils';

interface ValidationMessageProps {
  error?: string;
  warning?: string;
  className?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  error,
  warning,
  className = ''
}) => {
  if (!error && !warning) return null;

  const message = error || warning;
  const color = getValidationTextColor(!!error, !!warning);

  return (
    <Text variant="xs" classes={`${color} ${className}`}>
      {message}
    </Text>
  );
};

export default ValidationMessage;