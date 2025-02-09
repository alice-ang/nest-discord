import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.availability.upsert({
    where: { id: '1' },
    create: {
      userId: '123456789',
      guildId: '1219224502475558922',
      startTime: new Date('2024-02-10 18:00:00'),
      endTime: new Date('2024-02-10 22:00:00'),
    },
    update: {},
  });

  const bob = await prisma.availability.upsert({
    where: { id: '2' },
    update: {},
    create: {
      userId: '987654311',
      guildId: '1219224502475558922',
      startTime: new Date('2024-02-10 20:00:00'),
      endTime: new Date('2024-02-10 23:00:00'),
    },
  });

  await prisma.gameSession.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      guildId: '1219224502475558922',
      scheduledTime: new Date('2024-02-10 21:00:00'),
      participants: ['123456789', '987654311'],
      reminded: false,
    },
  });

  console.log(alice, bob);
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
