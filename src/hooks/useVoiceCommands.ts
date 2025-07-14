import { useEffect, useRef, useState } from 'react';

interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

interface UseVoiceCommandsProps {
  commands: VoiceCommand[];
  isListening?: boolean;
}

export const useVoiceCommands = ({ commands, isListening = false }: UseVoiceCommandsProps) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const lastResult = event.results[event.results.length - 1];
          const transcript = lastResult[0].transcript.toLowerCase().trim();
          setTranscript(transcript);

          // Find matching command
          const matchedCommand = commands.find(cmd => 
            transcript.includes(cmd.command.toLowerCase())
          );

          if (matchedCommand) {
            matchedCommand.action();
            // Announce action taken
            speak(`Executing: ${matchedCommand.description}`);
          } else {
            speak('Command not recognized. Try saying "help" for available commands.');
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsActive(false);
        };

        recognitionRef.current.onend = () => {
          setIsActive(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [commands]);

  useEffect(() => {
    if (isListening && isSupported) {
      startListening();
    } else {
      stopListening();
    }
  }, [isListening, isSupported]);

  const startListening = () => {
    if (recognitionRef.current && !isActive) {
      setIsActive(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isActive) {
      recognitionRef.current.stop();
      setIsActive(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return {
    isSupported,
    isActive,
    transcript,
    startListening,
    stopListening,
    speak
  };
};

// Extend window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}