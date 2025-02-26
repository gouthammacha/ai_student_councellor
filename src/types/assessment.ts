export type Answer = 'a' | 'b' | 'c' | 'd' | string;

export interface Question {
  id: number;
  text: string;
  type: 'multiple-choice' | 'text' | 'number';
  options?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
}

export interface AssessmentResponse {
  questionId: number;
  answer: Answer;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  assessments: {
    date: string;
    responses: AssessmentResponse[];
    feedback: string;
    learningPersona: string;
  }[];
}