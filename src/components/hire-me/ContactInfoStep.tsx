
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormData } from './HireMeForm';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';

export interface ContactInfoStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  prevStep: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({
  formData,
  updateFormData,
  prevStep,
  onSubmit,
  isSubmitting
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      updateFormData({ files: [...formData.files, ...newFiles] });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      updateFormData({ files: [...formData.files, ...newFiles] });
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...formData.files];
    updatedFiles.splice(index, 1);
    updateFormData({ files: updatedFiles });
  };

  const isFormValid = 
    formData.name.trim() !== '' && 
    formData.email.trim() !== '' && 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email address"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your phone number (optional)"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="message">Additional Details</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Any additional information you'd like to share"
              className="mt-1 min-h-[80px]"
            />
          </div>

          {/* File upload area */}
          <div>
            <Label>Attachments</Label>
            <div 
              className={`mt-1 border-2 border-dashed p-4 rounded-lg text-center cursor-pointer transition-colors ${
                isDragging ? 'border-elvis-pink bg-elvis-darker/80' : 'border-elvis-medium hover:border-elvis-pink/70'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
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
              <Upload className="mx-auto h-5 w-5 text-elvis-pink mb-2" />
              <p className="text-sm text-white/70">
                Drag files here or click to upload
              </p>
            </div>
          </div>
          
          {/* File list */}
          {formData.files.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Files ({formData.files.length})</Label>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {formData.files.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between bg-elvis-darker rounded p-2 text-sm"
                  >
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={prevStep}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Button 
            type="submit" 
            disabled={!isFormValid || isSubmitting}
            className="bg-elvis-pink hover:bg-elvis-pink/90 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ContactInfoStep;
