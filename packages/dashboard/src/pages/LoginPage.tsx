import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { from?: string })?.from || '/';

  useEffect(() => {
    if (!loading && user) {
      navigate(returnTo);
    }
  }, [user, loading, navigate, returnTo]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-6">
        <img
          src="/logo.svg"
          alt="Supermarket List"
          className="w-20 h-20 mx-auto rounded-2xl shadow-lg"
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-extrabold tracking-tight">
            Supermarket List
          </h1>
          <p className="text-muted-foreground">
            Sign in to manage your grocery lists
          </p>
        </div>
        <Button onClick={signInWithGoogle} size="lg" className="w-full max-w-xs">
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
