import React from 'react';
import { Loader2 } from 'lucide-react';
import Card from '../ui/Card';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading data...' 
}) => {
  return (
    <Card className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-10 w-10 text-primary-500 animate-spin mb-4" />
      <p className="text-slate-600 dark:text-slate-400">{message}</p>
    </Card>
  );
};

export default LoadingState;