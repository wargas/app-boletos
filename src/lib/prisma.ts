import { PrismaClient } from "@prisma/client";
import { addHours } from "date-fns";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends({
    name: 'name',
    result: {
      boleto: {
        due: {
          needs: { due: true},
          compute(data) {
            const dueDate = addHours(data.due, 4)
            return dueDate
          },
        }
      }
    }
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;