import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@automob.app';
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log({ admin });

  // Create Services
  const servicesData = [
    {
      slug: 'preventive-maintenance',
      name: 'Preventive Maintenance',
      description: 'Regular checkups to keep your car running smoothly.',
      price: 99.99,
      duration: 60,
    },
    {
      slug: 'body-repair',
      name: 'Body Repair',
      description: 'Fixing dents, scratches, and other body damages.',
      price: 299.99,
      duration: 180,
    },
    {
      slug: 'car-care',
      name: 'Car Care',
      description: 'Deep cleaning and detailing for your vehicle.',
      price: 149.99,
      duration: 120,
    },
  ];

  for (const s of servicesData) {
    const service = await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
    console.log({ service });
  }
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
