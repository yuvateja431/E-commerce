import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin431@gmail.com";
  const password = "Admin431@";
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findFirst({
    where: { role: Role.ADMIN }
  });

  if (existingAdmin) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        email,
        password: hashedPassword
      }
    });
    console.log("Updated existing admin user credentials.");
  } else {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          role: Role.ADMIN
        }
      });
      console.log("Updated existing user to admin with new credentials.");
    } else {
      await prisma.user.create({
        data: {
          firstName: "Super",
          lastName: "Admin",
          email,
          password: hashedPassword,
          role: Role.ADMIN
        }
      });
      console.log("Created new admin user.");
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
