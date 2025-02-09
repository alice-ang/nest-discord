import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'discord.js';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamingService {
  private readonly logger = new Logger(GamingService.name);

  constructor(
    private prisma: PrismaService,
    private client: Client,
  ) {
    setInterval(() => {
      try {
        void this.checkReminders();
      } catch (error) {
        this.logger.error('Failed to check reminders', error);
      }
    }, 60000);
  }

  async setAvailability(data: {
    userId: string;
    guildId: string;
    startTime: Date;
    endTime: Date;
  }) {
    return this.prisma.availability.create({
      data,
    });
  }

  async findCommonTime(guildId: string): Promise<Date[]> {
    const availabilities = await this.prisma.availability.findMany({
      where: { guildId },
    });
    console.log(availabilities);

    if (availabilities.length === 0) {
      return [];
    }

    // Sort availabilities by start time
    const slots = availabilities.sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime(),
    );

    return slots.reduce<Date[]>((commonTimes, currentSlot, index, array) => {
      if (index === 0) return commonTimes;

      const prevSlot = array[index - 1];
      if (currentSlot.startTime <= prevSlot.endTime) {
        const overlapStart = new Date(
          Math.max(
            prevSlot.startTime.getTime(),
            currentSlot.startTime.getTime(),
          ),
        );

        if (
          index === array.length - 1 ||
          array[index + 1].startTime > currentSlot.endTime
        ) {
          commonTimes.push(overlapStart);
        }
      }

      return commonTimes;
    }, []);
  }

  private async checkReminders() {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    const sessionsToRemind = await this.prisma.gameSession.findMany({
      where: {
        scheduledTime: {
          gte: now,
          lte: oneHourFromNow,
        },
        reminded: false,
      },
    });

    for (const session of sessionsToRemind) {
      try {
        const channel = await this.client.channels.fetch(session.guildId);
        if (channel?.isTextBased() && 'send' in channel) {
          const message = await channel.send({
            content: `🎮 Gaming session starting in 1 hour! React with ✅ if you're still available!`,
          });

          await message.react('✅');
          await message.react('❌');

          await this.prisma.gameSession.update({
            where: { id: session.id },
            data: { reminded: true },
          });
        }
      } catch (error) {
        this.logger.error(
          `Failed to send reminder for session ${session.id}`,
          error,
        );
      }
    }
  }
}
