import React, { useState, useEffect } from 'react';
import { X, Mail, LogIn, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { signIn, signUp, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Reset form and set initial mode when modal is opened
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError(null);
      setPasswordErrors([]);
      setShowConfirmation(false);
    }
  }, [isOpen, defaultMode]);

  // Handle successful authentication
  useEffect(() => {
    if (user && isOpen) {
      const destination = location.state?.from?.pathname || '/';
      onClose();
      navigate(destination);
    }
  }, [user, isOpen, navigate, location.state, onClose]);

  if (!isOpen) return null;

  const validatePassword = (value: string) => {
    try {
      passwordSchema.parse(value);
      setPasswordErrors([]);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPasswordErrors(error.errors.map(e => e.message));
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!validatePassword(password)) {
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!name.trim()) {
        setError('Name is required');
        return;
      }
    }

    try {
      const { error: authError } = await (mode === 'signin' 
        ? signIn(email, password) 
        : signUp(email, password)
      );

      if (authError) {
        setError(authError.message);
      } else if (mode === 'signup') {
        setShowConfirmation(true);
      }
    } catch{
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleModeSwitch = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
    setPasswordErrors([]);
    setName('');
    setPassword('');
    setConfirmPassword('');
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a confirmation link to <strong>{email}</strong>. Please check your email and click the link to verify your account.
            </p>
            <button
              onClick={() => {
                setShowConfirmation(false);
                onClose();
              }}
              className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {mode === 'signin' ? (
              <LogIn className="w-8 h-8 text-blue-600" />
            ) : (
              <UserPlus className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600 mt-2">
            {mode === 'signin'
              ? 'Sign in to access your personalized academic guidance'
              : 'Join us to start your journey to academic success'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (mode === 'signup') {
                  validatePassword(e.target.value);
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {mode === 'signup' && passwordErrors.length > 0 && (
            <div className="text-sm text-red-600 space-y-1">
              {passwordErrors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 mt-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors"
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleModeSwitch}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {mode === 'signin'
              ? "Don't have an account? Register"
              : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};