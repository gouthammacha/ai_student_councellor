import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Answer, AssessmentResponse } from '../types/assessment';
import { questions } from '../data/questions';

interface AssessmentStore {
  responses: AssessmentResponse[];
  currentQuestion: number;
  error: string | null;
  setResponse: (questionId: number, answer: Answer) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetAssessment: () => void;
  canProceed: () => boolean;
  setError: (error: string | null) => void;
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set, get) => ({
      responses: [],
      currentQuestion: 0,
      error: null,
      setResponse: (questionId, answer) => {
        try {
          // Validate numeric inputs
          if (questions[questionId - 1].type === 'number') {
            const numValue = Number(answer);
            if (isNaN(numValue)) {
              set({ error: 'Please enter a valid number' });
              return;
            }
            if (questionId === 3) { // CGPA validation
              if (numValue < 0 || numValue > 10) {
                set({ error: 'CGPA must be between 0 and 10' });
                return;
              }
            }
            if (questionId === 2) { // Backlogs validation
              if (numValue < 0) {
                set({ error: 'Number of backlogs cannot be negative' });
                return;
              }
            }
          }

          set((state) => ({
            responses: [
              ...state.responses.filter((r) => r.questionId !== questionId),
              { questionId, answer },
            ],
            error: null,
          }));
        } catch{
          set({ error: 'Failed to save response' });
        }
      },
      nextQuestion: () => {
        const state = get();
        if (state.canProceed() && state.currentQuestion < questions.length - 1) {
          set({ currentQuestion: state.currentQuestion + 1, error: null });
        }
      },
      previousQuestion: () =>
        set((state) => ({
          currentQuestion: Math.max(state.currentQuestion - 1, 0),
          error: null,
        })),
      resetAssessment: () =>
        set({
          responses: [],
          currentQuestion: 0,
          error: null,
        }),
      canProceed: () => {
        const state = get();
        const currentResponse = state.responses.find(
          (r) => r.questionId === questions[state.currentQuestion].id
        );
        return !!currentResponse?.answer;
      },
      setError: (error) => set({ error }),
    }),
    {
      name: 'assessment-store',
      partialize: (state) => ({ responses: state.responses, currentQuestion: state.currentQuestion }),
    }
  )
);