import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { RemindersService } from './reminders.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [RemindersService, PrismaService],
})
export class RemindersModule {}
