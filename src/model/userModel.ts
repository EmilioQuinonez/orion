import { prisma } from '../prisma.js';
import type { User } from '@prisma/client';

export type CreateUserData = {
  id?: string;
  name: string;
  role?: string;
};

export type UpdateUserData = Partial<Pick<User, 'name' | 'role' | 'voiceProfile'>>;

export const userModel = {
  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({
      data: {
        id: data.id,
        name: data.name,
        role: data.role ?? 'user',
      },
    });
  },

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
  },

  async update(id: string, data: UpdateUserData): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  },

  async upsert(id: string, name: string, role = 'user'): Promise<User> {
    return prisma.user.upsert({
      where: { id },
      create: { id, name, role },
      update: {},
    });
  },
};
