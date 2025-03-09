
import React from 'react';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import FloatingLabelInput from './FloatingLabelInput';
import PasswordStrengthMeter from './PasswordStrengthMeter';

type RegisterFormStepTwoProps = {
  password: string;
  confirmPassword: string;
  isSubmitting: boolean;
  passwordsMatch: boolean;
  error: string | null;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  goBack: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
};

const RegisterFormStepTwo = ({
  password,
  confirmPassword,
  isSubmitting,
  passwordsMatch,
  error,
  setPassword,
  setConfirmPassword,
  goBack,
  handleSubmit
}: RegisterFormStepTwoProps) => {
  return (
    <div className="space-y-4">
      <div>
        <FloatingLabelInput
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="h-4 w-4 text-white/50" />}
          required
          disabled={isSubmitting}
        />
        {password && <PasswordStrengthMeter password={password} />}
      </div>
      
      <FloatingLabelInput
        id="confirmPassword"
        type="password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        icon={<Lock className="h-4 w-4 text-white/50" />}
        error={!passwordsMatch ? "Passwords must match" : undefined}
        required
        disabled={isSubmitting}
      />
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-2 rounded-md"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </motion.div>
      )}
      
      <div className="flex justify-between pt-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={goBack}
          className="border-white/20 hover:bg-white/10 text-white hover:text-white"
        >
          Back
        </Button>
        
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={isSubmitting || !passwordsMatch || !password}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:opacity-90 transition-opacity"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Account...
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>
    </div>
  );
};

export default RegisterFormStepTwo;
