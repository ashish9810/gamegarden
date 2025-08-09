import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (!url) {
      console.log('No WebSocket URL provided, skipping connection');
      return;
    }
    try {
      console.log('Connecting to WebSocket:', url);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        setError(null);
        options.onOpen?.();
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          options.onMessage?.(message);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        options.onClose?.();
      };

      ws.onerror = (event) => {
        console.error('WebSocket connection error:', event);
        setError('WebSocket connection error');
        options.onError?.(event);
      };
    } catch (err) {
      setError('Failed to create WebSocket connection');
    }
  }, [url, options]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }, []);

  useEffect(() => {
    if (!wsRef.current) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    error,
    sendMessage,
    connect,
    disconnect
  };
} 