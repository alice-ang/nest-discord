import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IntentsBitField } from 'discord.js';
import { NecordModule } from 'necord';
import { AppCommands } from './app.commands';
import { AppService } from './app.service';
import { CatsCommands } from './cats.commands';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NecordModule.forRootAsync({
      useFactory: () => ({
        token: process.env.DISCORD_TOKEN as string,
        intents: [
          IntentsBitField.Flags.Guilds,
          IntentsBitField.Flags.GuildMessages,
        ],
        development: [process.env.DISCORD_DEVELOPMENT_GUILD_ID as string],
      }),
    }),
  ],
  providers: [AppService, AppCommands, CatsCommands],
})
export class AppModule {}
