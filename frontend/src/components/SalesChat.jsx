import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, User, Search, MessageSquare } from 'lucide-react';
import api from '../api';

export default function SalesChat({ customers, currentUserId }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
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

    return () => {
      socketRef.current.disconnect();
    };
  }, [currentUserId]);

  useEffect(() => {
    if (selectedCustomer) {
      api.get(`/messages/${currentUserId}/${selectedCustomer.id}`).then(res => {
        setMessages(res.data);
        scrollToBottom();
      }).catch(err => console.error("Failed to fetch messages", err));
    } else {
      setMessages([]);
    }
  }, [selectedCustomer, currentUserId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedCustomer) return;

    try {
      const res = await api.post('/messages', {
        senderId: currentUserId,
        receiverId: selectedCustomer.id,
        content: inputMessage
      });
      setMessages((prev) => [...prev, res.data]);
      setInputMessage('');
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background border border-primary/10 rounded-2xl overflow-hidden shadow-sm flex h-[500px]">
      {/* Sidebar: Customer List */}
      <div className="w-1/3 border-r border-primary/10 flex flex-col bg-secondary/5">
        <div className="p-4 border-b border-primary/10">
          <h3 className="text-sm font-bold tracking-[0.2em] uppercase mb-4">Inbox</h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-primary/20 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide" data-lenis-prevent>
          {filteredCustomers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-xs text-primary/40 uppercase tracking-widest font-bold">No customers found</p>
            </div>
          ) : (
            filteredCustomers.map(cust => (
              <button
                key={cust.id}
                onClick={() => setSelectedCustomer(cust)}
                className={`w-full flex items-center p-4 border-b border-primary/5 transition-colors text-left ${selectedCustomer?.id === cust.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-secondary/10 border-l-4 border-l-transparent'}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                  <User size={18} className="text-primary/70" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate">{cust.username}</p>
                  <p className="text-xs text-primary/60 truncate">{cust.email}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Area: Chat Window */}
      <div className="w-2/3 flex flex-col bg-background">
        {selectedCustomer ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-primary/10 flex items-center bg-secondary/5">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <User size={18} className="text-primary/70" />
              </div>
              <div>
                <h3 className="font-bold">{selectedCustomer.username}</h3>
                <p className="text-xs text-primary/60">{selectedCustomer.email}</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-4" data-lenis-prevent>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-primary/30">
                  <MessageSquare size={48} className="mb-4 opacity-20" />
                  <p className="text-xs tracking-widest uppercase font-bold">No messages yet</p>
                  <p className="text-[10px] mt-2">Send a message to start the conversation</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-4 text-sm font-light leading-relaxed ${
                        isMe 
                        ? 'bg-foreground text-background rounded-l-2xl rounded-tr-2xl' 
                        : 'bg-secondary/30 dark:bg-white/5 text-foreground rounded-r-2xl rounded-tl-2xl'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-primary/10 bg-secondary/5">
              <form onSubmit={sendMessage} className="flex items-center space-x-3">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..." 
                  className="flex-grow bg-background border border-primary/20 px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="w-12 h-12 flex items-center justify-center bg-foreground text-background rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                  <Send size={18} strokeWidth={1.5} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-primary/20 bg-secondary/5">
            <MessageSquare size={64} className="mb-6 opacity-20" />
            <p className="text-sm tracking-[0.2em] uppercase font-bold">Live Concierge</p>
            <p className="text-xs mt-2 text-primary/40">Select a customer from the inbox to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
