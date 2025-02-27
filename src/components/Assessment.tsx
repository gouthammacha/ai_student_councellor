import React, { useState, useEffect } from 'react';
import { AssessmentQuestion } from './AssessmentQuestion';
import { AssessmentProgress } from './AssessmentProgress';
import { Chatbot } from './Chatbot';
import { useAssessmentStore } from '../store/useStore';
import { questions } from '../data/questions';
import { ChevronLeft, ChevronRight, Loader2, Brain, Trophy, Lightbulb, ArrowUp, User, BookOpen, Award } from 'lucide-react';
import { analyzeResponses, AnalysisResult } from '../services/cohereService';
// import { useAuthStore } from '../store/useAuthStore';

export const Assessment: React.FC = () => {
  const { currentQuestion, nextQuestion, previousQuestion, responses, resetAssessment, setCurrentQuestion } = useAssessmentStore();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  // const { user } = useAuthStore();

  // Clear responses when the component mounts (page refresh)
  useEffect(() => {
    resetAssessment();
  }, [resetAssessment]);

  const validateCGPA = () => {
    if (currentQuestion === 2) { // CGPA question (index 2 for question id 3)
      const cgpaResponse = responses.find(r => r.questionId === 3);
      if (cgpaResponse) {
        const cgpa = parseFloat(cgpaResponse.answer as string);
        if (isNaN(cgpa) || !cgpaResponse.answer.includes('.')) {
          alert('Please enter a valid CGPA with decimal values (e.g., 3.50)');
          return false;
        }
        if (cgpa < 0 || cgpa > 10) {
          alert('CGPA must be between 0.00 and 10.00');
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCGPA()) {
      return;
    }
    nextQuestion();
  };

  const handleSubmit = async () => {
    if (responses.length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setAnalyzing(true);
    try {
      const result = await analyzeResponses(responses);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze responses. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStartNewAssessment = () => {
    // Confirm with the user before starting a new assessment
    if (window.confirm('Are you sure you want to start a new assessment? All your current responses will be cleared.')) {
      resetAssessment();
      setAnalysis(null);
    }
  };

  const getStudentInfo = () => {
    const nameResponse = responses.find(r => r.questionId === 1);
    const backlogsResponse = responses.find(r => r.questionId === 2);
    const cgpaResponse = responses.find(r => r.questionId === 3);

    return {
      name: nameResponse?.answer || '',
      backlogs: backlogsResponse?.answer || '0',
      cgpa: Number(cgpaResponse?.answer || 0).toFixed(2)
    };
  };

  const handleQuestionClick = (index: number) => {
    // If the question has been answered or is the next unanswered question, allow navigation
    const questionId = questions[index].id;
    const isAnswered = responses.some(r => r.questionId === questionId);
    const isNextUnanswered = index === 0 || responses.some(r => r.questionId === questions[index - 1].id);
    
    if (isAnswered || isNextUnanswered) {
      setCurrentQuestion(index);
    } else {
      alert('Please answer the previous questions first.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {!analysis ? (
        <>
          <AssessmentProgress />
          
          {/* Question Navigation */}
          <div className="w-full max-w-2xl mx-auto mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {questions.map((q, index) => {
                const isAnswered = responses.some(r => r.questionId === q.id);
                const isCurrent = currentQuestion === index;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionClick(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                      ${isCurrent 
                        ? 'bg-blue-600 text-white' 
                        : isAnswered 
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>
          
          <AssessmentQuestion question={questions[currentQuestion]} />

          <div className="flex justify-between mt-8 max-w-2xl mx-auto">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={analyzing}
                className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Student Info Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <User className="w-6 h-6 mr-3" />
                Student Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 mr-2" />
                    <span className="text-sm opacity-80">Name</span>
                  </div>
                  <p className="text-lg font-semibold">{getStudentInfo().name}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center mb-2">
                    <BookOpen className="w-5 h-5 mr-2" />
                    <span className="text-sm opacity-80">Active Backlogs</span>
                  </div>
                  <p className="text-lg font-semibold">{getStudentInfo().backlogs}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center mb-2">
                    <Award className="w-5 h-5 mr-2" />
                    <span className="text-sm opacity-80">CGPA</span>
                  </div>
                  <p className="text-lg font-semibold">{getStudentInfo().cgpa}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-white">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <Brain className="w-8 h-8 mr-4" />
                Your Learning Profile Analysis
              </h2>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <p className="text-lg leading-relaxed">{analysis.learningPersona}</p>
              </div>
            </div>

            <div className="p-8 space-y-10">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center">
                  <Trophy className="w-6 h-6 mr-3" />
                  Your Academic Strengths
                </h3>
                <div className="grid gap-6">
                  {analysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start bg-white/80 rounded-lg p-4 shadow-sm">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <p className="ml-4 text-gray-700 leading-relaxed">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-orange-800 mb-6 flex items-center">
                  <ArrowUp className="w-6 h-6 mr-3" />
                  Areas for Growth & Development
                </h3>
                <div className="grid gap-6">
                  {analysis.areasForImprovement.map((area, index) => (
                    <div key={index} className="flex items-start bg-white/80 rounded-lg p-4 shadow-sm">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <p className="ml-4 text-gray-700 leading-relaxed">{area}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-blue-800 mb-6 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-3" />
                  Your Personalized Success Strategy
                </h3>
                <div className="grid gap-6">
                  {analysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start bg-white/80 rounded-lg p-4 shadow-sm">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <p className="ml-4 text-gray-700 leading-relaxed">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleStartNewAssessment}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg shadow-md hover:shadow-lg"
                >
                  Start New Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {analysis && <Chatbot analysis={analysis} />}
    </div>
  );
};