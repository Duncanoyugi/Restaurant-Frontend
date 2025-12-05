import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// Remove these imports since we're not using WebSocket for now
// import { io, Socket } from 'socket.io-client';

interface WebSocketContextType {
  socket: any | null;
  isConnected: boolean;
  sendMessage: (type: string, data: any) => void;
  subscribeToEvents: (events: string[], callback: (data: any) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [isConnected] = useState(false);
  const [socket] = useState(null);

  const sendMessage = useCallback((type: string, data: any) => {
    console.log('Mock WebSocket send:', { type, data });
  }, []);

  const subscribeToEvents = useCallback((events: string[]) => {
    console.log('Mock WebSocket subscribe to:', events);
    // Return empty cleanup function
    return () => {};
  }, []);

  const value = {
    socket,
    isConnected,
    sendMessage,
    subscribeToEvents
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};