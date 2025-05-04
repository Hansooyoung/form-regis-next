import { ReactNode } from 'react';

interface AuthFormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AuthForm({ children, onSubmit }: AuthFormProps) {
  return (
    <form 
      className="space-y-4 md:space-y-6" 
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
}