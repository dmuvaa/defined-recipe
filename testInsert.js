// testInsert.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Define the current date and time for the startDate
  const startDate = new Date(); // This will use the current date and time

  // Set an endDate, e.g., 12 months later
  const endDate = new Date();
  endDate.setMonth(startDate.getMonth() + 12);

  // Create a new user
  const newUser = await prisma.user.create({
    data: {
      id: '9610cd3c-4e74-490d-5d25-b5686545af03', // Ensure the UUID is correct
      email: 'dmuvaa70@gmail.com',
      firstName: 'Dennis',
      lastName: 'Muvaa',
    },
  });
  console.log('New User:', newUser);

  // Create a new subscription for the user
  const newSubscription = await prisma.subscription.create({
    data: {
      userId: newUser.id,
      plan: 'premium',
      startDate: startDate,
      endDate: endDate,
      status: 'active',
    },
  });
  console.log('New Subscription:', newSubscription);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    setTimeout(() => process.exit(0), 1000); // Add delay before exiting to ensure cleanup
  });
