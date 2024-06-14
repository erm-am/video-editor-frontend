import { useRef, useEffect, useCallback } from 'react';
import { webSocketStore } from './web-socket-store';

export function useWebSocket(wsURL, onMessage?, onError?) {
  const { status, open, closed, error } = webSocketStore((state) => state);
  const socketRef = useRef(null);

  function handleError(err) {
    error();
    if (onError) {
      onError(err.message);
    }
  }

  useEffect(() => {
    const socket = new WebSocket(wsURL);
    socketRef.current = socket;
    socketRef.current.onopen = open;
    socketRef.current.onclose = closed;
    socketRef.current.onerror = handleError;

    socketRef.current.onmessage = (message) => {
      if (onMessage) {
        const data = JSON.parse(message.data);
        onMessage(data);
      }
    };
    return () => {
      socketRef.current.onopen = null;
      socketRef.current.onclose = null;
      socketRef.current.onmessage = null;
    };
  }, []);

  const sendMessage = useCallback(
    (message) => {
      if (socketRef.current) {
        socketRef.current.send(JSON.stringify(message));
      }
    },
    [socketRef],
  );
  const closeSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  }, [socketRef]);

  return {
    status,
    closeSocket,
    sendMessage,
  };
}
