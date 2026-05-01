import { useEffect, useState } from 'react';

class WebSocketsService {
  private socket: WebSocket;

  constructor(connectionString: string, userId: string, token: string) {
    const params = new URLSearchParams({ userId, token });
    this.socket = new WebSocket(`${connectionString}?${params.toString()}`);

    this.socket.addEventListener('open', () => {
      console.log('connection opened');
    });

    this.socket.addEventListener('error', (event) => {
      console.log('there was an error', event);
    });
  }

  public close() {
    this.socket.close();
  }
}

export const useWebSocket = (
  connectionString: string,
  userId: string,
  token: string,
) => {
  const [socket, setSocket] = useState<WebSocketsService | null>(null);

  useEffect(() => {
    setSocket(new WebSocketsService(connectionString, userId, token));

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [userId, token]);

  return socket;
};
