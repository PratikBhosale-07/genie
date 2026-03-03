const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log("Success! Users:", users);
    } catch (err) {
        console.error("Prisma Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
