import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { prisma } from '../config/prisma';
import jwt from 'jsonwebtoken';
import { handleAiMessage } from '../services/ai.service';

let io: Server;

export const initSockets = async (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Setup Redis Adapter for scaling
    if (process.env.REDIS_URL) {
        const pubClient = new Redis(process.env.REDIS_URL);
        const subClient = pubClient.duplicate();
        io.adapter(createAdapter(pubClient, subClient));
    }

    // Socket Auth Middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('token=')[1];
            if (!token) return next(new Error('Authentication Error'));

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

            if (!user) return next(new Error('Invalid token user'));

            socket.data.user = user;
            next();
        } catch (e) {
            next(new Error('Authentication failed'));
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log(`User connected: ${socket.data.user.email} (${socket.id})`);

        socket.on('joinRoom', async ({ roomId }) => {
            const isMember = await prisma.roomMember.findUnique({
                where: { userId_roomId: { userId: socket.data.user.id, roomId } }
            });

            if (isMember) {
                socket.join(`room:${roomId}`);
                console.log(`${socket.data.user.email} joined room:${roomId}`);
                socket.to(`room:${roomId}`).emit('user:join', { user: socket.data.user });
            } else {
                socket.emit('error', 'Not a member of this room');
            }
        });

        socket.on('leaveRoom', ({ roomId }) => {
            socket.leave(`room:${roomId}`);
            socket.to(`room:${roomId}`).emit('user:leave', { user: socket.data.user });
        });

        socket.on('message:send', async ({ roomId, content, isToAi = false }) => {
            try {
                const message = await prisma.message.create({
                    data: {
                        content,
                        isAi: false,
                        roomId,
                        userId: socket.data.user.id
                    },
                    include: {
                        user: { select: { id: true, name: true, avatarUrl: true } }
                    }
                });

                io.to(`room:${roomId}`).emit('message:new', message);

                if (isToAi || content.toLowerCase().startsWith('@genie')) {
                    const prompt = content.replace(/^@genie\s*/i, '').trim();
                    if (prompt.length > 0) {
                        handleAiMessage(roomId, socket.data.user.id, prompt);
                    }
                }
            } catch (error) {
                socket.emit('error', 'Message send failed');
            }
        });

        socket.on('typing:start', ({ roomId }) => {
            socket.to(`room:${roomId}`).emit('typing:start', { user: socket.data.user });
        });

        socket.on('typing:stop', ({ roomId }) => {
            socket.to(`room:${roomId}`).emit('typing:stop', { user: socket.data.user });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};
