import { prisma } from '../prisma.js';
import type { Settings } from '@prisma/client';

export type UpdateSettingsData = Partial<Pick<Settings, 'language' | 'volume' | 'timeout'>>;

export const settingsModel = {
  async get(userId: string): Promise<Settings | null> {
    return prisma.settings.findUnique({ where: { userId } });
  },

  async getOrCreate(userId: string): Promise<Settings> {
    return prisma.settings.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  },

  async update(userId: string, data: UpdateSettingsData): Promise<Settings> {
    return prisma.settings.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  },
};
