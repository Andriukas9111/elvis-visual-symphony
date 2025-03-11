
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  isDirty: boolean;
  isSubmitting: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  isDirty,
  isSubmitting,
  onSave,
  onDiscard
}) => {
  return (
    <div className="flex justify-end gap-3 mt-6">
      <Button
        variant="outline"
        onClick={onDiscard}
        disabled={!isDirty || isSubmitting}
      >
        Discard Changes
      </Button>
      
      <Button
        type="submit"
        onClick={onSave}
        disabled={!isDirty || isSubmitting}
        className="bg-elvis-pink hover:bg-elvis-pink/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </div>
  );
};

export default FormActions;
