import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageCircle, X } from 'lucide-react';
import { AnalysisResult } from '../services/cohereService';
import { useAssessmentStore } from '../store/useStore';
import { questions } from '../data/questions';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatbotProps {
  analysis: AnalysisResult;
}

interface UserResponseData {
  questionId: number;
  answer: string;
  answerText: string;
}

interface UserAssessmentData {
  [key: string]: UserResponseData | string;
  name: string;
  backlogs: string;
  cgpa: string;
}

const RATE_LIMIT_DELAY = 1000; // 1 second between messages

export const Chatbot: React.FC<ChatbotProps> = ({ analysis }) => {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hi! I can help you understand your assessment results better. Feel free to ask any questions about your learning style, strengths, or areas for improvement.',
    timestamp: Date.now()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastMessageTime = useRef<number>(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { responses } = useAssessmentStore();

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Failed to load saved messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }, [messages]);

  // Get user assessment data for personalized responses
  const getUserAssessmentData = (): UserAssessmentData => {
    const userData: UserAssessmentData = {
      name: '',
      backlogs: '0',
      cgpa: '0'
    };
    
    // Extract all responses with their question text
    responses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId);
      if (question) {
        let answerText = response.answer;
        
        // For multiple choice questions, get the text of the selected option
        if (question.type === 'multiple-choice' && question.options) {
          answerText = question.options[response.answer as keyof typeof question.options] || response.answer;
        }
        
        userData[question.text] = {
          questionId: question.id,
          answer: response.answer,
          answerText: answerText
        };
      }
    });
    
    // Add specific fields for common queries
    const nameResponse = responses.find(r => r.questionId === 1);
    const backlogsResponse = responses.find(r => r.questionId === 2);
    const cgpaResponse = responses.find(r => r.questionId === 3);
    
    userData.name = nameResponse?.answer.toString() || '';
    userData.backlogs = backlogsResponse?.answer.toString() || '0';
    userData.cgpa = cgpaResponse?.answer.toString() || '0';
    
    return userData;
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Rate limiting
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime.current;
    if (timeSinceLastMessage < RATE_LIMIT_DELAY) {
      setError('Please wait a moment before sending another message');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setError(null);
    lastMessageTime.current = now;

    const newMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: now
    };
    setMessages(prev => [...prev, newMessage]);

    setIsLoading(true);

    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_COHERE_API_KEY}`,
          'Content-Type': 'application/json',
          'Cohere-Version': '2022-12-06'
        },
        body: JSON.stringify({
          prompt: createChatPrompt(analysis, messages, userMessage, getUserAssessmentData()),
          model: 'command',
          max_tokens: 300,
          temperature: 0.7,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE'
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.generations?.[0]?.text) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.generations[0].text.trim(),
          timestamp: Date.now()
        }]);
      }
    } catch (error) {
      console.error('Failed to get response:', error);
      setError('Failed to get response. Please try again.');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try asking your question again.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Academic Assistant</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

function createChatPrompt(
  analysis: AnalysisResult,
  messages: Message[],
  newMessage: string,
  userData: UserAssessmentData
): string {
  // Format user data for the prompt
  const userDataString = Object.entries(userData)
    .filter(([key]) => !['name', 'backlogs', 'cgpa'].includes(key)) // Filter out the special fields we handle separately
    .map(([question, data]) => {
      if (typeof data === 'object') {
        const answer = data.answerText || data.answer;
        return `Question: ${question}\nAnswer: ${answer}`;
      }
      return '';
    })
    .filter(entry => entry !== '')
    .join('\n\n');

  return `You are an AI academic counselor helping a student understand their assessment results. Here are the student's assessment results and personal information:

Student Name: ${userData.name}
CGPA: ${userData.cgpa}
Active Backlogs: ${userData.backlogs}

Learning Persona: ${analysis.learningPersona}

Strengths:
${analysis.strengths.map(s => `- ${s}`).join('\n')}

Areas for Improvement:
${analysis.areasForImprovement.map(a => `- ${a}`).join('\n')}

Recommendations:
${analysis.recommendations.map(r => `- ${r}`).join('\n')}

Detailed Assessment Responses:
${userDataString}

Previous conversation:
${messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

USER: ${newMessage}

Provide a helpful, personalized response based on the assessment results and the student's specific information. If the student asks about their CGPA, backlogs, strengths, areas for improvement, or any other aspect of their assessment, provide the exact information from their results. Be encouraging and supportive while giving practical advice that relates to their specific situation and responses should be shorter and easy to understand.

A:`;
}