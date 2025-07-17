const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Hash the admin password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@futuresats.io' },
      update: {
        role: 'ADMIN',
        name: 'Admin User',
        password: hashedPassword,
      },
      create: {
        email: 'admin@futuresats.io',
        name: 'Admin User',
        role: 'ADMIN',
        password: hashedPassword,
        isPro: true,
        planCount: 0,
      },
    });

    console.log('Admin user created/updated:', adminUser);
    console.log('Admin credentials:');
    console.log('Email: admin@futuresats.io');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 