import { Injectable } from '@nestjs/common';
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';
import { AvailabilityDto } from './availability.dto';
import { GamingService } from './gaming.service';

@Injectable()
export class GamingCommands {
  constructor(private readonly gamingService: GamingService) {}

  @SlashCommand({
    name: 'setavailability',
    description: 'Set your gaming availability',
  })
  async setAvailability(
    @Context() [interaction]: SlashCommandContext,
    @Options() { startTime, endTime }: AvailabilityDto,
  ) {
    await this.gamingService.setAvailability({
      userId: interaction.user.id,
      guildId: interaction.guildId!,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    return interaction.reply({
      content: 'Your availability has been set!',
      ephemeral: true,
    });
  }

  @SlashCommand({
    name: 'findtime',
    description: 'Find common available time for gaming',
  })
  async findTime(@Context() [interaction]: SlashCommandContext) {
    const sessions = await this.gamingService.findCommonTime(
      interaction.guildId!,
    );

    if (!sessions.length) {
      return interaction.reply({
        content: 'No common time slots found!',
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: `Best gaming times:\n${sessions
        .map((time) => `• ${time.toLocaleString()}`)
        .join('\n')}`,
    });
  }
}
