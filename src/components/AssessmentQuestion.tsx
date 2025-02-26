import React from 'react';
import { Question, Answer } from '../types/assessment';
import { useAssessmentStore } from '../store/useStore';
import { Radio } from 'lucide-react';

interface Props {
  question: Question;
}

export const AssessmentQuestion: React.FC<Props> = ({ question }) => {
  const { responses, setResponse } = useAssessmentStore();
  const currentResponse = responses.find((r) => r.questionId === question.id);

  const handleAnswer = (answer: Answer) => {
    setResponse(question.id, answer);
  };

  if (question.type === 'text') {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          Question {question.id}: {question.text}
        </h3>
        <input
          type="text"
          value={currentResponse?.answer as string || ''}
          onChange={(e) => handleAnswer(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your answer..."
        />
      </div>
    );
  }

  if (question.type === 'number') {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          Question {question.id}: {question.text}
        </h3>
        <input
          type={question.id === 3 ? "text" : "number"}
          value={currentResponse?.answer as string || ''}
          onChange={(e) => handleAnswer(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          step={question.id === 3 ? "0.01" : "1"}
          min="0"
          placeholder={question.id === 3 ? "Enter CGPA (e.g., 3.50)" : "Enter your answer..."}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">
        Question {question.id}: {question.text}
      </h3>
      <div className="space-y-4">
        {question.options && (Object.entries(question.options) as [Answer, string][]).map(([key, value]) => (
          <label
            key={key}
            className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
              currentResponse?.answer === key
                ? 'bg-blue-50 border-blue-500 border'
                : 'border hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center h-5">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={key}
                checked={currentResponse?.answer === key}
                onChange={() => handleAnswer(key)}
                className="hidden"
              />
              <Radio
                className={`w-4 h-4 ${
                  currentResponse?.answer === key ? 'text-blue-600' : 'text-gray-400'
                }`}
              />
            </div>
            <span className="ml-3 text-gray-700">{value}</span>
          </label>
        ))}
      </div>
    </div>
  );
};