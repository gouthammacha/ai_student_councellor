import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageCircle, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatAIPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hi! I\'m your AI academic counselor. I can help you with questions about our assessment process, study techniques, or general academic guidance. How can I assist you today?'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
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
          prompt: createGeneralChatPrompt(messages, userMessage),
          model: 'command',
          max_tokens: 300,
          temperature: 0.7,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE'
        }),
      });

      const data = await response.json();
      if (data.generations?.[0]?.text) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.generations[0].text.trim()
        }]);
      }
    } catch (error) {
      console.error('Failed to get response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try asking your question again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center space-x-4">
          <MessageCircle className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">AI Academic Counselor</h1>
            <p className="text-sm text-gray-500">Your personal guide to academic success</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-[calc(100vh-73px)]">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`px-4 py-6 ${
                  message.role === 'assistant' ? 'bg-white border-b border-gray-100' : 'bg-gray-50'
                }`}
              >
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    {message.role === 'assistant' ? (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-blue-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-sm text-gray-900">
                      {message.role === 'assistant' ? 'AI Counselor' : 'You'}
                    </p>
                    <div className="prose prose-blue">
                      <p className="text-gray-700">{message.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="px-4 py-6 bg-white border-b border-gray-100">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form - Fixed to bottom */}
        <div className="border-t border-gray-200 bg-white sticky bottom-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <form onSubmit={sendMessage}>
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center">
                Press Enter to send your message
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

function createGeneralChatPrompt(messages: { role: string; content: string }[], newMessage: string): string {
  return `You are an AI academic counselor specializing in helping students improve their academic performance and study habits. Your responses should be helpful, encouraging, and focused on providing practical advice. You can help with:

1. Questions about the assessment process
2. Study techniques and time management
3. Academic motivation and goal setting
4. Learning strategies
5. General academic guidance

Previous conversation:
${messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

USER: ${newMessage}

Provide a helpful, encouraging response that includes specific advice or information when applicable. Keep the tone professional but friendly.

A:`;
}