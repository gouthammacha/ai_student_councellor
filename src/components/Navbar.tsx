import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, Home, Info, MessageSquare, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { AuthModal } from './AuthModal';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AI Student Counseling</span>
            </div>
            
            <div className="flex items-center space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center space-x-1 text-sm font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`
                }
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </NavLink>
              
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `flex items-center space-x-1 text-sm font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`
                }
              >
                <Info className="w-4 h-4" />
                <span>About Us</span>
              </NavLink>
              
              {user ? (
                <>
                  <NavLink
                    to="/chat"
                    className={({ isActive }) =>
                      `flex items-center space-x-1 text-sm font-medium ${
                        isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                      }`
                    }
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat AI</span>
                  </NavLink>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {user.email}
                    </span>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleAuthClick('signin')}
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />
    </>
  );
};