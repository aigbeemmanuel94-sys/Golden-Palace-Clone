import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import cartRouter from "./cart";
import newsletterRouter from "./newsletter";
import adminRouter from "./admin";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(cartRouter);
router.use(newsletterRouter);
router.use(adminRouter);
router.use(storageRouter);

export default router;
