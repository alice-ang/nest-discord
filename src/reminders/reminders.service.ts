import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Client } from 'discord.js';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    private prisma: PrismaService,
    private client: Client,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkGameReminders() {
    this.logger.debug('Checking game reminders');

    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

    const sessionsToRemind = await this.prisma.gameSession.findMany({
      where: {
        scheduledTime: {
          gte: now,
          lte: thirtyMinutesFromNow,
        },
        reminded: false,
      },
    });

    for (const session of sessionsToRemind) {
      try {
        const channel = await this.client.channels.fetch(
          session.channelId as string,
        );
        if (channel?.isTextBased() && 'send' in channel) {
          const message = await channel.send({
            content: `🎮 Gaming session starting at ${session.scheduledTime.toLocaleString()}! React with ✅ if you're still available!`,
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
