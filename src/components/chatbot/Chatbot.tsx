"use client"
import { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  XMarkIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
// NOTE: Do not use the Node `@google/generative-ai` SDK in the browser.
// Instead, the frontend should call a backend endpoint that proxies
// requests to Gemini (so the API key remains secret).

type Message = {
  sender: "user" | "bot";
  text: string;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial bot message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "Hello! I'm your Gemini-powered AI assistant. How can I help you today?",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setIsLoading(true);

    try {
      // Call backend proxy which forwards the message to Gemini.
      // Set `NEXT_PUBLIC_CHATBACKEND_URL` in your .env.local if your
      // backend isn't at the default http://localhost:5000.
      const BACKEND_URL = process.env.NEXT_PUBLIC_CHATBACKEND_URL || "http://localhost:5000";

      const resp = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Backend error ${resp.status}: ${text}`);
      }

      const data = await resp.json();
      const botText = data?.reply || "(no reply)";

      setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Error: " + (e?.message || "Something went wrong. Please check the API key and console for details."),
        },
      ]);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-accent text-white rounded-full shadow-xl flex items-center justify-center transition hover:scale-110 z-50 ${
          isOpen ? "hidden" : "block"
        }`}
      >
        <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[calc(100%-3rem)] max-w-sm h-[70vh] max-h-[500px] bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col transition-all duration-300 z-50 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-accent" />
            <h3 className="text-lg font-bold">AI Assistant</h3>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <XMarkIcon className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Chat Body */}
        <div
          ref={chatRef}
          className="flex-1 p-4 overflow-y-auto space-y-4 text-white"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-accent text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 px-4 py-2 rounded-2xl">
                <span className="text-accent animate-pulse">Typing…</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="p-4 border-t border-gray-700">
          <div className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-full pr-12 focus:ring-2 focus:ring-accent outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent w-9 h-9 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-dark transition-colors"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;