import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, Sparkles, ArrowRight, BookOpen, Users, Award, BarChart as ChartBar } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { AuthModal } from '../components/AuthModal';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const handleFeatureClick = (feature: 'assessment' | 'chat') => {
    if (user) {
      navigate(`/${feature}`);
    } else {
      setAuthMode('signup');
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div 
        className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(30, 64, 175, 0.95), rgba(30, 64, 175, 0.95)), url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Transform Your Academic Journey</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              Unlock your full potential with our AI-powered academic counseling system.
              Get personalized guidance, insights, and strategies tailored to your unique learning style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleFeatureClick('assessment')}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Start Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={() => handleFeatureClick('chat')}
                className="inline-flex items-center px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold text-lg hover:bg-blue-400 transition-colors duration-200 shadow-lg hover:shadow-xl border border-blue-400"
              >
                Chat with AI
                <Brain className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Images */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose AI Student Counseling?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines advanced AI technology with proven educational strategies to provide
            you with the most effective academic guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
            <img
              src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80"
              alt="Personalized Analysis"
              className="w-full h-48 object-cover"
            />
            <div className="p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Personalized Analysis</h3>
              <p className="text-gray-600">
                Get detailed insights about your learning style, strengths, and areas for improvement
                through our comprehensive AI-powered assessment system.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
            <img
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
              alt="Actionable Recommendations"
              className="w-full h-48 object-cover"
            />
            <div className="p-8">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Actionable Recommendations</h3>
              <p className="text-gray-600">
                Receive practical, personalized suggestions to improve your study habits and academic
                performance based on your assessment results.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
              alt="AI Support"
              className="w-full h-48 object-cover"
            />
            <div className="p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">24/7 AI Support</h3>
              <p className="text-gray-600">
                Access our intelligent chatbot anytime for ongoing guidance and answers to your
                questions about your assessment results and study strategies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits of AI-Powered Guidance</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the advantages of having a personalized AI counselor to support your academic journey.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Improved Learning</h3>
              <p className="text-gray-600">
                Optimize your study techniques based on your personal learning style.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <Users className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Personalized Support</h3>
              <p className="text-gray-600">
                Get guidance tailored to your unique academic needs and goals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <Award className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Better Results</h3>
              <p className="text-gray-600">
                Achieve higher grades through targeted improvement strategies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <ChartBar className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your improvement and adjust strategies as needed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Academic Journey?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Take our assessment now and get personalized recommendations to enhance your learning experience.
            </p>
            <button
              onClick={() => handleFeatureClick('assessment')}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Your Assessment
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />
    </div>
  );
};