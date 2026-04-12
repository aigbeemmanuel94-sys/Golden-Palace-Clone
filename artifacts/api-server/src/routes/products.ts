import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  GetProductParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  const params = ListProductsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.categoryId !== undefined) {
    conditions.push(eq(productsTable.categoryId, params.data.categoryId));
  }
  if (params.data.isNewArrival !== undefined) {
    conditions.push(eq(productsTable.isNewArrival, params.data.isNewArrival));
  }
  if (params.data.isTrending !== undefined) {
    conditions.push(eq(productsTable.isTrending, params.data.isTrending));
  }

  const products = conditions.length > 0
    ? await db.select().from(productsTable).where(and(...conditions))
    : await db.select().from(productsTable);

  res.json(products);
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProductParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, params.data.id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(product);
});

export default router;
