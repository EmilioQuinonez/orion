import { prisma } from '../prisma.js';
import type { Message } from '@prisma/client';
import { HISTORY_PAGE_SIZE, MAX_HISTORY_DAYS } from '../util/constants.js';

export type CreateMessageData = {
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  action?: string;
};

export const messageModel = {
  async create(data: CreateMessageData): Promise<Message> {
    return prisma.message.create({ data });
  },

  async findByUser(
    userId: string,
    page = 1,
    limit = HISTORY_PAGE_SIZE
  ): Promise<{ messages: Message[]; total: number }> {
    const skip = (page - 1) * limit;
    const [messages, total] = await prisma.$transaction([
      prisma.message.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.message.count({ where: { userId } }),
    ]);
    return { messages, total };
  },

  async findById(id: string): Promise<Message | null> {
    return prisma.message.findUnique({ where: { id } });
  },

  async delete(id: string): Promise<void> {
    await prisma.message.delete({ where: { id } });
  },

  async deleteAllByUser(userId: string): Promise<void> {
    await prisma.message.deleteMany({ where: { userId } });
  },

  async findRecent(
    userId: string,
    limit = 10
  ): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
    const messages = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { role: true, content: true },
    });
    return messages.reverse() as Array<{ role: 'user' | 'assistant'; content: string }>;
  },

  async deleteOlderThan(days = MAX_HISTORY_DAYS): Promise<number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const { count } = await prisma.message.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });
    return count;
  },
};
