
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Scale, Lock, User } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        toast({
          title: "Welcome!",
          description: "Successfully logged in to Legal Assistant Hub.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
        });
      }
      setIsLoading(false);
    }, 1000); // Simulate loading
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-legal-light via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-legal-primary to-legal-secondary rounded-full flex items-center justify-center mb-4">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-legal-dark">Legal Assistant Hub</CardTitle>
            <CardDescription className="text-legal-neutral">
              Sign in to access your legal productivity suite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-legal-dark font-medium">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-legal-neutral" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 border-legal-neutral/20 focus:border-legal-primary"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-legal-dark font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-legal-neutral" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-legal-neutral/20 focus:border-legal-primary"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-legal-primary to-legal-secondary hover:from-legal-primary/90 hover:to-legal-secondary/90 text-white font-medium transition-all duration-200"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-legal-neutral text-center">
                <strong>Demo Credentials:</strong><br />
                Username: test_user<br />
                Password: pass@123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
