import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({});
  console.log("Deleted all products");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
