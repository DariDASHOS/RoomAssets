import { PrismaClient } from './src/generated/prisma/client.js'; // важно .js в конце

const prisma = new PrismaClient({} as any);

async function main() {
  const rooms = await prisma.room.findMany();
  const assets = await prisma.asset.findMany();
  const bookings = await prisma.booking.findMany();

  console.log('Rooms:', rooms);
  console.log('Assets:', assets);
  console.log('Bookings:', bookings);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
