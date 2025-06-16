import { useState, useRef, useEffect } from 'react';
import './ChatbotCss.css';

function ChatbotPage() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem('token');
    const userMessage = { sender: 'You', text: message };
    setChatLog(log => [...log, userMessage]);
    setMessage('');

    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setChatLog(log => [...log, { sender: 'AI', text: data.reply }]);
    } catch (err) {
      setChatLog(log => [...log, { sender: 'AI', text: 'Sorry, there was an error.' }]);
    }
  };

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog]);

  return (
    <div className="chat-bg">
      <div className="chat-card">
        <div className="chat-title">What can I help with?</div>
        <div className="chat-log">
          {chatLog.length === 0 && (
            <div style={{ color: '#888', textAlign: 'center', marginTop: '60px' }}>
              <em>Ask anything to get started...</em>
            </div>
          )}
          {chatLog.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message${msg.sender === 'You' ? ' user' : ''}`}
            >
              <div className="chat-name">{msg.sender}</div>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="chat-input-row">
          <input
            className="chat-input"
            type="text"
            placeholder="Ask anything"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button className="chat-send-btn" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;