import React, { useState, useEffect } from 'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js';
import ReactDOM from 'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js';
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.2/dist/axios.min.js';
import { jwtDecode } from 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js';

// Pure functions for state transformations
const createMessage = (text, user, timestamp) => ({ id: Date.now(), text, user, timestamp });
const addMessage = (messages, newMessage) => [...messages, newMessage];
const filterMessagesByUser = (messages, user) => messages.filter(m => m.user === user);

// ViewModel
const ChatViewModel = () => {
  const [state, setState] = useState({
    messages: [],
    input: '',
    user: null,
    token: null,
    isAuthenticated: false
  });

  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const { token } = response.data;
      const decoded = jwtDecode(token);
      updateState({ token, user: decoded.username, isAuthenticated: true });
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/messages', {
        headers: { Authorization: `Bearer ${state.token}` }
      });
      updateState({ messages: response.data });
    } catch (error) {
      console.error('Fetch messages failed:', error);
    }
  };

  const sendMessage = async () => {
    if (!state.input.trim()) return;
    const newMessage = createMessage(state.input, state.user, new Date().toISOString());
    try {
      await axios.post('/api/messages', newMessage, {
        headers: { Authorization: `Bearer ${state.token}` }
      });
      updateState({
        messages: addMessage(state.messages, newMessage),
        input: ''
      });
    } catch (error) {
      console.error('Send message failed:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      updateState({ token, user: decoded.username, isAuthenticated: true });
      fetchMessages();
    }
  }, []);

  return { state, login, sendMessage, updateState };
};

// View Components
const Message = ({ message }) => (
  <div className="p-4 m-2 glass rounded-lg transition-transform hover:scale-105">
    <p className="text-sm text-gray-300">{message.user} • {new Date(message.timestamp).toLocaleTimeString()}</p>
    <p className="text-lg">{message.text}</p>
  </div>
);

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 glass rounded-lg w-full max-w-md">
        <h1 className="text-3xl neon-text mb-6">Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-3 mb-4 glass text-white rounded-lg focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 mb-4 glass text-white rounded-lg focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg neon-text hover:from-green-500 hover:to-blue-600 transition-all"
        >
          Login
        </button>
      </div>
    </div>
  );
};

const ChatApp = () => {
  const { state, login, sendMessage, updateState } = ChatViewModel();

  if (!state.isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl neon-text mb-6">Futuristic Chat</h1>
      <div className="h-[70vh] overflow-y-auto mb-4 p-4 glass rounded-lg">
        {state.messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={state.input}
          onChange={e => updateState({ input: e.target.value })}
          placeholder="Type a message..."
          className="flex-1 p-3 glass text-white rounded-lg focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg neon-text hover:from-green-500 hover:to-blue-600 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
};

// Render
ReactDOM.render(<ChatApp />, document.getElementById('root'));