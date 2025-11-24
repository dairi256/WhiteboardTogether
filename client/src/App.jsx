
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Whiteboard from './components/Whiteboard';

const SERVER_URL = 'http://localhost:3001'; 
const socket = io(SERVER_URL);

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  useEffect(() => {
    socket.on('connect', () => {
      setConnectionStatus('✅ Connected to Server!');
    });
    socket.on('disconnect', () => {
      setConnectionStatus('❌ Disconnected from Server.');
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, overflow: 'hidden' }}>
        {/* Pass the socket instance to the Whiteboard component */}
        <Whiteboard socket={socket} />
        
        {/* Optional status display */}
        <div style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'white', padding: '5px', borderRadius: '5px', zIndex: 10 }}>
            Status: {connectionStatus}
        </div>
    </div>
  );
}

export default App;