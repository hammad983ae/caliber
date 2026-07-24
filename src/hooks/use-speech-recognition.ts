"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function getRecognitionConstructor() {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

function subscribeNoop() {
  return () => {};
}

export function useSpeechRecognition() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const supported = useSyncExternalStore(
    subscribeNoop,
    () => Boolean(getRecognitionConstructor()),
    () => false,
  );

  useEffect(() => {
    const Recognition = getRecognitionConstructor();
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let combined = "";
      for (let i = 0; i < event.results.length; i++) {
        combined += event.results[i][0].transcript;
      }
      setText(combined);
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === "no-speech") {
        setNotice("Didn't catch that — try again, or just type it instead.");
      } else if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setNotice("Microphone access is blocked. Check your browser's site permissions.");
      } else {
        setNotice("Voice input isn't available right now — you can type instead.");
      }
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
    };
  }, []);

  const toggleMic = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (listening) {
      recognition.stop();
      setListening(false);
      return;
    }

    setNotice(null);
    setText("");
    try {
      recognition.start();
      setListening(true);
    } catch {
      // start() throws if a recognition session is already active; ignore.
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return { text, setText, listening, supported, notice, setNotice, toggleMic, stopListening };
}
