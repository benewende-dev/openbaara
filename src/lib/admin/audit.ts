import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

type Json = Prisma.InputJsonValue;

/** Trace un changement fait depuis la console. */
export async function audit(
  adminId: string,
  action: string,
  entity: string,
  entityId: string | null,
  before?: Json | null,
  after?: Json | null,
  tx: Prisma.TransactionClient = prisma,
): Promise<void> {
  await tx.auditLog.create({
    data: { adminId, action, entity, entityId, before: before ?? undefined, after: after ?? undefined },
  });
}
