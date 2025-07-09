import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useUserRole } from '@/contexts/UserRoleContext';
import {
  Mic,
  MicOff,
  MessageSquare,
  Sparkles,
  X,
  MinusCircle,
  PlusCircle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// AI Assistant State
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AriaSettings {
  voiceEnabled: boolean;
  autoListen: boolean;
  voice: SpeechSynthesisVoice | null;
  volume: number;
  rate: number;
  pitch: number;
}

export default function Aria() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m ARIA, your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AriaSettings>({
    voiceEnabled: true,
    autoListen: false,
    voice: null,
    volume: 1,
    rate: 1,
    pitch: 1
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [location, setLocation] = useLocation();
  const { userRole } = useUserRole();

  // Speech recognition setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Set a default voice (preferably female voice)
      const defaultVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('Samantha'));
      if (defaultVoice) {
        setSettings(prev => ({ ...prev, voice: defaultVoice }));
      } else if (voices.length > 0) {
        setSettings(prev => ({ ...prev, voice: voices[0] }));
      }
    };

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    loadVoices();
    
    // Welcome message
    const welcomeMsg = new SpeechSynthesisUtterance('ARIA is ready to assist you');
    speechSynthesis.speak(welcomeMsg);
    
    return () => {
      // Stop any ongoing speech when component unmounts
      window.speechSynthesis.cancel();
    };
  }, []);

  // Speak text
  const speakText = useCallback((text: string) => {
    if (!settings.voiceEnabled) return;
    
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (settings.voice) utterance.voice = settings.voice;
    utterance.volume = settings.volume;
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    
    window.speechSynthesis.speak(utterance);
  }, [settings]);

  // Handle transcript changes from voice input
  useEffect(() => {
    if (transcript && !inputText) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
      resetTranscript();
    }
  }, [listening, resetTranscript]);

  // Handle voice commands
  const processVoiceCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    
    // Navigation commands
    if (lowerText.includes('go to dashboard') || lowerText.includes('show dashboard')) {
      setLocation('/');
      return "Navigating to dashboard";
    } else if (lowerText.includes('go to social') || lowerText.includes('social media')) {
      setLocation('/social-media-dashboard');
      return "Navigating to social media dashboard";
    } else if (lowerText.includes('go to tools') || lowerText.includes('show tools')) {
      setLocation('/categories');
      return "Navigating to tool categories";
    } else if (lowerText.includes('show password vault') || lowerText.includes('password vault')) {
      setLocation('/password-vault');
      return "Navigating to password vault";
    }
    
    // Entity filters
    if (lowerText.includes('show data for digital merch pros')) {
      // Would update entity filter state here
      return "Showing data for Digital Merch Pros";
    }
    
    // Information requests
    if (lowerText.includes('what\'s my automation score') || lowerText.includes('show automation score')) {
      return "Your current automation score is 72. There are 3 departments with low automation that could be improved.";
    }
    
    // Otherwise, treat as a general query
    return null;
  }, [setLocation]);

  // Process message
  const processMessage = useCallback(async (messageText: string) => {
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    resetTranscript();
    setIsProcessing(true);
    
    // Check for voice commands first
    const commandResponse = processVoiceCommand(messageText);
    
    // Generate AI response
    let responseText = commandResponse;
    if (!responseText) {
      // Default responses for demo - in production, this would call the backend API
      if (messageText.toLowerCase().includes('help')) {
        responseText = "I can help you navigate the system, find information, and answer questions. Try saying 'Go to dashboard' or 'Show automation score'.";
      } else if (messageText.toLowerCase().includes('weather')) {
        responseText = "I'm sorry, I can't access weather information yet. But I can help you with anything related to your business operations!";
      } else {
        responseText = `I'll help you with "${messageText}". What specific information would you like about this?`;
      }
    }
    
    // Delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add assistant response
    const assistantMessage: Message = {
      role: 'assistant',
      content: responseText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsProcessing(false);
    
    // Speak the response
    speakText(responseText);
    
  }, [processVoiceCommand, resetTranscript, speakText]);

  // Send message on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputText.trim()) {
      processMessage(inputText.trim());
    }
  };

  // Render message bubbles
  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === 'user';
    
    return (
      <div key={index} className={cn(
        "flex items-start gap-2 mb-4",
        isUser ? "justify-end" : "justify-start"
      )}>
        {!isUser && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src="/aria-avatar.png" alt="ARIA" />
            <AvatarFallback className="bg-primary text-primary-foreground">AR</AvatarFallback>
          </Avatar>
        )}
        
        <div className={cn(
          "max-w-[80%] rounded-xl p-3",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted rounded-tl-none"
        )}>
          <div className="text-sm">{message.content}</div>
          <div className="text-xs opacity-70 mt-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        {isUser && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  // Main component return
  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-5 right-5 z-50">
        <Sheet open={isExpanded} onOpenChange={setIsExpanded}>
          <SheetTrigger asChild>
            <Button 
              size="lg" 
              className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Sparkles className={cn(
                "h-6 w-6 transition-all text-white",
                isListening && "animate-pulse text-red-200"
              )} />
            </Button>
          </SheetTrigger>
          
          <SheetContent side="right" className="w-full sm:w-[420px] p-0 flex flex-col h-[90vh] rounded-tl-xl rounded-bl-xl">
            <SheetHeader className="p-4 border-b">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="/aria-avatar.png" alt="ARIA" />
                  <AvatarFallback className="bg-primary text-primary-foreground">AR</AvatarFallback>
                </Avatar>
                <div>
                  <SheetTitle className="text-xl">ARIA</SheetTitle>
                  <SheetDescription className="flex items-center">
                    <Badge variant="outline" className={cn(
                      "px-2 py-0 h-5 text-xs",
                      isListening ? "bg-red-500/10 text-red-500 border-red-200" : ""
                    )}>
                      {isListening ? "Listening..." : "AI Assistant"}
                    </Badge>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 ml-2 text-xs"
                      onClick={() => setShowSettings(true)}
                    >
                      Settings
                    </Button>
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>
            
            {/* Message area */}
            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col">
                {messages.map(renderMessage)}
                
                {isProcessing && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground my-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    ARIA is thinking...
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Input area */}
            <div className="p-4 border-t">
              <div className="relative">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message or ask for help..."
                  className="pr-24"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                  <Button
                    variant="ghost" 
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 rounded-full",
                      isListening && "text-red-500"
                    )}
                    onClick={toggleListening}
                    disabled={!browserSupportsSpeechRecognition}
                    title={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full ml-1"
                    onClick={() => inputText.trim() && processMessage(inputText.trim())}
                    disabled={!inputText.trim()}
                    title="Send message"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {transcript && !inputText && (
                <div className="mt-2 text-sm text-muted-foreground italic">
                  {transcript}
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ARIA Assistant Settings</DialogTitle>
            <DialogDescription>
              Customize how ARIA works for you
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <span>Voice Output</span>
              </div>
              <Button
                variant={settings.voiceEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings(prev => ({ ...prev, voiceEnabled: !prev.voiceEnabled }))}
              >
                {settings.voiceEnabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
            
            {settings.voiceEnabled && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Voice</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={settings.voice?.name || ""}
                    onChange={(e) => {
                      const selectedVoice = availableVoices.find(v => v.name === e.target.value);
                      setSettings(prev => ({ ...prev, voice: selectedVoice || null }));
                    }}
                  >
                    {availableVoices.map((voice, i) => (
                      <option key={i} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Volume</label>
                    <span className="text-xs text-muted-foreground">{Math.round(settings.volume * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.volume}
                      onChange={(e) => setSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                      className="flex-1"
                    />
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Speed</label>
                    <span className="text-xs text-muted-foreground">{settings.rate.toFixed(1)}x</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MinusCircle className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={settings.rate}
                      onChange={(e) => setSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                      className="flex-1"
                    />
                    <PlusCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Pitch</label>
                    <span className="text-xs text-muted-foreground">{settings.pitch.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.pitch}
                    onChange={(e) => setSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span>Auto-listen on Open</span>
              </div>
              <Button
                variant={settings.autoListen ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings(prev => ({ ...prev, autoListen: !prev.autoListen }))}
                disabled={!browserSupportsSpeechRecognition}
              >
                {settings.autoListen ? "Enabled" : "Disabled"}
              </Button>
            </div>
            
            {!browserSupportsSpeechRecognition && (
              <Card className="p-3 border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Speech recognition is not supported in your browser. Try using Chrome for the best experience.
                </p>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}