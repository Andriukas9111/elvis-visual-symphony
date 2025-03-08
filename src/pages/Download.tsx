
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, FileDown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const Download = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const processDownload = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (!token) {
          setStatus('error');
          setErrorMessage('Invalid download link. Missing token.');
          return;
        }
        
        // Call the secure-download endpoint
        const { data, error } = await supabase.functions.invoke('secure-download', {
          method: 'GET',
          headers: {
            token: token,
          },
        });
        
        if (error) {
          throw error;
        }
        
        // Redirect to the download URL
        window.location.href = data.url;
        setStatus('success');
        
      } catch (error) {
        console.error('Download error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Failed to download file.');
      }
    };
    
    processDownload();
  }, []);

  return (
    <div className="min-h-screen bg-elvis-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-elvis-medium rounded-lg text-white text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="h-16 w-16 text-elvis-pink animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Preparing Your Download</h1>
            <p className="text-white/70 mb-4">Please wait while we prepare your file...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <FileDown className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Download Started</h1>
            <p className="text-white/70 mb-6">Your download should begin automatically. If not, click the button below.</p>
            <Button className="bg-elvis-gradient">
              Download File
            </Button>
          </>
        )}
        
        {status === 'error' && (
          <>
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Download Failed</h1>
            <p className="text-white/70 mb-4">
              {errorMessage || 'There was an issue with your download. Please try again or contact support.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
              <Button className="bg-elvis-gradient" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Download;
