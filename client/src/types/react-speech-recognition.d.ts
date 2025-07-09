declare module 'react-speech-recognition' {
  export interface SpeechRecognitionOptions {
    continuous?: boolean;
    interimResults?: boolean;
    lang?: string;
  }
  
  export interface SpeechRecognitionListenOptions {
    continuous?: boolean;
    language?: string;
  }
  
  export interface SpeechRecognitionProperties {
    transcript: string;
    interimTranscript: string;
    finalTranscript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
    isMicrophoneAvailable: boolean;
  }
  
  export function useSpeechRecognition(options?: any): SpeechRecognitionProperties;
  
  interface SpeechRecognition {
    startListening: (options?: SpeechRecognitionListenOptions) => void;
    stopListening: () => void;
    abortListening: () => void;
    browserSupportsSpeechRecognition: boolean;
    isMicrophoneAvailable: boolean;
  }
  
  const SpeechRecognition: SpeechRecognition;
  export default SpeechRecognition;
}