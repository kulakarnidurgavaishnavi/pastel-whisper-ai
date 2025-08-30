import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, ArrowLeft, FileText, Copy, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onBack: () => void;
  initialQuery?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBack, initialQuery }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateAIResponse = async (userMessage: string, messageHistory: Message[]): Promise<string> => {
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      `That's a fascinating question! Let me break this down for you. ${userMessage.includes('quantum') ? 'Quantum computing leverages the principles of quantum mechanics to process information in ways that classical computers cannot. Think of it like having a coin that can be heads, tails, or spinning in mid-air all at once - that\'s similar to how quantum bits (qubits) work.' : userMessage.includes('AI') ? 'Artificial Intelligence is rapidly evolving, with large language models like myself becoming more sophisticated. Recent developments include multimodal AI that can understand text, images, and audio, as well as improvements in reasoning capabilities.' : userMessage.includes('climate') ? 'Climate change is having profound effects on our oceans. Rising temperatures lead to thermal expansion of seawater, contributing to sea level rise. Ocean acidification from increased CO2 absorption is also affecting marine ecosystems.' : 'That\'s an interesting topic! Let me share some insights based on current understanding and research.'}`,
      
      `I understand your curiosity about this topic. ${userMessage.includes('meditation') ? 'Meditation offers numerous mental health benefits including reduced stress, improved focus, and better emotional regulation. Regular practice can actually change brain structure, strengthening areas associated with learning and memory while reducing the amygdala\'s stress response.' : userMessage.includes('technology') ? 'Technology continues to shape our world in unprecedented ways. From artificial intelligence to renewable energy solutions, we\'re seeing innovations that could solve some of humanity\'s greatest challenges.' : 'This is definitely worth exploring further. Based on current research and understanding, there are several key aspects to consider.'}`,
      
      `Great question! ${messageHistory.length > 2 ? 'Building on our previous conversation, ' : ''}This touches on some really important concepts. ${userMessage.includes('simple') ? 'Let me explain this in straightforward terms without too much technical jargon.' : 'The complexity here is fascinating when you dive deeper into it.'} Would you like me to elaborate on any particular aspect?`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(text, messages);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation for summarization
      setConversation(prev => prev + `User: ${text}\nAI: ${aiResponse}\n\n`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = () => {
    if (messages.length === 0) {
      toast({
        title: "No conversation to summarize",
        description: "Start a conversation first to generate a summary.",
      });
      return;
    }

    const summary = `**Conversation Summary:**\n\nKey topics discussed: ${messages.slice(0, 3).map(m => m.content.split(' ').slice(0, 5).join(' ')).join(', ')}\n\nMain points:\n- Engaged in thoughtful discussion\n- Explored various concepts and ideas\n- Maintained natural, human-like conversation flow\n\nTotal messages exchanged: ${messages.length}`;
    
    const summaryMessage: Message = {
      id: Date.now().toString(),
      content: summary,
      sender: 'ai',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, summaryMessage]);
    toast({
      title: "Summary generated",
      description: "Conversation summary has been added to the chat.",
    });
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied.",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">PastelAI Chat</h2>
              <p className="text-xs text-muted-foreground">Always ready to help</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSummarize}
            className="rounded-xl"
          >
            <FileText className="h-4 w-4 mr-2" />
            Summarize
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
                <Bot className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Start a conversation</h3>
                <p className="text-muted-foreground">I'm here to chat, answer questions, and help with summaries</p>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-gradient-accent' 
                  : 'bg-gradient-primary'
              }`}>
                {message.sender === 'user' ? (
                  <User className="h-4 w-4 text-accent-foreground" />
                ) : (
                  <Bot className="h-4 w-4 text-primary-foreground" />
                )}
              </div>
              
              <Card className={`flex-1 max-w-[80%] p-4 ${
                message.sender === 'user' 
                  ? 'bg-gradient-accent border-accent/20' 
                  : 'bg-gradient-secondary border-secondary/20'
              }`}>
                <div className="space-y-2">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyMessage(message.content)}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <Card className="p-4 bg-gradient-secondary border-secondary/20">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 rounded-xl border-2 focus:border-primary/50"
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="rounded-xl px-6 bg-gradient-primary hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;