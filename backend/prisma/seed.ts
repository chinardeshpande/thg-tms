import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@thgtms.com' },
    update: {},
    create: {
      email: 'admin@thgtms.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1 (555) 000-0001',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create logistics manager
  const manager = await prisma.user.upsert({
    where: { email: 'manager@thgtms.com' },
    update: {},
    create: {
      email: 'manager@thgtms.com',
      password: hashedPassword,
      firstName: 'Logistics',
      lastName: 'Manager',
      phone: '+1 (555) 000-0002',
      role: 'LOGISTICS_MANAGER',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created logistics manager:', manager.email);

  // Create fleet manager
  const fleetManager = await prisma.user.upsert({
    where: { email: 'fleet@thgtms.com' },
    update: {},
    create: {
      email: 'fleet@thgtms.com',
      password: hashedPassword,
      firstName: 'Fleet',
      lastName: 'Manager',
      phone: '+1 (555) 000-0003',
      role: 'FLEET_MANAGER',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created fleet manager:', fleetManager.email);

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@thgtms.com' },
    update: {},
    create: {
      email: 'test@thgtms.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      phone: '+1 (555) 000-0004',
      role: 'CLIENT_USER',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created test user:', testUser.email);

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:');
  console.log('  Email: admin@thgtms.com');
  console.log('  Password: password123');
  console.log('');
  console.log('Logistics Manager:');
  console.log('  Email: manager@thgtms.com');
  console.log('  Password: password123');
  console.log('');
  console.log('Fleet Manager:');
  console.log('  Email: fleet@thgtms.com');
  console.log('  Password: password123');
  console.log('');
  console.log('Test User:');
  console.log('  Email: test@thgtms.com');
  console.log('  Password: password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
