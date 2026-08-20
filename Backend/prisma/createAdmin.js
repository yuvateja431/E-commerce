import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
    const hashed = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: { role: 'ADMIN', password: hashed },
        create: {
            email: 'admin@example.com',
            password: hashed,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            isEmailVerified: true
        }
    });
    console.log('Admin account created: admin@example.com / admin123');
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
