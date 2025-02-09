import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamingService {
  private readonly logger = new Logger(GamingService.name);

  constructor(private prisma: PrismaService) {}

  // @On('interactionCreate')
  // public onInteractionCreate(
  //   @Context() [interaction]: ContextOf<'interactionCreate'>,
  // ) {
  //   if (!interaction.isChatInputCommand()) {
  //     return;
  //   }

  //   if (interaction.commandName === 'embed') {
  //     const embed = new EmbedBuilder()
  //       .setTitle('Hello')
  //       .setDescription('World')
  //       .setColor('Random')
  //       .addFields({
  //         name: 'Field title',
  //         value: 'World',
  //         inline: true,
  //       });

  //     return interaction.reply({ embeds: [embed] });
  //   }
  // }

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
}
