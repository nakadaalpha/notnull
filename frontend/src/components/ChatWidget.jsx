import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { MessageCircle, X, Send, User } from 'lucide-react';
import api from '../api';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  
  // For demo purposes, we assume the current user is logged in with ID 1 (the migrated customer)
  const currentUserId = 1; 
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to Socket
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join', currentUserId);

    socketRef.current.on('new_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    // Fetch sales agents
    api.get('/messages/sales/agents').then(res => {
      setAgents(res.data);
    }).catch(err => console.error("Failed to fetch agents", err));

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      api.get(`/messages/${currentUserId}/${selectedAgent.id}`).then(res => {
        setMessages(res.data);
        scrollToBottom();
      });
    }
  }, [selectedAgent]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedAgent) return;

    try {
      const res = await api.post('/messages', {
        senderId: currentUserId,
        receiverId: selectedAgent.id,
        content: inputMessage
      });
      setMessages((prev) => [...prev, res.data]);
      setInputMessage('');
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] h-[500px] mb-4 bg-background/95 backdrop-blur-3xl border border-primary/20 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 border-b border-primary/10 flex justify-between items-center bg-secondary/10">
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase">Live Concierge</h3>
              <p className="text-[10px] text-primary/50 tracking-widest uppercase mt-1">
                {selectedAgent ? `Chatting with ${selectedAgent.username}` : 'Select an agent'}
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-primary/50 hover:text-primary transition-colors">
              <X size={20} strokeWidth={1} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-grow overflow-y-auto p-4 scrollbar-hide flex flex-col space-y-4">
            {!selectedAgent ? (
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <p className="text-xs font-light tracking-widest text-primary/60 text-center uppercase">
                  Available Concierges
                </p>
                <div className="w-full space-y-2">
                  {agents.map(agent => (
                    <button 
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent)}
                      className="w-full flex items-center p-3 border border-primary/10 hover:border-primary/40 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <User size={14} className="text-primary/70" />
                      </div>
                      <span className="text-sm font-light tracking-wide">{agent.username}</span>
                    </button>
                  ))}
                  {agents.length === 0 && (
                    <p className="text-[10px] text-center text-primary/40 uppercase">No agents online</p>
                  )}
                </div>
              </div>
            ) : (
              <>
                {messages.length === 0 && (
                  <p className="text-center text-[10px] text-primary/40 tracking-widest uppercase my-auto">
                    Start the conversation
                  </p>
                )}
                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 text-sm font-light leading-relaxed ${
                        isMe 
                        ? 'bg-foreground text-background rounded-l-2xl rounded-tr-2xl' 
                        : 'bg-secondary/20 dark:bg-white/10 text-foreground rounded-r-2xl rounded-tl-2xl'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          {selectedAgent && (
            <div className="p-3 border-t border-primary/10 bg-background">
              <form onSubmit={sendMessage} className="flex items-center space-x-2">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..." 
                  className="flex-grow bg-transparent border border-primary/20 px-4 py-2 text-sm font-light focus:outline-none focus:border-primary transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="w-10 h-10 flex items-center justify-center bg-foreground text-background disabled:opacity-50 hover:opacity-80 transition-opacity"
                >
                  <Send size={16} strokeWidth={1} />
                </button>
              </form>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="w-full text-center text-[10px] uppercase tracking-widest text-primary/40 mt-3 hover:text-primary transition-colors"
              >
                Back to Agent List
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-foreground text-background flex items-center justify-center rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
      >
        {isOpen ? <X size={24} strokeWidth={1} /> : <MessageCircle size={24} strokeWidth={1.5} />}
      </button>
    </div>
  );
}
