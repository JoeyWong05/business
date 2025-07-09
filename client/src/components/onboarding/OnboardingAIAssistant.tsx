import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from 'react-speech-recognition';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Sample responses based on common onboarding questions
const assistantResponses: Record<string, string> = {
  'default': "I'm your AI assistant! I can help you set up your workspace, explain features, and answer questions about DMPHQ. What would you like to know?",
  'hello': "Hello! I'm your onboarding assistant. How can I help you today?",
  'help': "I'm here to help! You can ask me about setting up your business profile, connecting tools, inviting team members, or any other feature in DMPHQ.",
  'business profile': "To set up your business profile, go to the Settings menu and click on 'Business Profile'. You can add your business name, logo, industry, and other details there.",
  'shopify': "To connect Shopify, go to the Tools page, click 'Connect New Tool', and select Shopify. You'll need your Shopify API credentials to complete the connection.",
  'tools': "DMPHQ integrates with many popular tools including Shopify, Slack, Google Calendar, Mailchimp, and more. You can connect these in the Tools section of your dashboard.",
  'invite team': "You can invite team members by going to the Team page and clicking 'Invite Team Member'. Enter their email address and select their role. They'll receive an email invitation.",
  'modules': "DMPHQ offers various modules like Sales, Marketing, E-commerce, Legal, and more. You can enable or disable these modules in the Settings menu under 'Modules'.",
  'dashboard': "Your dashboard shows a summary of your business performance. It's customizable - click the 'Customize' button to add or remove widgets based on what matters most to you."
};

// Extract keywords from user input
const findResponseKey = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  for (const key of Object.keys(assistantResponses)) {
    if (key !== 'default' && lowerInput.includes(key.toLowerCase())) {
      return key;
    }
  }
  
  return 'default';
};

export const OnboardingAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Speech recognition setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      if (transcript) {
        setInputValue(transcript);
      }
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  // Send welcome message when the chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          text: assistantResponses.default,
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update input value from transcript
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    resetTranscript();

    // Simulate AI thinking
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responseKey = findResponseKey(userMessage.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: assistantResponses[responseKey],
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
      >
        <Bot className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden max-h-[80vh] flex flex-col">
          <DialogHeader className="px-4 py-2 border-b">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/robot-avatar.png" />
                <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle>AI Onboarding Assistant</DialogTitle>
                <DialogDescription className="text-xs">
                  Ask me anything about setting up your workspace
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 max-w-[85%]",
                    message.sender === 'ai' ? "mr-auto" : "ml-auto flex-row-reverse"
                  )}
                >
                  <Avatar className="h-8 w-8 mt-0.5">
                    {message.sender === 'ai' ? (
                      <>
                        <AvatarImage src="/robot-avatar.png" />
                        <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="/user-avatar.png" />
                        <AvatarFallback className="bg-muted">ME</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm",
                      message.sender === 'ai' ? "bg-muted" : "bg-primary text-primary-foreground"
                    )}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-3 max-w-[85%] mr-auto">
                  <Avatar className="h-8 w-8 mt-0.5">
                    <AvatarImage src="/robot-avatar.png" />
                    <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-3 py-2 text-sm bg-muted flex items-center gap-1">
                    <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                    <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce delay-500"></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1"
              />
              {browserSupportsSpeechRecognition && (
                <Button
                  type="button"
                  variant={listening ? "destructive" : "outline"}
                  size="icon"
                  onClick={toggleListening}
                >
                  {listening ? <X className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            {listening && (
              <div className="text-xs text-muted-foreground mt-2 flex items-center">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Listening...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};