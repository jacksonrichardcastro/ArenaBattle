import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.transaction.deleteMany({});
  await prisma.challenge.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);

  console.log('Seeding MVP users...');
  const user1 = await prisma.user.create({
    data: {
      email: 'alex@example.com',
      username: 'AlexTitan',
      passwordHash,
      walletBalance: 250.00
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'sara@example.com',
      username: 'SaraSnipe',
      passwordHash,
      walletBalance: 15.00
    }
  });

  console.log('Seeding mock challenges...');
  await prisma.challenge.createMany({
    data: [
      { game: 'Madden NFL 24', format: '1v1 MUT', platform: 'PS5', entryFee: 5.00, creatorId: user1.id },
      { game: 'Call of Duty: MW3', format: 'Killrace', platform: 'PC', entryFee: 15.00, creatorId: user2.id },
      { game: 'NBA 2K24', format: 'Play Now', platform: 'Xbox Series X', entryFee: 20.00, creatorId: user1.id },
      { game: 'EA Sports FC 24', format: 'Ultimate Team', platform: 'Crossplay', entryFee: 50.00, creatorId: user2.id },
    ]
  });

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
