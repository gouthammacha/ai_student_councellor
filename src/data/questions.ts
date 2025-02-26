import { Question } from '../types/assessment';

export const questions: Question[] = [
  {
    id: 1,
    text: "What is your full name?",
    type: 'text'
  },
  {
    id: 2,
    text: "How many active backlogs do you currently have?",
    type: 'number'
  },
  {
    id: 3,
    text: "What is your current CGPA?",
    type: 'number'
  },
  {
    id: 4,
    text: "How often do you attend your classes?",
    type: 'multiple-choice',
    options: {
      a: "Always",
      b: "Sometimes",
      c: "Rarely",
      d: "Almost never"
    }
  },
  {
    id: 5,
    text: "Do you take proper notes in class?",
    type: 'multiple-choice',
    options: {
      a: "Always",
      b: "Sometimes",
      c: "Only before exams",
      d: "Never"
    }
  },
  {
    id: 6,
    text: "What do you do when the teacher is explaining an important concept?",
    type: 'multiple-choice',
    options: {
      a: "Listen attentively and take notes",
      b: "Chat with friends",
      c: "Think about unrelated things",
      d: "Use a mobile phone/social media"
    }
  },
  {
    id: 7,
    text: "How do you prepare for exams?",
    type: 'multiple-choice',
    options: {
      a: "Study daily and revise regularly",
      b: "Start one week before the exam",
      c: "Study only the night before the exam",
      d: "Do not prepare seriously"
    }
  },
  {
    id: 8,
    text: "Do you discuss unnecessary topics during study hours?",
    type: 'multiple-choice',
    options: {
      a: "No, I stay focused",
      b: "Sometimes, when I'm bored",
      c: "Yes, often",
      d: "Always, I enjoy distractions"
    }
  },
  {
    id: 9,
    text: "How often do you skip college without a genuine reason?",
    type: 'multiple-choice',
    options: {
      a: "Never",
      b: "Occasionally",
      c: "Frequently",
      d: "Almost every week"
    }
  },
  {
    id: 10,
    text: "Do you set academic goals and work towards them?",
    type: 'multiple-choice',
    options: {
      a: "Yes, I set goals and follow them",
      b: "I have goals but don't follow them properly",
      c: "I don't set goals at all",
      d: "I don't think about the future"
    }
  },
  {
    id: 11,
    text: "Do you complete your assignments on time?",
    type: 'multiple-choice',
    options: {
      a: "Always",
      b: "Sometimes",
      c: "Only if forced to",
      d: "Never"
    }
  },
  {
    id: 12,
    text: "When studying, do you try to understand concepts deeply or just memorize?",
    type: 'multiple-choice',
    options: {
      a: "I focus on deep understanding",
      b: "I try, but mostly memorize",
      c: "I only memorize without understanding",
      d: "I don't study much"
    }
  },
  {
    id: 13,
    text: "How do you feel about your current academic performance?",
    type: 'multiple-choice',
    options: {
      a: "I'm happy and working hard",
      b: "I need to improve but lack motivation",
      c: "I don't care much about it",
      d: "I am disappointed but don't take action"
    }
  }
];