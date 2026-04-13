import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, usersTable, activityLogsTable, ordersTable, newsletterSubscribersTable } from "@workspace/db";
import { desc, sql, count, sum } from "drizzle-orm";

const router: IRouter = Router();

const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(sql`id = ${userId}`);
  if (!user || !user.isAdmin) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
};

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  const [userCount] = await db.select({ count: count() }).from(usersTable);
  const [orderCount] = await db.select({ count: count() }).from(ordersTable);
  const [revenue] = await db.select({ total: sum(ordersTable.total) }).from(ordersTable).where(sql`status != 'cancelled'`);
  const [activityCount] = await db.select({ count: count() }).from(activityLogsTable);
  const [newsletterCount] = await db.select({ count: count() }).from(newsletterSubscribersTable);

  res.json({
    totalUsers: userCount.count,
    totalOrders: orderCount.count,
    totalRevenue: revenue.total ?? "0",
    totalActivities: activityCount.count,
    newsletterSubscribers: newsletterCount.count,
  });
});

router.get("/admin/users", requireAdmin, async (_req, res): Promise<void> => {
  const users = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      isAdmin: usersTable.isAdmin,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .orderBy(desc(usersTable.createdAt));

  res.json(users);
});

router.get("/admin/orders", requireAdmin, async (_req, res): Promise<void> => {
  const orders = await db
    .select({
      id: ordersTable.id,
      userId: ordersTable.userId,
      guestEmail: ordersTable.guestEmail,
      status: ordersTable.status,
      items: ordersTable.items,
      subtotal: ordersTable.subtotal,
      shippingCost: ordersTable.shippingCost,
      total: ordersTable.total,
      shippingAddress: ordersTable.shippingAddress,
      paymentMethod: ordersTable.paymentMethod,
      transactionId: ordersTable.transactionId,
      createdAt: ordersTable.createdAt,
      updatedAt: ordersTable.updatedAt,
    })
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt));

  const ordersWithUser = await Promise.all(
    orders.map(async (order) => {
      if (order.userId) {
        const [user] = await db
          .select({ email: usersTable.email, firstName: usersTable.firstName, lastName: usersTable.lastName })
          .from(usersTable)
          .where(sql`id = ${order.userId}`);
        return { ...order, userEmail: user?.email, userName: user ? `${user.firstName} ${user.lastName}` : null };
      }
      return { ...order, userEmail: order.guestEmail, userName: "Guest" };
    })
  );

  res.json(ordersWithUser);
});

router.get("/admin/activity", requireAdmin, async (req, res): Promise<void> => {
  const limit = parseInt((req.query.limit as string) ?? "100");
  const offset = parseInt((req.query.offset as string) ?? "0");

  const logs = await db
    .select({
      id: activityLogsTable.id,
      userId: activityLogsTable.userId,
      action: activityLogsTable.action,
      metadata: activityLogsTable.metadata,
      ipAddress: activityLogsTable.ipAddress,
      userAgent: activityLogsTable.userAgent,
      createdAt: activityLogsTable.createdAt,
    })
    .from(activityLogsTable)
    .orderBy(desc(activityLogsTable.createdAt))
    .limit(limit)
    .offset(offset);

  const logsWithUser = await Promise.all(
    logs.map(async (log) => {
      if (log.userId) {
        const [user] = await db
          .select({ email: usersTable.email, firstName: usersTable.firstName, lastName: usersTable.lastName })
          .from(usersTable)
          .where(sql`id = ${log.userId}`);
        return { ...log, userEmail: user?.email, userName: user ? `${user.firstName} ${user.lastName}` : null };
      }
      return { ...log, userEmail: null, userName: "Anonymous" };
    })
  );

  res.json(logsWithUser);
});

router.get("/admin/newsletter", requireAdmin, async (_req, res): Promise<void> => {
  const subscribers = await db
    .select()
    .from(newsletterSubscribersTable)
    .orderBy(desc(newsletterSubscribersTable.createdAt));

  res.json(subscribers);
});

router.patch("/admin/orders/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body as { status: string };

  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  await db
    .update(ordersTable)
    .set({ status, updatedAt: new Date() })
    .where(sql`id = ${Number(id)}`);

  res.json({ success: true });
});

export default router;
