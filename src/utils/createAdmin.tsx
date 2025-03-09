
import React, { useState } from 'react';
import { createAdminUser } from './makeAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const CreateAdminForm = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await createAdminUser(email);
      console.log('Admin creation response:', response);
      setResult(response.data);
    } catch (err: any) {
      console.error('Failed to create admin:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-elvis-dark p-4">
      <Card className="w-full max-w-md bg-elvis-medium border-white/10 text-white">
        <CardHeader>
          <CardTitle>Create Admin User</CardTitle>
          <CardDescription className="text-white/60">
            Use this form to create an admin user in the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10"
                required
              />
            </div>
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-elvis-pink hover:bg-elvis-pink/80"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Admin...
                </>
              ) : (
                "Create Admin User"
              )}
            </Button>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-white">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
          
          {result && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-md text-white">
              <p className="font-medium">Success!</p>
              <p className="text-sm mt-1">{result.message}</p>
              {result.credentials && (
                <div className="mt-2 p-2 bg-black/30 rounded-md font-mono text-sm">
                  <p>Email: {result.credentials.email}</p>
                  <p>Password: {result.credentials.password}</p>
                  <p className="mt-1 text-yellow-300 text-xs">{result.credentials.note}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAdminForm;
