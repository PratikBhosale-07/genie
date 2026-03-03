'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (selectedTheme: string) => {
    if (selectedTheme === 'dark' || (selectedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900 font-['Poppins',sans-serif]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="pt-6 pb-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                G
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Genie
              </h1>
            </div>

            {/* Theme Switcher */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-3 py-2 shadow-md">
              <span className="text-sm text-gray-600 dark:text-gray-300 mr-1">Theme:</span>
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                title="Light Theme"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                title="Dark Theme"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`p-2 rounded-full transition-colors ${theme === 'system' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                title="System Default"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-200px)] gap-12 py-12">
          {/* Text Content */}
          <div className="flex-1 max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Elevate Your Team Communication
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Streamline your messaging with our organized and confidential chat rooms. 
              Enhance teamwork with AI support for brainstorming and troubleshooting, 
              all in a reliable, flexible space that helps your team excel.
            </p>
            <Link 
              href="/auth/login"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>

          {/* Illustration */}
          <div className="flex-1 relative">
            <div className="relative w-full h-96 flex items-center justify-center">
              {/* Floating Shapes */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              
              {/* Center Content */}
              <div className="relative z-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                  <div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                    <div className="h-3 bg-blue-200 dark:bg-blue-800 rounded w-3/4"></div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 ml-8">
                    <div className="h-3 bg-purple-200 dark:bg-purple-800 rounded w-2/3"></div>
                  </div>
                  <div className="bg-pink-50 dark:bg-pink-900/20 rounded-2xl p-4">
                    <div className="h-3 bg-pink-200 dark:bg-pink-800 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>&copy; 2026 Genie. All rights reserved.</p>
        </footer>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
