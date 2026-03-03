'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { roomAPI, chatAPI, authAPI } from '@/lib/api';
import { socketClient } from '@/lib/socket';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface Room {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
}

interface Message {
  id: string;
  content: string;
  isAi: boolean;
  createdAt: string;
  user?: User;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    setUser(JSON.parse(userData));
    loadRooms();
    
    // Connect socket
    socketClient.connect(token);

    return () => {
      socketClient.disconnect();
    };
  }, [router]);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id);
      socketClient.joinRoom(selectedRoom.id);

      // Setup socket listeners
      socketClient.onNewMessage((message) => {
        setMessages((prev) => [...prev, message]);
      });

      socketClient.onTypingStart((data) => {
        setTypingUsers((prev) => new Set(prev).add(data.user.name));
      });

      socketClient.onTypingStop((data) => {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(data.user.name);
          return next;
        });
      });

      return () => {
        socketClient.leaveRoom(selectedRoom.id);
        socketClient.offNewMessage();
        socketClient.offTyping();
      };
    }
  }, [selectedRoom]);

  const loadRooms = async () => {
    try {
      const data = await roomAPI.getUserRooms();
      setRooms(data.rooms);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load rooms:', error);
      setLoading(false);
    }
  };

  const loadMessages = async (roomId: string) => {
    try {
      const data = await chatAPI.getRoomMessages(roomId);
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const data = await roomAPI.createRoom(newRoomName);
      setRooms([...rooms, data.room]);
      setNewRoomName('');
      setShowCreateRoom(false);
      setSelectedRoom(data.room);
    } catch (error: any) {
      alert(error.message || 'Failed to create room');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedRoom) return;

    const isAiMessage = messageInput.toLowerCase().startsWith('@genie');
    socketClient.sendMessage(selectedRoom.id, messageInput, isAiMessage);
    setMessageInput('');
    socketClient.stopTyping(selectedRoom.id);
  };

  const handleTyping = () => {
    if (selectedRoom) {
      socketClient.startTyping(selectedRoom.id);
      setTimeout(() => socketClient.stopTyping(selectedRoom.id), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    socketClient.disconnect();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                G
              </div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Genie</h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            >
              Logout
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {user?.name}
          </div>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">Rooms</h2>
              <button
                onClick={() => setShowCreateRoom(true)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                + New
              </button>
            </div>

            {showCreateRoom && (
              <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <input
                  type="text"
                  placeholder="Room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-3 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateRoom}
                    className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowCreateRoom(false)}
                    className="flex-1 px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white text-sm rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedRoom?.id === room.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <div className="font-medium">{room.name}</div>
                  {room.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {room.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{selectedRoom.name}</h2>
              {selectedRoom.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedRoom.description}</p>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.user?.id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-2xl ${
                      message.isAi
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : message.user?.id === user?.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
                    }`}
                  >
                    {!message.isAi && message.user?.id !== user?.id && (
                      <div className="text-xs font-semibold mb-1 opacity-75">{message.user?.name}</div>
                    )}
                    {message.isAi && (
                      <div className="text-xs font-semibold mb-1 opacity-90">🤖 Genie AI</div>
                    )}
                    <div>{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {typingUsers.size > 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => {
                    setMessageInput(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Type a message... (use @genie for AI)"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  Send
                </button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Use @genie to ask the AI assistant
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                G
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Welcome to Genie</h2>
              <p className="text-gray-600 dark:text-gray-400">Select a room to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
