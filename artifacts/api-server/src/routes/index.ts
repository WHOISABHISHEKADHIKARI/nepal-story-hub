import { Router } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import categoriesRouter from "./categories";
import authorsRouter from "./authors";

const router = Router();

router.use(healthRouter);
router.use("/posts", postsRouter);
router.use("/categories", categoriesRouter);
router.use("/authors", authorsRouter);

export default router;
