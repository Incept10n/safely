import { useEffect, useState } from 'react';

export type MessageBody = {
  chatId: number;
  content: string;
  senderId: string;
};

export type MessageHandler = (messageBody: MessageBody) => void;

class WebSocketsService {
  private socket: WebSocket;

  constructor(connectionString: string, userId: string, token: string) {
    const params = new URLSearchParams({ userId, token });
    this.socket = new WebSocket(`${connectionString}?${params.toString()}`);

    this.socket.addEventListener('open', () => {});

    this.socket.addEventListener('error', (event) => {
      console.log('there was an error', event);
    });
  }

  public close() {
    this.socket.close();
  }

  public sendMessage(message: string, chatId: string, senderId: string) {
    this.socket.send(
      JSON.stringify({
        content: message,
        chatId: parseInt(chatId),
        senderId: senderId,
      }),
    );
  }

  public onMessageReceive(handler: MessageHandler) {
    this.socket.addEventListener('message', (event) => {
      handler(JSON.parse(event.data));
    });
  }
}

export const useWebSocket = (
  connectionString: string,
  userId: string,
  token: string,
) => {
  const [socketService, setSocketService] = useState<WebSocketsService | null>(
    null,
  );

  useEffect(() => {
    setSocketService(new WebSocketsService(connectionString, userId, token));

    return () => {
      if (socketService) {
        socketService.close();
      }
    };
  }, [userId, token]);

  return socketService;
};
