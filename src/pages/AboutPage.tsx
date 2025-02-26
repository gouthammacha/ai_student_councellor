import React from 'react';
import { BookOpen, Users, Shield, Award, Brain, Target, Sparkles, BarChart as ChartBar } from 'lucide-react';
import { Footer } from '../components/Footer';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Mission Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">About AI Student Counseling</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're dedicated to revolutionizing academic guidance through artificial intelligence,
              providing personalized support to help every student reach their full potential.
            </p>
          </div>

          {/* Values Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Personalized Learning</h3>
              <p className="text-gray-600">
                We believe every student has a unique learning style and needs customized guidance to succeed.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Inclusive Support</h3>
              <p className="text-gray-600">
                Our platform is designed to help students from all backgrounds and academic levels.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Data Privacy</h3>
              <p className="text-gray-600">
                We prioritize the security and confidentiality of student information and assessment data.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive to provide the highest quality academic guidance through advanced AI technology.
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">How Our AI Counseling Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-lg font-semibold mb-2">Take Assessment</h3>
                <p className="text-gray-600">
                  Complete our comprehensive assessment to help us understand your learning style and academic habits.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-lg font-semibold mb-2">Get Analysis</h3>
                <p className="text-gray-600">
                  Receive detailed insights about your strengths and areas for improvement.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-lg font-semibold mb-2">Implement Changes</h3>
                <p className="text-gray-600">
                  Follow personalized recommendations and track your academic progress.
                </p>
              </div>
            </div>
          </div>

          {/* AI Technology Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Our AI Technology</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <Brain className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Advanced Analysis</h3>
                <p className="text-blue-100">
                  Our AI system analyzes multiple factors to understand your unique learning patterns and academic needs.
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <Target className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Personalized Goals</h3>
                <p className="text-blue-100">
                  Set and track academic goals with AI-driven insights tailored to your capabilities.
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <Sparkles className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Smart Recommendations</h3>
                <p className="text-blue-100">
                  Receive intelligent suggestions for improving study habits and academic performance.
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <ChartBar className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
                <p className="text-blue-100">
                  Monitor your improvement with data-driven insights and adjustable strategies.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-8 text-center">Why Choose AI Counseling?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">24/7 Availability</h3>
                  <p className="text-gray-600">
                    Access personalized academic guidance anytime, anywhere. Our AI system is always ready to help you with your academic queries and concerns.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Data-Driven Insights</h3>
                  <p className="text-gray-600">
                    Make informed decisions about your academic journey with insights based on comprehensive data analysis and proven educational strategies.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Personalized Experience</h3>
                  <p className="text-gray-600">
                    Receive guidance tailored to your unique learning style, academic goals, and current performance level.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <ChartBar className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Continuous Improvement</h3>
                  <p className="text-gray-600">
                    Our AI system learns and adapts to provide increasingly relevant and effective guidance as you progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};