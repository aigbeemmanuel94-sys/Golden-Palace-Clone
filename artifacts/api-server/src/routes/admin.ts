import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, usersTable, activityLogsTable, ordersTable, newsletterSubscribersTable, productsTable } from "@workspace/db";
import { desc, eq, sql, count, sum } from "drizzle-orm";
import { ObjectStorageService } from "../lib/objectStorage";

const objectStorageService = new ObjectStorageService();

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

router.post("/admin/products", requireAdmin, async (req, res): Promise<void> => {
  try {
    const body = req.body as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const price = typeof body.price === "string" ? body.price.trim() : "";
    let imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";

    if (!name || !price || !imageUrl) {
      res.status(400).json({ error: "name, price, and imageUrl are required" });
      return;
    }

    if (imageUrl.includes("storage.googleapis.com")) {
      imageUrl = objectStorageService.normalizeObjectEntityPath(imageUrl);
    }
    if (imageUrl.startsWith("/objects/")) {
      imageUrl = `/api/storage${imageUrl}`;
    }

    const [product] = await db
      .insert(productsTable)
      .values({
        name,
        description: typeof body.description === "string" ? body.description : null,
        price,
        originalPrice: typeof body.originalPrice === "string" ? body.originalPrice : null,
        imageUrl,
        categoryId: typeof body.categoryId === "number" ? body.categoryId : null,
        categoryName: typeof body.categoryName === "string" ? body.categoryName : null,
        isNewArrival: body.isNewArrival === true,
        isTrending: body.isTrending === true,
        badge: typeof body.badge === "string" ? body.badge : null,
        weight: typeof body.weight === "string" ? body.weight : null,
      })
      .returning();

    res.status(201).json(product);
  } catch (err) {
    req.log.error({ err }, "Error creating product");
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.patch("/admin/products/:id", requireAdmin, async (req, res): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const body = req.body as Record<string, unknown>;

    const updates: Record<string, unknown> = {};
    if (typeof body.name === "string") updates.name = body.name.trim();
    if ("description" in body) updates.description = typeof body.description === "string" ? body.description : null;
    if (typeof body.price === "string") updates.price = body.price.trim();
    if ("originalPrice" in body) updates.originalPrice = typeof body.originalPrice === "string" ? body.originalPrice : null;
    if (typeof body.imageUrl === "string") {
      let imageUrl = body.imageUrl;
      if (imageUrl.includes("storage.googleapis.com")) {
        imageUrl = objectStorageService.normalizeObjectEntityPath(imageUrl);
      }
      if (imageUrl.startsWith("/objects/")) {
        imageUrl = `/api/storage${imageUrl}`;
      }
      updates.imageUrl = imageUrl;
    }
    if ("categoryId" in body) updates.categoryId = typeof body.categoryId === "number" ? body.categoryId : null;
    if ("categoryName" in body) updates.categoryName = typeof body.categoryName === "string" ? body.categoryName : null;
    if (typeof body.isNewArrival === "boolean") updates.isNewArrival = body.isNewArrival;
    if (typeof body.isTrending === "boolean") updates.isTrending = body.isTrending;
    if ("badge" in body) updates.badge = typeof body.badge === "string" ? body.badge : null;
    if ("weight" in body) updates.weight = typeof body.weight === "string" ? body.weight : null;

    const [product] = await db
      .update(productsTable)
      .set(updates)
      .where(eq(productsTable.id, id))
      .returning();

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    req.log.error({ err }, "Error updating product");
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/admin/products/:id", requireAdmin, async (req, res): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [deleted] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    req.log.error({ err }, "Error deleting product");
    res.status(500).json({ error: "Failed to delete product" });
  }
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
