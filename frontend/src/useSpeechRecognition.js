import { useMemo, useRef, useState } from 'react';

export function useSpeechRecognition({ lang = 'pt-BR', onResult }) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  const supported = useMemo(() => {
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  function start() {
    if (!supported || isListening) {
      return;
    }

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Recognition();

    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() || '';
      if (transcript && onResult) {
        onResult(transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }

  function stop() {
    if (!recognitionRef.current) {
      return;
    }

    recognitionRef.current.stop();
    setIsListening(false);
  }

  return {
    supported,
    isListening,
    start,
    stop
  };
}
