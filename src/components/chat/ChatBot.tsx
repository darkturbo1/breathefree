import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/types/smoking';

interface ChatBotProps {
  onClose: () => void;
}

const smokingResponses: Record<string, string> = {
  craving: `I understand cravings can be intense. Here are some quick tips:

🧘 **Deep breathing**: Take 10 slow, deep breaths
💧 **Drink water**: Stay hydrated, it helps reduce cravings
🚶 **Take a walk**: Even 5 minutes can help
🍎 **Healthy snack**: Try crunchy vegetables or fruits
⏰ **Wait it out**: Cravings usually pass in 3-5 minutes

You've got this! Every craving you overcome makes you stronger.`,

  motivation: `Remember why you started this journey! Here's what you're gaining:

❤️ Your heart is getting healthier every day
💰 You're saving money for things that matter
🏃 Your energy levels are increasing
👨‍👩‍👧‍👦 You're setting an example for loved ones
🌟 You're proving to yourself that you CAN do this

Every smoke-free moment is a victory. Be proud of yourself!`,

  withdrawal: `Withdrawal symptoms are temporary signs that your body is healing. Common symptoms include:

😤 Irritability - Try relaxation techniques
😴 Sleep changes - Maintain a regular schedule
🤔 Difficulty concentrating - Take breaks, stay hydrated
🍽️ Increased appetite - Keep healthy snacks nearby
😟 Anxiety - Exercise and deep breathing help

These symptoms typically peak in the first 3 days and improve significantly after 2 weeks. You're doing great!`,

  relapse: `A slip doesn't erase your progress! Here's what to do:

1. **Don't give up** - One cigarette doesn't mean failure
2. **Learn from it** - What triggered the slip?
3. **Reset immediately** - You can start fresh right now
4. **Reach out** - Talk to someone supportive
5. **Review your reasons** - Why do you want to quit?

Many successful quitters had slips along the way. What matters is that you keep trying!`,

  benefits: `Here's what happens when you quit smoking:

⏱️ **20 minutes**: Heart rate drops
⏱️ **8 hours**: Oxygen levels normalize
⏱️ **24 hours**: Heart attack risk decreases
⏱️ **48 hours**: Nicotine leaves your body
⏱️ **72 hours**: Breathing becomes easier
⏱️ **2 weeks**: Circulation improves
⏱️ **1 month**: Lung function increases 30%
⏱️ **1 year**: Heart disease risk halved

Every moment smoke-free counts!`,
};

const defaultResponses = [
  "I'm here to help you with your smoke-free journey! You can ask me about cravings, motivation, withdrawal symptoms, or the benefits of quitting.",
  "That's a great question about your health journey! Remember, every step forward matters, no matter how small.",
  "I understand this journey can be challenging. Would you like some tips on handling cravings or staying motivated?",
];

function getResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('craving') || lowerMessage.includes('urge') || lowerMessage.includes('want to smoke')) {
    return smokingResponses.craving;
  }
  if (lowerMessage.includes('motivat') || lowerMessage.includes('why') || lowerMessage.includes('reason')) {
    return smokingResponses.motivation;
  }
  if (lowerMessage.includes('withdrawal') || lowerMessage.includes('symptom') || lowerMessage.includes('feeling bad')) {
    return smokingResponses.withdrawal;
  }
  if (lowerMessage.includes('relapse') || lowerMessage.includes('slip') || lowerMessage.includes('smoked') || lowerMessage.includes('failed')) {
    return smokingResponses.relapse;
  }
  if (lowerMessage.includes('benefit') || lowerMessage.includes('health') || lowerMessage.includes('happen')) {
    return smokingResponses.benefits;
  }

  const smokingKeywords = ['smoke', 'cigarette', 'nicotine', 'quit', 'tobacco', 'lung', 'cough', 'breath'];
  const isSmokingRelated = smokingKeywords.some(keyword => lowerMessage.includes(keyword));

  if (!isSmokingRelated && message.length > 10) {
    return "I'm specialized in helping with smoking cessation. I can answer questions about cravings, motivation, withdrawal symptoms, health benefits of quitting, and tips for staying smoke-free. How can I help with your quit journey?";
  }

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your smoke-free companion 🌟 I'm here to help you with cravings, motivation, or any questions about your quit journey. How can I support you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(userMessage.content);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const quickReplies = [
    "I'm having a craving",
    "Need motivation",
    "What are the benefits?",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel-strong w-full max-w-md h-[85vh] sm:h-[650px] flex flex-col animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Quit Coach</h2>
              <p className="text-xs text-muted-foreground">Here to help 24/7</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="tap-scale">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-lg'
                    : 'bg-secondary rounded-tl-lg'
                }`}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-tl-lg px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length < 3 && (
          <div className="px-5 pb-3">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => setInput(reply)}
                  className="flex-shrink-0 px-4 py-2.5 rounded-full bg-secondary text-sm font-medium hover:bg-accent transition-colors tap-scale"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-5 border-t border-border/50">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 glass-input text-sm outline-none"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="rounded-xl h-[52px] w-[52px]"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
