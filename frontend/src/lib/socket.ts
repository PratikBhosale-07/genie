import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class SocketClient {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return this.socket;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error: string) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  // Room events
  joinRoom(roomId: string) {
    this.socket?.emit('joinRoom', { roomId });
  }

  leaveRoom(roomId: string) {
    this.socket?.emit('leaveRoom', { roomId });
  }

  // Message events
  sendMessage(roomId: string, content: string, isToAi = false) {
    this.socket?.emit('message:send', { roomId, content, isToAi });
  }

  // Typing events
  startTyping(roomId: string) {
    this.socket?.emit('typing:start', { roomId });
  }

  stopTyping(roomId: string) {
    this.socket?.emit('typing:stop', { roomId });
  }

  // Listeners
  onNewMessage(callback: (message: any) => void) {
    this.socket?.on('message:new', callback);
  }

  onUserJoin(callback: (data: any) => void) {
    this.socket?.on('user:join', callback);
  }

  onUserLeave(callback: (data: any) => void) {
    this.socket?.on('user:leave', callback);
  }

  onTypingStart(callback: (data: any) => void) {
    this.socket?.on('typing:start', callback);
  }

  onTypingStop(callback: (data: any) => void) {
    this.socket?.on('typing:stop', callback);
  }

  // Remove listeners
  offNewMessage() {
    this.socket?.off('message:new');
  }

  offUserJoin() {
    this.socket?.off('user:join');
  }

  offUserLeave() {
    this.socket?.off('user:leave');
  }

  offTyping() {
    this.socket?.off('typing:start');
    this.socket?.off('typing:stop');
  }
}

export const socketClient = new SocketClient();
