import React, { useState, useEffect } from 'react';
import { Sun, Moon, Wallet } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface HeaderProps {
  onWalletSearch: (address: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onWalletSearch }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  // Check system preference for dark mode on initial load
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const isSystemDarkMode = darkModeMediaQuery.matches;
    
    // Check localStorage first, fallback to system preference
    const savedMode = localStorage.getItem('darkMode');
    const initialDarkMode = savedMode !== null ? savedMode === 'true' : isSystemDarkMode;
    
    setIsDarkMode(initialDarkMode);
    updateDocumentClass(initialDarkMode);
    
    // Listen for system preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
        updateDocumentClass(e.matches);
      }
    };
    
    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    updateDocumentClass(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };
  
  const updateDocumentClass = (darkMode: boolean) => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (walletAddress.trim()) {
      onWalletSearch(walletAddress.trim());
    }
  };
  
  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };
  
  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Wallet className="h-8 w-8 text-primary-500" />
            <h1 className="ml-2 text-xl font-bold text-slate-900 dark:text-white">
              Cypher Analytics
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="text"
                placeholder="Enter wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                leftIcon={<Wallet className="h-4 w-4" />}
                className="min-w-[300px] w-full"
                error={walletAddress && !isValidAddress(walletAddress) ? "Please enter a valid address" : ""}
              />
              <Button 
                type="submit" 
                className="ml-2"
                disabled={!walletAddress || !isValidAddress(walletAddress)}
              >
                Analyze
              </Button>
            </form>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;