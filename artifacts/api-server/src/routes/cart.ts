import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, cartItemsTable, productsTable } from "@workspace/db";
import {
  AddToCartBody,
  UpdateCartItemParams,
  UpdateCartItemBody,
  RemoveCartItemParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function requireAuth(req: any, res: any): number | null {
  const userId = req.session?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return null;
  }
  return userId;
}

router.get("/cart", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const items = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.userId, userId));

  const withProducts = await Promise.all(
    items.map(async (item) => {
      const [product] = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, item.productId));
      return { ...item, product };
    })
  );

  res.json(withProducts.filter((item) => item.product));
});

router.post("/cart/items", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const parsed = AddToCartBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { productId, quantity } = parsed.data;

  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.userId, userId),
        eq(cartItemsTable.productId, productId)
      )
    );

  if (existing) {
    const [updated] = await db
      .update(cartItemsTable)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItemsTable.id, existing.id))
      .returning();
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId));
    res.status(201).json({ ...updated, product });
    return;
  }

  const [item] = await db
    .insert(cartItemsTable)
    .values({ userId, productId, quantity })
    .returning();

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId));
  res.status(201).json({ ...item, product });
});

router.patch("/cart/items/:id", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateCartItemParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCartItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [item] = await db
    .update(cartItemsTable)
    .set({ quantity: parsed.data.quantity })
    .where(
      and(
        eq(cartItemsTable.id, params.data.id),
        eq(cartItemsTable.userId, userId)
      )
    )
    .returning();

  if (!item) {
    res.status(404).json({ error: "Cart item not found" });
    return;
  }

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
  res.json({ ...item, product });
});

router.delete("/cart/items/:id", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = RemoveCartItemParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db
    .delete(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.id, params.data.id),
        eq(cartItemsTable.userId, userId)
      )
    );

  res.sendStatus(204);
});

export default router;
