
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface FormState<T> {
  initialData: T | null;
  currentData: T | null;
  isDirty: boolean;
  isSubmitting: boolean;
  error: string | null;
  lastSaved: Date | null;
}

export function useAboutForm<T>(initialData: T | null = null) {
  const [state, setState] = useState<FormState<T>>({
    initialData,
    currentData: initialData,
    isDirty: false,
    isSubmitting: false,
    error: null,
    lastSaved: null
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const updateForm = (updates: Partial<T>) => {
    setState(prev => {
      const updatedData = { ...prev.currentData, ...updates } as T;
      return {
        ...prev,
        currentData: updatedData,
        isDirty: JSON.stringify(updatedData) !== JSON.stringify(prev.initialData)
      };
    });
  };
  
  const resetForm = () => {
    setState(prev => ({
      ...prev,
      currentData: prev.initialData,
      isDirty: false,
      error: null
    }));
  };
  
  const setInitialData = (data: T) => {
    setState(prev => ({
      ...prev,
      initialData: data,
      currentData: data,
      isDirty: false
    }));
  };
  
  const startSubmitting = () => {
    setState(prev => ({
      ...prev,
      isSubmitting: true,
      error: null
    }));
  };
  
  const submissionSuccess = (data: T) => {
    setState(prev => ({
      ...prev,
      initialData: data,
      currentData: data,
      isDirty: false,
      isSubmitting: false,
      error: null,
      lastSaved: new Date()
    }));
    
    toast({
      title: "Success",
      description: "Your changes have been saved successfully",
    });
  };
  
  const submissionError = (error: string) => {
    setState(prev => ({
      ...prev,
      isSubmitting: false,
      error
    }));
    
    toast({
      title: "Error",
      description: error,
      variant: "destructive"
    });
  };
  
  const discardChanges = () => {
    resetForm();
    toast({
      title: "Changes Discarded",
      description: "Your changes have been discarded"
    });
  };
  
  return {
    ...state,
    updateForm,
    resetForm,
    setInitialData,
    startSubmitting,
    submissionSuccess,
    submissionError,
    discardChanges
  };
}
