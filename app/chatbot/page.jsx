"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useFetch from "@/hooks/use-fetch";
import { getChatResponse } from "@/actions/chatactions";

const formatMessage = (message) => {
  let formattedMessage = message.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-bold">$1</strong>'
  );
  formattedMessage = formattedMessage.replace(/(\.)(\s|$)/g, "$1\n");
  return formattedMessage;
};

const TypingIndicator = () => (
  <div className="flex items-center mb-3 text-gray-400 ">
    <span className="flex space-x-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </span>
  </div>
);

const ChatBubble = ({ message, sender }) => {
  const formattedMessage = formatMessage(message);
  return (
    <div className={`flex items-start mb-3 ${sender === "ai" ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow-md ${
        sender === "ai" ? "bg-slate-700 text-white" : "bg-blue-600 text-white"
      }`}>
        <div className="text-sm" dangerouslySetInnerHTML={{ __html: formattedMessage }} />
      </div>
    </div>
  );
};

const CarChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [messageTimestamps, setMessageTimestamps] = useState([]);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const { loading: isLoading, fn: fetchChat, data: chatResponse, error } = useFetch(getChatResponse);

  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        message:
          "Welcome to the Car Information Portal! I can help you with information about car models, maintenance tips, buying advice, and more. How can I assist you today?",
        sender: "ai",
      },
    ]);
  }, []);

  useEffect(() => {
    if (chatResponse?.response) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), message: chatResponse.response, sender: "ai" },
      ]);
    }
  }, [chatResponse]);

  const formatChatHistory = () => {
    return messages
      .map((msg) => `${msg.sender === "ai" ? "ai(you)" : "user"}: ${msg.message}`)
      .join("\n");
  };

  const handleSendMessage = async () => {
    const currentTime = Date.now();
    const oneMinuteAgo = currentTime - 60000;

    const recentMessages = messageTimestamps.filter(
      (timestamp) => timestamp > oneMinuteAgo
    );

    if (recentMessages.length >= 10) {
      alert("You have reached the limit of 10 messages per minute. Please wait before sending more messages.");
      return;
    }

    setMessageTimestamps([...recentMessages, currentTime]);

    if (userInput.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), message: userInput, sender: "user" },
      ]);

      const chatHistory = formatChatHistory();
      await fetchChat(userInput, chatHistory); // useFetch handles loading and data
      setUserInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (messages.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 px-4 py-8">
      <Card className="w-full max-w-4xl h-[90vh] mx-auto mt-14 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col">
        <CardHeader className="border-b border-slate-700 p-6">
          <CardTitle className="flex items-center gap-3">
            <span className="text-4xl">🚗</span>
            <p className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">
              Car Assistant
            </p>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-grow overflow-hidden flex flex-col">
          <div className="p-4">
            <p className="text-slate-300  text-base">
              Ask me anything about cars, maintenance, buying tips, and more.
            </p>
          </div>

          <div
            ref={chatContainerRef}
            className="bg-slate-800 rounded-lg p-4 flex-grow overflow-y-auto mx-0 sm:mx-4 mb-4"
          >
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.message.replace(/["/]/g, "")}
                sender={msg.sender}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>
        </CardContent>

        <CardFooter className="border-t border-slate-700 p-4">
          <div className="flex w-full gap-2">
            <Input
              type="text"
              className="flex-grow bg-slate-800 border border-slate-600 text-white placeholder:text-slate-400 rounded-lg"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about cars, maintenance, or buying advice..."
            />
            <Button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4"
            >
              Send
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CarChatbot;
