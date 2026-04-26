import type { ChatId } from '@/shared/types';

type MessageHandler = (message: OutgoingMessage) => void;

interface IncomingMessage {
  chatId: ChatId;
  content: string;
  senderId: string;
}

interface OutgoingMessage {
  chatId: ChatId;
  content: string;
  senderId: string;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string, token: string) {
    const wsUrl = `ws://localhost:8080/api/ws?userid=${userId}&token=${token}`;

    console.log('Connecting to WebSocket:', wsUrl);

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connected successfully');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      try {
        const message: OutgoingMessage = JSON.parse(event.data);
        this.messageHandlers.forEach((handler) => handler(message));
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          console.log(`Reconnecting... Attempt ${this.reconnectAttempts + 1}`);
          this.reconnectAttempts++;
          this.connect(userId, token);
        }, 3000);
      }
    };
  }

  sendMessage(chatId: ChatId, content: string, senderId: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message: IncomingMessage = { chatId, content, senderId };
      console.log('Sending message:', message);
      this.socket.send(JSON.stringify(message));
    } else {
      console.error(
        'WebSocket is not connected. Ready state:',
        this.socket?.readyState,
      );
    }
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const websocketService = new WebSocketService();
