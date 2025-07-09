import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import {
  Bot,
  X,
  Minimize2,
  Maximize2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/contexts/ThemeContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickReplies?: string[];
}

interface PathContext {
  path: string;
  title: string;
  description: string;
  possibleActions: {
    label: string;
    path?: string;
    action?: () => void;
    description?: string;
  }[];
  quickTips: string[];
}

const NavigationGuideBot: React.FC = () => {
  // Auto-open chat for new visitors or based on preferences
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [location] = useLocation();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  const pathContexts: Record<string, PathContext> = {
    '/': {
      path: '/',
      title: 'Dashboard',
      description: 'The dashboard gives you an overview of your business operations across all entities.',
      possibleActions: [
        { 
          label: 'View Business Operations', 
          path: '/business-operations',
          description: 'Manage teams, credentials, and social media'
        },
        { 
          label: 'View Financial Health', 
          path: '/financial-health',
          description: 'Check your expenses, revenue, and financial forecasts'
        },
        { 
          label: 'Explore Categories', 
          path: '/categories',
          description: 'See all business categories and tools'
        },
      ],
      quickTips: [
        'Use the filter dropdown to focus on a specific business entity',
        'The automation score shows how much of your business is automated',
        'Click on any category card to see detailed tools and automation'
      ]
    },
    '/business-operations': {
      path: '/business-operations',
      title: 'Business Operations',
      description: 'Manage your team, credentials, sales channels, and social media.',
      possibleActions: [
        { 
          label: 'Manage Team Members', 
          action: () => document.querySelector('[data-value="team"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true })),
          description: 'Add, edit, or remove team members' 
        },
        { 
          label: 'Manage Social Media', 
          action: () => document.querySelector('[data-value="social"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true })),
          description: 'View and manage social media accounts and posts' 
        },
        { 
          label: 'Track Sales Channels', 
          action: () => document.querySelector('[data-value="sales"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true })),
          description: 'Manage sales channels like Shopify, Amazon, etc.' 
        },
        { 
          label: 'Back to Dashboard', 
          path: '/',
          description: 'Return to the main dashboard' 
        },
      ],
      quickTips: [
        'Switch between tabs to access different operational areas',
        'Filter entity-specific data using the dropdown',
        'Click on a team member or account to view details'
      ]
    },
    '/financial-health': {
      path: '/financial-health',
      title: 'Financial Health',
      description: 'Track expenses, revenue, and financial forecasts for your business.',
      possibleActions: [
        { 
          label: 'View Cost Analysis', 
          path: '/cost-analysis',
          description: 'Analyze your costs by category and entity' 
        },
        { 
          label: 'Check Business Forecast', 
          path: '/business-forecast',
          description: 'See revenue and cost projections' 
        },
        { 
          label: 'Back to Dashboard', 
          path: '/',
          description: 'Return to the main dashboard' 
        },
      ],
      quickTips: [
        'The pie chart shows cost distribution by category',
        'Upcoming bills are sorted by due date',
        'Click on a transaction to see details'
      ]
    },
    '/categories': {
      path: '/categories',
      title: 'Categories Overview',
      description: 'View all business categories and their associated tools.',
      possibleActions: [
        { 
          label: 'Back to Dashboard', 
          path: '/',
          description: 'Return to the main dashboard' 
        },
      ],
      quickTips: [
        'Click on a category to see all tools in that category',
        'The tool count shows how many tools are in your tech stack',
        'The monthly cost shows the total cost for all tools in that category'
      ]
    },
    '/department-automation': {
      path: '/department-automation',
      title: 'Department Automation',
      description: 'Track automation levels across different departments.',
      possibleActions: [
        { 
          label: 'Generate SOP', 
          path: '/generate-sop',
          description: 'Create Standard Operating Procedures' 
        },
        { 
          label: 'Back to Dashboard', 
          path: '/',
          description: 'Return to the main dashboard' 
        },
      ],
      quickTips: [
        'The automation score shows what percentage of tasks are automated',
        'AI-handled processes are fully automated',
        'Hybrid processes combine AI and human interaction'
      ]
    },
  };

  // Add a welcome message when the component mounts
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: generateId(),
        content: "👋 Hi there! I'm your DMPHQ navigation assistant. I can help you find your way around or answer questions about the platform. What would you like to know?",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: [
          "What can I do here?",
          "Show me around",
          "Help me understand this page"
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  // When location changes, offer contextual help
  useEffect(() => {
    if (location && pathContexts[location]) {
      const context = pathContexts[location];
      const contextMessage: Message = {
        id: generateId(),
        content: `📍 You're now on the **${context.title}** page. ${context.description}`,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ["What can I do here?", "Tell me more about this page"]
      };
      
      // Only add a new context message if we've changed locations
      if (messages.length > 0 && !messages.some(m => m.content.includes(`You're now on the **${context.title}**`))) {
        setMessages(prev => [...prev, contextMessage]);
      } else if (messages.length === 0) {
        setMessages([contextMessage]);
      }
    }
  }, [location]);

  const generateId = () => {
    return Math.random().toString(36).substring(2, 11);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: generateId(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Generate a response based on the user's message
    setTimeout(() => {
      const response = generateResponse(inputValue, location);
      setMessages(prev => [...prev, response]);
    }, 500);
  };

  const handleQuickReply = (reply: string) => {
    const userMessage: Message = {
      id: generateId(),
      content: reply,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate a response based on the quick reply
    setTimeout(() => {
      const response = generateResponse(reply, location);
      setMessages(prev => [...prev, response]);
    }, 500);
  };

  const generateResponse = (message: string, currentPath: string): Message => {
    const lowerMessage = message.toLowerCase();
    const context = pathContexts[currentPath] || pathContexts['/'];

    // Page-specific responses
    if (lowerMessage.includes('what can i do here') || lowerMessage.includes('show me around')) {
      return {
        id: generateId(),
        content: `On the ${context.title} page, you can:\n\n${context.possibleActions.map(action => 
          `• **${action.label}** - ${action.description}`).join('\n\n')}`,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ["Show me quick tips", "Go back to dashboard"]
      };
    }

    if (lowerMessage.includes('quick tips') || lowerMessage.includes('tell me more about this page')) {
      return {
        id: generateId(),
        content: `Here are some quick tips for the ${context.title} page:\n\n${context.quickTips.map(tip => 
          `• ${tip}`).join('\n\n')}`,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ["What can I do here?", "Go back to dashboard"]
      };
    }

    if (lowerMessage.includes('go back to dashboard') || lowerMessage.includes('dashboard')) {
      return {
        id: generateId(),
        content: "I can help you navigate to the dashboard. Click the button below:",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ["Take me to dashboard"]
      };
    }

    if (lowerMessage.includes('take me to dashboard')) {
      window.location.href = '/';
      return {
        id: generateId(),
        content: "Taking you to the dashboard...",
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // Navigation-related responses
    if (lowerMessage.includes('lost') || lowerMessage.includes('where am i')) {
      return {
        id: generateId(),
        content: `You're currently on the **${context.title}** page. ${context.description}`,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ["What can I do here?", "Go back to dashboard"]
      };
    }

    // General platform-related responses
    if (lowerMessage.includes('what is dmphq') || lowerMessage.includes('about this platform')) {
      return {
        id: generateId(),
        content: "DMPHQ (Digital Merch Pros Headquarters) is a comprehensive business execution platform that helps streamline your organizational workflows and enhance operational efficiency. It provides tools to manage all aspects of your business across multiple entities.",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ["Show me key features", "How do I get started?"]
      };
    }

    if (lowerMessage.includes('key features') || lowerMessage.includes('what can this platform do')) {
      return {
        id: generateId(),
        content: "DMPHQ offers several key features:\n\n• **Multi-entity Management** - Manage multiple business entities from one dashboard\n\n• **Tool Recommendations** - Get AI-powered tool suggestions for your business needs\n\n• **Cost Tracking** - Monitor expenses across all business categories\n\n• **SOP Generation** - Create and manage standard operating procedures\n\n• **Social Media Management** - Track and manage all your social accounts\n\n• **Automation Scoring** - See how much of your business is automated",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ["How do I get started?", "Tell me about business entities"]
      };
    }

    if (lowerMessage.includes('how do i get started') || lowerMessage.includes('getting started')) {
      return {
        id: generateId(),
        content: "To get started with DMPHQ:\n\n1. First, explore the **Dashboard** to get an overview of your business\n\n2. Check out the **Categories** to see different business functions\n\n3. Visit **Business Operations** to manage your team and tools\n\n4. Use **Financial Health** to track expenses and revenue\n\n5. Try the **Department Automation** page to see what processes can be automated",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ["Take me to dashboard", "Show me categories"]
      };
    }

    if (lowerMessage.includes('business entities') || lowerMessage.includes('companies')) {
      return {
        id: generateId(),
        content: "DMPHQ supports multiple business entities. Currently, the platform includes:\n\n• Digital Merch Pros\n• Mystery Hype\n• Lone Star Custom Clothing\n• Alcoeaze\n• Hide Cafe Bars\n\nYou can filter most views to focus on a specific entity or see data across all entities.",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ["How do I filter by entity?", "Show me the dashboard"]
      };
    }

    if (lowerMessage.includes('filter by entity')) {
      return {
        id: generateId(),
        content: "To filter by business entity:\n\n1. Look for the entity dropdown filter at the top of most pages\n\n2. Select the entity you want to focus on\n\n3. The data will update to show only information related to that entity\n\n4. Select 'All Entities' to see combined data again",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ["What else can I do?", "Show me key features"]
      };
    }

    // Fallback response
    return {
      id: generateId(),
      content: "I'm not sure how to help with that specific question. Would you like to know about what you can do on this page, get general platform information, or navigate somewhere else?",
      sender: 'bot',
      timestamp: new Date(),
      quickReplies: ["What can I do here?", "Tell me about DMPHQ", "Go to dashboard"]
    };
  };

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
          <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm font-medium shadow-md animate-bounce">
            Need help? Ask me! 👋
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-16 h-16 p-0 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <Bot size={28} />
          </Button>
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card className={cn(
          "fixed bottom-4 left-4 w-80 shadow-lg z-50 transition-all duration-200 ease-in-out flex flex-col",
          isMinimized ? "h-14" : "h-[480px]"
        )}>
          <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 border-b bg-primary text-primary-foreground">
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <div className="font-semibold">DMPHQ Guide</div>
              <Badge variant="outline" className="text-xs bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20">
                Friendly Assistant
              </Badge>
            </div>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 hover:bg-primary-foreground/20 text-primary-foreground" 
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 hover:bg-primary-foreground/20 text-primary-foreground" 
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex flex-col",
                        message.sender === 'user' ? "items-end" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3",
                          message.sender === 'user'
                            ? "bg-primary text-primary-foreground"
                            : isDark 
                              ? "bg-secondary" 
                              : "bg-muted"
                        )}
                      >
                        <div className="whitespace-pre-line text-sm" 
                          dangerouslySetInnerHTML={{ 
                            __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                          }}
                        />
                      </div>
                      
                      {message.quickReplies && message.sender === 'bot' && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {message.quickReplies.map((reply, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="cursor-pointer hover:bg-secondary transition-colors"
                              onClick={() => handleQuickReply(reply)}
                            >
                              {reply}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>
              </ScrollArea>

              <CardFooter className="p-3 border-t pt-3">
                <form
                  className="flex w-full items-center space-x-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <Input
                    placeholder="Type a message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" className="h-8 w-8">
                    <ArrowRight size={16} />
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      )}


    </>
  );
};

export default NavigationGuideBot;