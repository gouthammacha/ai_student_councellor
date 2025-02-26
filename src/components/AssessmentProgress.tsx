import React from 'react';
import { useAssessmentStore } from '../store/useStore';
import { questions } from '../data/questions';

export const AssessmentProgress: React.FC = () => {
  const { responses } = useAssessmentStore();
  const progress = (responses.length / questions.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};