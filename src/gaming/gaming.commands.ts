import { Injectable } from '@nestjs/common';
import { EmbedBuilder } from 'discord.js';
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
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Some title')
      .setURL('https://discord.js.org/')
      .setAuthor({
        name: 'Some name',
        iconURL: 'https://i.imgur.com/AfFp7pu.png',
        url: 'https://discord.js.org',
      })
      .setDescription('Some description here')
      .setThumbnail('https://i.imgur.com/AfFp7pu.png')
      .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true },
      )
      .addFields({
        name: 'Inline field title',
        value: 'Some value here',
        inline: true,
      })
      .setImage('https://i.imgur.com/AfFp7pu.png')
      .setTimestamp()
      .setFooter({
        text: 'Some footer text here',
        iconURL: 'https://i.imgur.com/AfFp7pu.png',
      });

    return interaction.reply({
      embeds: [embed],
    });
  }
}
