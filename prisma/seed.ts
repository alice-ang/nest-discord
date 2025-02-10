import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.availability.upsert({
    where: { id: '1' },
    create: {
      userId: '123456789',
      guildId: '1219224502475558922',
      startTime: new Date('2025-02-09 17:30:00'),
      endTime: new Date('2025-02-09 18:20:00'),
    },
    update: {},
  });

  await prisma.availability.upsert({
    where: { id: '2' },
    update: {},
    create: {
      userId: '987654311',
      guildId: '1219224502475558922',
      startTime: new Date('2025-02-09 17:30:00'),
      endTime: new Date('2025-02-09 18:20:00'),
    },
  });

  await prisma.gameSession.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      guildId: '1219224502475558922',
      channelId: '1267255360603947018',
      scheduledTime: new Date('2025-02-09 22:45:00'),
      participants: ['123456789', '987654311'],
      reminded: false,
    },
  });

  await prisma.gameSession.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      guildId: '1219224502475558922',
      channelId: '1267255360603947018',
      scheduledTime: new Date('2025-02-09 22:40:00'),
      participants: ['123456789', '987654311'],
      reminded: false,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
