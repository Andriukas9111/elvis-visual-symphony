
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const RegisterSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
      </motion.div>
      <h3 className="text-xl font-semibold text-white">Registration Complete!</h3>
      <p className="text-white/60 mt-2">Your account has been created</p>
    </div>
  );
};

export default RegisterSuccess;
