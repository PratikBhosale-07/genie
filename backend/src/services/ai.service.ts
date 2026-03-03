import { GoogleGenAI } from '@google/genai';
import { prisma } from '../config/prisma';
import { getIO } from '../sockets';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MAX_FREE_MESSAGES = 50;

export const handleAiMessage = async (roomId: string, userId: string, prompt: string) => {
    try {
        const io = getIO();

        // 1. Subscription Checking
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { subscription: true }
        });

        if (!user) throw new Error("User not found");

        const isPro = user.subscription?.plan === 'PRO' && user.subscription?.status === 'ACTIVE';

        if (!isPro) {
            // Check Free Tier Usage
            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const usageCount = await prisma.aIUsageLogs.count({
                where: {
                    userId,
                    createdAt: { gte: startOfMonth }
                }
            });

            if (usageCount >= MAX_FREE_MESSAGES) {
                io.to(`room:${roomId}`).emit('error', 'Free tier AI limit reached for this month.');
                return;
            }
        }

        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) throw new Error("Room not found");

        const recentMessages = await prisma.message.findMany({
            where: { roomId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        const conversationHistory = recentMessages.reverse().map(msg => {
            return `${msg.isAi ? 'AI' : 'User'}: ${msg.content}`;
        }).join('\n');

        let fullContext = "";
        if (room.aiContextSummary) {
            fullContext += `Previous Conversation Summary: ${room.aiContextSummary}\n\n`;
        }

        fullContext += `Recent Messages:\n${conversationHistory}\n\nUser Prompt: ${prompt}`;

        // Select model logic
        const modelToUse = isPro ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

        // Announce AI thinking via socket
        io.to(`room:${roomId}`).emit('ai:thinking', { isThinking: true });

        // Call Gemini
        const response = await ai.models.generateContent({
            model: modelToUse,
            contents: fullContext
        });

        const aiMessageContent = response.text || "Sorry, I couldn't generate a response.";

        // Save AI response to DB
        const finalMessage = await prisma.message.create({
            data: {
                content: aiMessageContent,
                isAi: true,
                roomId,
            }
        });

        // Log AI Usage
        await prisma.aIUsageLogs.create({
            data: {
                userId,
                tokensUsed: 0, // Will log exact tokens if payload exposes it
                modelUsed: modelToUse,
                promptType: 'chat'
            }
        });

        io.to(`room:${roomId}`).emit('ai:thinking', { isThinking: false });
        // Broadcast AI message
        io.to(`room:${roomId}`).emit('message:new', finalMessage);

        // Call summarize job via queue or immediately if batch size reached
        await verifyAndSummarizeContext(roomId);

    } catch (error) {
        console.error("AI Error:", error);
        getIO().to(`room:${roomId}`).emit('ai:thinking', { isThinking: false });
        getIO().to(`room:${roomId}`).emit('error', 'AI Failed to process message.');
    }
};

const verifyAndSummarizeContext = async (roomId: string) => {
    const messageCount = await prisma.message.count({ where: { roomId } });
    if (messageCount > 0 && messageCount % 50 === 0) {
        // Run summarization of last 50 messages + old summary
        console.log(`Triggering AI Context Summarization for Room: ${roomId}`);
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        const recentMessages = await prisma.message.findMany({
            where: { roomId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        const textToSummarize = recentMessages.reverse().map(m => m.content).join('\n');
        const summaryPrompt = `Summarize the following chat history. Keep it concise. Old summary context: ${room?.aiContextSummary || 'None'}\n\nNew messages:\n${textToSummarize}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: summaryPrompt
        });

        if (response.text) {
            await prisma.room.update({
                where: { id: roomId },
                data: { aiContextSummary: response.text }
            });
        }
    }
}
