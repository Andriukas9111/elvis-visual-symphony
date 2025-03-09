
import React from 'react';
import { motion } from 'framer-motion';
import { FormData } from './HireMeForm';
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react';

interface ProjectDetailsStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const ProjectDetailsStep: React.FC<ProjectDetailsStepProps> = ({ 
  formData, 
  updateFormData, 
  nextStep,
  prevStep
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      updateFormData({ files: [...formData.files, ...newFiles] });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      updateFormData({ files: [...formData.files, ...newFiles] });
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...formData.files];
    updatedFiles.splice(index, 1);
    updateFormData({ files: updatedFiles });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-bold text-white">Tell me about your project</h3>
      <p className="text-gray-400">Share details about your vision, goals, and any reference materials</p>
      
      <div className="space-y-6 mt-6">
        <div className="relative film-frame">
          <textarea
            value={formData.projectDetails}
            onChange={(e) => updateFormData({ projectDetails: e.target.value })}
            placeholder="Describe your project in detail..."
            className="w-full h-40 p-4 rounded-lg bg-elvis-darker border border-elvis-medium text-white resize-none focus:outline-none focus:ring-2 focus:ring-elvis-pink"
          />
        </div>
        
        {/* File upload area */}
        <div 
          className="mt-6 border-2 border-dashed border-elvis-medium p-8 rounded-lg text-center cursor-pointer hover:border-elvis-pink transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input
            type="file"
            id="file-upload"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <Upload className="mx-auto h-12 w-12 text-elvis-pink mb-4" />
          <h4 className="text-lg font-medium">Drop files here or click to upload</h4>
          <p className="text-sm text-gray-400 mt-2">
            Share reference materials, mood boards, or examples (optional)
          </p>
        </div>
        
        {/* File list */}
        {formData.files.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-white">Uploaded Files:</h4>
            <div className="max-h-40 overflow-y-auto pr-2">
              {formData.files.map((file, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between bg-elvis-medium/30 rounded p-2 mb-2"
                >
                  <span className="text-sm truncate">{file.name}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-gray-400 hover:text-white ml-2"
                  >
                    &times;
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex justify-between">
        <motion.button
          className="btn-outline px-6 py-2 rounded-full font-medium flex items-center"
          onClick={prevStep}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </motion.button>
        
        <motion.button
          className={`btn-primary px-8 py-3 rounded-full font-medium flex items-center ${
            !formData.projectDetails ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={nextStep}
          disabled={!formData.projectDetails}
          whileHover={{ scale: formData.projectDetails ? 1.05 : 1 }}
          whileTap={{ scale: formData.projectDetails ? 0.95 : 1 }}
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProjectDetailsStep;
