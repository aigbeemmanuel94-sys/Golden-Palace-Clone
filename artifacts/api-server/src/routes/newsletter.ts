import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, newsletterSubscribersTable } from "@workspace/db";
import { SubscribeNewsletterBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/newsletter/subscribe", async (req, res): Promise<void> => {
  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email } = parsed.data;

  const [existing] = await db
    .select()
    .from(newsletterSubscribersTable)
    .where(eq(newsletterSubscribersTable.email, email.toLowerCase()));

  if (existing) {
    res.status(409).json({ error: "Already subscribed" });
    return;
  }

  await db
    .insert(newsletterSubscribersTable)
    .values({ email: email.toLowerCase() });

  res.status(201).json({ message: "Successfully subscribed to our newsletter" });
});

export default router;
