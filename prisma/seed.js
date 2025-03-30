import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isEmailVerified: true
    }
  });

  console.log('Admin user created:', admin);

  // Create sample event
  const event = await prisma.event.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Anniversaire 2025',
      description: 'Une soirée exceptionnelle pour célébrer ensemble. Venez nombreux pour partager ce moment de joie et de convivialité.',
      date: new Date('2025-06-25'),
      startTime: '19:00',
      endTime: '02:00',
      location: 'Salle des Fêtes',
      address: '123 Avenue des Célébrations, Paris'
    }
  });

  console.log('Sample event created:', event);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

