"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** কিছু টিএস শার্ডে `SpeechRecognition` গ্লোবাল নেই — মিনিমাল শেপে ঢাকা */
type WebSpeechReco = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((ev: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onerror: ((ev: { message?: string }) => void) | null;
  onend: (() => void) | null;
};

type WebSpeechCtor = new () => WebSpeechReco;

declare global {
  interface Window {
    webkitSpeechRecognition?: WebSpeechCtor;
    SpeechRecognition?: WebSpeechCtor;
  }
}

export interface SpeechRecFundamentalsApi {
  supported: boolean;
  isListening: boolean;
  transcript: string;
  error: string | null;
  start: (lang?: string) => void;
  stop: () => void;
}

/** ভবিষ্যৎ উচ্চারণ স্কোরিং — এখন ব্রাউজার API খোলা রাখা। */
export function useSpeechRecognitionFundamentals(): SpeechRecFundamentalsApi {
  const [supported] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition);
  });
  const [isListening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<WebSpeechReco | null>(null);

  useEffect(() => {
    return () => {
      try {
        recRef.current?.stop();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      /* ignore */
    }
    recRef.current = null;
    setListening(false);
  }, []);

  const start = useCallback(
    (lang = "ar-SA") => {
      stop();
      setError(null);
      setTranscript("");
      const Ctor = (
        typeof window !== "undefined"
          ? window.SpeechRecognition ?? window.webkitSpeechRecognition
          : undefined
      ) as WebSpeechCtor | undefined;

      if (!Ctor) {
        setError("এই ব্রাউজারে স্পিচ টু টেক্সট নেই");
        return;
      }

      const rec: WebSpeechReco = new Ctor();
      rec.lang = lang;
      rec.continuous = false;
      rec.interimResults = false;

      rec.onresult = (ev) => {
        const list = Array.from(ev.results ?? []);
        const t = list
          .map((chunk) => chunk[0]?.transcript)
          .filter(Boolean)
          .join(" ");
        setTranscript(t.trim());
      };

      rec.onerror = (ev) => {
        setError(ev.message || "listening error");
        setListening(false);
      };

      rec.onend = () => {
        setListening(false);
      };

      try {
        rec.start();
        recRef.current = rec;
        setListening(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    },
    [stop],
  );

  return {
    supported,
    isListening,
    transcript,
    error,
    start,
    stop,
  };
}
