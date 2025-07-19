import React from 'react';
import { Modal } from '../../../../_design/Modal';
import { Button } from '../../../../_design/Buttons';
import { Text } from '../../../../_design/Typography';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentView: string;
  targetView: string;
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentView,
  targetView
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Unsaved Changes"
      maxWidth="max-w-md"
      actions={
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            size="sm"
          >
            Continue
          </Button>
        </div>
      }
    >
      <div className="py-4">
        <Text variant="body" classes="text-gray-700 dark:text-gray-300">
          You have unsaved changes in your {currentView.toLowerCase()}. 
          If you switch to {targetView.toLowerCase()}, your changes will be lost.
        </Text>
        <Text variant="body" classes="text-gray-700 dark:text-gray-300 mt-4">
          Are you sure you want to continue?
        </Text>
      </div>
    </Modal>
  );
};

export default UnsavedChangesModal;