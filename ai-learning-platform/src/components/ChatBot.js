import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatBot.css'; // We'll create this file for styling

const ChatBot = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef(null);
  const MAX_INPUT_LENGTH = 200;

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (input.length > MAX_INPUT_LENGTH) {
      setChat(prev => [...prev, { sender: 'ai', text: `⚠️ Please keep your message under ${MAX_INPUT_LENGTH} characters.` }]);
      return;
    }

    const newChat = [...chat, { sender: 'user', text: input }];
    setChat(newChat);
    setInput('');

    try {
      // Show typing indicator
      setChat([...newChat, { sender: 'ai', text: '...', isTyping: true }]);
      
      const res = await axios.post('http://localhost:3001/api/chat', { message: input })

      const reply = res.data.reply || '⚠️ No response from Gemini.';
      
      // Replace typing indicator with actual response
      setChat(prev => prev.filter(msg => !msg.isTyping).concat({ sender: 'ai', text: reply }));
    } catch (err) {
      console.error(err);
      setChat(prev => prev.filter(msg => !msg.isTyping).concat({ 
        sender: 'ai', 
        text: '⚠️ Error connecting to Gemini API.' 
      }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Auto-scroll to bottom when chat updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
      {!isOpen ? (
        <button className="chat-toggle" onClick={toggleChat}>
          <span className="chat-icon">💬</span>
        </button>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <h3>Gemini AI Assistant</h3>
            <button className="close-button" onClick={toggleChat}>×</button>
          </div>
          <div className="chat-messages" ref={chatContainerRef}>
            {chat.length === 0 && (
              <div className="welcome-message">
                <p>👋 Hi there! I'm your AI learning assistant. Ask me anything to help with your studies.</p>
              </div>
            )}
            {chat.map((msg, i) => (
              <div 
                key={i} 
                className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'} ${msg.isTyping ? 'typing' : ''}`}
              >
                {msg.isTyping ? (
                  <div className="typing-indicator"><span>.</span><span>.</span><span>.</span></div>
                ) : (
                  msg.text
                )}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={chat.some(msg => msg.isTyping)}
            />
            <button 
              onClick={sendMessage} 
              disabled={!input.trim() || chat.some(msg => msg.isTyping)}
            >
              <span className="send-icon">↗️</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;