
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { X } from 'lucide-react';

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'login' | 'register';
};

const AuthModal = ({ open, onOpenChange, defaultTab = 'login' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);

  // Reset to default tab when modal opens
  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="bg-elvis-medium p-0 border-none overflow-hidden sm:rounded-2xl max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-1 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="p-6 pb-0">
                <h2 className="text-2xl font-bold text-white text-center mb-1">
                  {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-white/60 text-center mb-6">
                  {activeTab === 'login' 
                    ? 'Sign in to your Elvis Creative account' 
                    : 'Join the Elvis Creative community today'}
                </p>
              </div>

              <Tabs 
                value={activeTab} 
                onValueChange={(value) => setActiveTab(value as 'login' | 'register')}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-elvis-light/20 p-1 mx-6 rounded-lg mb-6">
                  <TabsTrigger 
                    value="login" 
                    className="data-[state=active]:bg-elvis-pink data-[state=active]:text-white rounded-md py-2"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    className="data-[state=active]:bg-elvis-pink data-[state=active]:text-white rounded-md py-2"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="px-6 pb-6 mt-0">
                  <LoginForm onSuccess={() => onOpenChange(false)} />
                </TabsContent>
                
                <TabsContent value="register" className="px-6 pb-6 mt-0">
                  <RegisterForm onSuccess={() => onOpenChange(false)} />
                </TabsContent>
              </Tabs>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
