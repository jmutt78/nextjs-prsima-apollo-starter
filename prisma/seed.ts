import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      role: Role.SUPERUSER,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'dave@example.com',
      role: Role.FREE_TRIAL_USER,
    },
  });

  const note1 = await prisma.note.create({
    data: {
      title: 'First Note',
      content: 'This is the first note',
      userId: user1.id,
    },
  });

  const note2 = await prisma.note.create({
    data: {
      title: 'Second Note',
      content: 'This is the second note',
      userId: user2.id,
    },
  });

  const insight1 = await prisma.insight.create({
    data: {
      content: 'This is an insight from the first note',
      noteId: note1.id,
    },
  });

  const insight2 = await prisma.insight.create({
    data: {
      content: 'This is an insight from the second note',
      noteId: note2.id,
    },
  });

  console.log({ user1, user2, note1, note2, insight1, insight2, user3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
